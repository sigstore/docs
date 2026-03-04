---
type: docs
category: Container Registries
title: OCI and Referrers
weight: 750
---

Cosign supports the OCI 1.1 specification, which introduces the **referrers API** for discovering artifacts associated with a container image. This page explains how cosign uses the referrers API and how to configure signature and attestation storage modes.

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

## Scenario 1: New Format + OCI 1.1 Referrers

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

## Scenario 2: New Format + OCI 1.0 (Referrers Tag Schema Fallback)

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

## Scenario 3: Old Format + OCI 1.1 Referrers (Signatures Only)

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

## Scenario 4: Old Format + Tag-based (OCI 1.0)

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

You can discover all artifacts associated with an image using the OCI referrers API:

```shell
# Using curl
curl https://registry.example.com/v2/myrepo/referrers/sha256:abc123...

# Using oras
oras discover registry.example.com/myrepo@sha256:abc123...
```
