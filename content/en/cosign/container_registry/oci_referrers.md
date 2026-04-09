---
type: docs
category: Container Registries
title: OCI and Referrers
weight: 750
---

Cosign supports the OCI 1.1 specification, which introduces the **referrers API** for discovering artifacts associated with a container image. This page explains how cosign uses the referrers API and how to configure signature and attestation storage modes.

## Who Is This For?

This page is for:

- **Anyone migrating from cosign 2.x to 3.0+**, where the new bundle format and OCI 1.1 referrers API become the default behavior
- **Image producers** who want to understand how cosign stores signatures and attestations, and which mode is appropriate for their registry
- **Tooling authors and operators** who need to discover and inspect cosign artifacts using standard OCI tools like `oras`, independent of cosign itself
- **Anyone troubleshooting** why cosign signatures are not being found or verified, as different storage modes produce artifacts in different locations that require different discovery approaches

## What is the Referrers API?

The OCI Distribution Specification 1.1 introduced the referrers API as a standardized way to discover artifacts (like signatures, attestations, and SBOMs) associated with a container image.

Instead of relying on tag naming conventions (e.g., `sha256-<digest>.sig`), the referrers API uses a `subject` field in the artifact manifest to create a direct relationship between the artifact and the image it references. Registries that support OCI 1.1 expose a `/referrers/<digest>` endpoint that returns all artifacts linked to a given image digest.

## Valid Format and Storage Combinations

| Bundle Format | Storage Mode | Signatures | Attestations | Notes |
|--------------|--------------|------------|--------------|-------|
| New (`--new-bundle-format=true`) | Referrers (OCI 1.1) | Yes | Yes | **Default in cosign 3.0+** |
| New (`--new-bundle-format=true`) | Tag-based (OCI 1.0) | Yes | Yes | Uses referrers tag fallback (`sha256-<digest>`) |
| Old (`--new-bundle-format=false`) | Referrers (OCI 1.1) | Yes | No | Signatures only; attestations always use tags |
| Old (`--new-bundle-format=false`) | Tag-based (OCI 1.0) | Yes | Yes | Legacy mode |

### Key Constraints

1. **Old format requires disabling signing config**: When using `--new-bundle-format=false`, you must also set `--use-signing-config=false`. The default TUF-based signing config requires the new bundle format.

2. **Old format attestations always use tags**: When using `--new-bundle-format=false`, attestations are always stored using tag-based storage, regardless of any `--registry-referrers-mode` flag.

## Bundle Format: New vs Old

The `--new-bundle-format` flag controls the internal structure of the artifact cosign pushes to the registry. This is distinct from *where* it is stored (referrers API vs tag-based).

### New bundle format (default in cosign 3.0+)

Both signatures and attestations use an `artifactType` of `application/vnd.dev.sigstore.bundle.v0.3+json`, and the manifest contains a single layer that is a self-contained [sigstore bundle](https://github.com/sigstore/protobuf-specs). This bundle contains a DSSE envelope holding the signature or attestation, and all the verification material needed for offline verification.

```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "artifactType": "application/vnd.dev.sigstore.bundle.v0.3+json",
  "config": {
    "mediaType": "application/vnd.oci.empty.v1+json",
    "size": 2,
    "digest": "sha256:44136f..."
  },
  "layers": [
    {
      "mediaType": "application/vnd.dev.sigstore.bundle.v0.3+json",
      "size": 4262,
      "digest": "sha256:ab6e3f..."
    }
  ],
  "annotations": {
    "dev.sigstore.bundle.content": "dsse-envelope",
    "dev.sigstore.bundle.predicateType": "https://sigstore.dev/cosign/sign/v1",
    "org.opencontainers.image.created": "2026-03-16T17:31:24Z"
  },
  "subject": {
    "mediaType": "application/vnd.oci.image.manifest.v1+json",
    "size": 1022,
    "digest": "sha256:59855d..."
  }
}
```

See [Discovering Referrers](#discovering-referrers) for how to inspect these with `oras`.

### Old bundle format (`--new-bundle-format=false`)

**Signatures** use a config `mediaType` of `application/vnd.oci.image.config.v1+json` with layers of type `application/vnd.dev.cosign.simplesigning.v1+json`. The layer descriptor carries the cryptographic signature in the `dev.cosignproject.cosign/signature` annotation and the Rekor transparency log entry in `dev.sigstore.cosign/bundle`. Each signing event appends a new layer.

```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "size": 233,
    "digest": "sha256:806ede..."
  },
  "layers": [
    {
      "mediaType": "application/vnd.dev.cosign.simplesigning.v1+json",
      "size": 242,
      "digest": "sha256:c7875f...",
      "annotations": {
        "dev.cosignproject.cosign/signature": "MEUC...",
        "dev.sigstore.cosign/bundle": "{...}"
      }
    }
  ]
}
```

When stored via the OCI 1.1 referrers API, the config `mediaType` is `application/vnd.dev.cosign.artifact.sig.v1+json` and a `subject` field is added linking the artifact to the signed image.

**Attestations** use a config `mediaType` of `application/vnd.oci.image.config.v1+json` with layers of type `application/vnd.dsse.envelope.v1+json`. The layer blob is a DSSE envelope containing the in-toto statement. The layer descriptor carries a `predicateType` annotation identifying the attestation type, and `dev.cosignproject.cosign/signature` is empty since the signature is embedded in the envelope. Each attestation event appends a new layer.

```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "size": 342,
    "digest": "sha256:078640..."
  },
  "layers": [
    {
      "mediaType": "application/vnd.dsse.envelope.v1+json",
      "size": 676,
      "digest": "sha256:d222f2...",
      "annotations": {
        "dev.cosignproject.cosign/signature": "",
        "dev.sigstore.cosign/bundle": "{...}",
        "predicateType": "https://cosign.sigstore.dev/attestation/v1"
      }
    }
  ]
}
```

This is the format produced by cosign 1.x and 2.x, and full verification of the transparency log entry requires online access to Rekor.

## Scenario 1: New Bundle Format + OCI 1.1 Referrers

When using the default new bundle format against a registry that supports the OCI 1.1 specification, cosign will store signatures and attestations using the OCI 1.1 referrers API.

### Signing

```shell
# Key-based signing
cosign sign --key cosign.key $IMAGE

# Keyless signing (default)
cosign sign $IMAGE
```

The signature is stored as an OCI 1.1 referrer with the new sigstore bundle format.

### Verification

```shell
# Key-based verification
cosign verify --key cosign.pub $IMAGE

# Keyless verification
cosign verify \
  --certificate-identity=name@example.com \
  --certificate-oidc-issuer=https://accounts.example.com \
  $IMAGE
```

### Attestations

```shell
# Create attestation
cosign attest \
  --key cosign.key \
  --type slsaprovenance \
  --predicate predicate.json \
  $IMAGE

# Verify attestation
cosign verify-attestation \
  --key cosign.pub \
  --type slsaprovenance \
  $IMAGE
```

The attestation is stored as an OCI 1.1 referrer.

## Scenario 2: New Bundle Format + OCI 1.0 (Referrers Tag Schema Fallback)

When using the default new bundle format against a registry that does not support the OCI 1.1 referrers API, cosign automatically falls back to the **referrers tag schema** defined in the OCI Distribution Specification. Artifacts are stored under a `sha256-<digest>` index tag, and both signing and verification work transparently.

> **Note:** This fallback only works for clients that implement the OCI Distribution Specification 1.1 referrers tag schema. Tools written to look for old-format `.sig` tags will not find new-format signatures stored this way.

### Signing

```shell
# Key-based signing
cosign sign --key cosign.key $IMAGE

# Keyless signing
cosign sign $IMAGE
```

The signature is stored under a `sha256-<digest>` index tag (not a `.sig` tag).

### Verification

```shell
# Key-based verification
cosign verify --key cosign.pub $IMAGE

# Keyless verification
cosign verify \
  --certificate-identity=name@example.com \
  --certificate-oidc-issuer=https://accounts.example.com \
  $IMAGE
```

### Attestations

```shell
# Create attestation
cosign attest \
  --key cosign.key \
  --type slsaprovenance \
  --predicate predicate.json \
  $IMAGE

# Verify attestation
cosign verify-attestation \
  --key cosign.pub \
  --type slsaprovenance \
  $IMAGE
```

The attestation is stored under the same `sha256-<digest>` index tag alongside the signature.

## Scenario 3: Old Bundle Format + OCI 1.1 Referrers (Signatures Only)

This mode stores signatures using the OCI 1.1 referrers API while using the old bundle format. Note that **attestations are not supported** with OCI 1.1 in this mode, they will fall back to tag-based storage.

### Signing

```shell
# Requires COSIGN_EXPERIMENTAL=1 environment variable
COSIGN_EXPERIMENTAL=1 cosign sign \
  --key cosign.key \
  --new-bundle-format=false \
  --use-signing-config=false \
  --registry-referrers-mode=oci-1-1 \
  $IMAGE
```

The signature is stored as an OCI 1.1 referrer (discoverable via `/referrers/<digest>` endpoint).

### Verification

```shell
cosign verify \
  --key cosign.pub \
  --new-bundle-format=false \
  --experimental-oci11=true \
  $IMAGE
```

> **Important:** The `--experimental-oci11` flag is required for verification to discover signatures stored via the referrers API.

## Scenario 4: Old Bundle Format + Tag-based (OCI 1.0)

Use this mode with registries that don't support OCI 1.1.

### Signing

```shell
# With key-based signing (uploads to Rekor transparency log)
cosign sign --key cosign.key \
  --new-bundle-format=false \
  --use-signing-config=false \
  $IMAGE

# With keyless signing
cosign sign \
  --new-bundle-format=false \
  --use-signing-config=false \
  $IMAGE
```

The signature is stored at a tag: `sha256-<digest>.sig`

### Verification

```shell
# Key-based verification
cosign verify --key cosign.pub \
  --new-bundle-format=false \
  $IMAGE

# Keyless verification
cosign verify \
  --new-bundle-format=false \
  --certificate-identity=name@example.com \
  --certificate-oidc-issuer=https://accounts.example.com \
  $IMAGE
```

### Attestations

```shell
# Create attestation (uploads to Rekor)
cosign attest \
  --key cosign.key \
  --new-bundle-format=false \
  --use-signing-config=false \
  --type slsaprovenance \
  --predicate predicate.json \
  $IMAGE

# Verify attestation
cosign verify-attestation \
  --key cosign.pub \
  --new-bundle-format=false \
  --type slsaprovenance \
  $IMAGE
```

The attestation is stored as a tag: `sha256-<digest>.att`


## Discovering Referrers

You can discover all artifacts associated with an image using standard OCI tools, independently of cosign. This is useful for auditing what has been stored, debugging verification failures, or building tooling that consumes signatures and attestations.

### List all referrers

```shell
oras discover registry.example.com/myrepo@sha256:abc123...
```

For an image with both a signature and attestation in new bundle format, both appear under the same `artifactType`:

```
registry.example.com/myrepo@sha256:abc123...
└── application/vnd.dev.sigstore.bundle.v0.3+json
    ├── sha256:b6c621...
    └── sha256:d7e892...
```

For old-format signatures stored via the referrers API, the `artifactType` is distinct:

```
registry.example.com/myrepo@sha256:abc123...
└── application/vnd.dev.cosign.artifact.sig.v1+json
    └── sha256:6d2cd8...
```

### Fetch and inspect a specific artifact

To determine whether a new-format referrer is a signature or attestation, fetch the manifest to get the layer digest, then decode the DSSE envelope payload in the layer blob:

```shell
# Step 1: fetch the manifest to get the layer digest
oras manifest fetch registry.example.com/myrepo@sha256:<referrer-digest> | jq '.layers[0].digest'

# Step 2: fetch the layer and decode the predicateType from the DSSE payload
oras blob fetch --output - registry.example.com/myrepo@sha256:<layer-digest> \
  | jq '.dsseEnvelope.payload | @base64d | fromjson | .predicateType'
```

For a signature this returns `https://sigstore.dev/cosign/sign/v1`. For an attestation it returns the predicate type (e.g. `https://slsa.dev/provenance/v1` for SLSA provenance).

### Tag-based storage (OCI 1.0 fallback)

When cosign uses tag-based storage (Scenarios 2 and 4), artifacts are not accessible via the referrers API. The artifacts can be pulled directly using the appropriate tag format:

```shell
# New format fallback: referrers tag schema index
oras manifest fetch registry.example.com/myrepo:sha256-<image-digest>

# Old format: individual signature and attestation tags
oras manifest fetch registry.example.com/myrepo:sha256-<image-digest>.sig
oras manifest fetch registry.example.com/myrepo:sha256-<image-digest>.att
```
