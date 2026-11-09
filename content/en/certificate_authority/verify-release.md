---
type: docs
category: Certificate authority
menuTitle: Verifying Releases
title: Verifying Fulcio Releases
weight: 1730
---

Before running a downloaded Fulcio binary or deploying a Fulcio container image, you should verify its authenticity.

Starting with Fulcio v1.10.0, release binaries and container images are signed in two ways:

1. **GitHub Artifact Attestations**: SLSA build provenance attestations signed using GitHub Actions' OIDC identity, verifiable with the [GitHub CLI (`gh`)](https://cli.github.com/).
2. **Sigstore's release artifact signing key (`artifact.pub`)**: Cryptographic signatures generated with Google Cloud KMS and recorded in the Rekor transparency log, verifiable with [Cosign]({{< relref "cosign/system_config/installation" >}}).

In the commands below, replace `<version>` (for example, `v1.10.0`), `<os>` (`linux` or `darwin`), and `<arch>` (`amd64` or `arm64`) with the release version and platform you are verifying.

## Verifying with GitHub Artifact Attestations (`gh` CLI)

### Verify the Fulcio binary

Download the binary from the [Fulcio releases page](https://github.com/sigstore/fulcio/releases) and verify its attestation with `gh attestation verify`:

```bash
curl -sSfLO "https://github.com/sigstore/fulcio/releases/download/<version>/fulcio-<os>-<arch>"

gh attestation verify "fulcio-<os>-<arch>" \
  --repo sigstore/fulcio \
  --signer-workflow sigstore/fulcio/.github/workflows/release.yml
```

### Verify the Fulcio container image

Release container images are published to `ghcr.io/sigstore/fulcio` with their attestations attached as OCI referrers:

```bash
gh attestation verify "oci://ghcr.io/sigstore/fulcio:<version>" \
  --repo sigstore/fulcio \
  --signer-workflow sigstore/fulcio/.github/workflows/build_container.yml \
  --bundle-from-oci
```

## Verifying with the Artifact Signing Key (`cosign`)

### Retrieve the artifact signing key (`artifact.pub`)

You can retrieve `artifact.pub` securely using [The Update Framework (TUF)](https://theupdateframework.io/) client:

```bash
go install github.com/theupdateframework/go-tuf/cmd/tuf-client@latest

curl -sSfLo sigstore-root.json https://raw.githubusercontent.com/sigstore/root-signing/refs/heads/main/metadata/root_history/10.root.json
tuf-client init https://tuf-repo-cdn.sigstore.dev sigstore-root.json
tuf-client get https://tuf-repo-cdn.sigstore.dev artifact.pub > artifact.pub
```

Alternatively, you can download `artifact.pub` from the [`sigstore/root-signing` repository](https://github.com/sigstore/root-signing/blob/main/targets/artifact.pub) (also attached to each Fulcio GitHub release as `release-cosign.pub`):

```bash
curl -sSfLO https://raw.githubusercontent.com/sigstore/root-signing/main/targets/artifact.pub
```

### Verify the Fulcio binary

#### For Fulcio v1.10.0 and later

Download the binary and its corresponding `.sigstore.json` bundle from the release, then verify with `cosign verify-blob`:

```bash
curl -sSfLO "https://github.com/sigstore/fulcio/releases/download/<version>/fulcio-<os>-<arch>"
curl -sSfLO "https://github.com/sigstore/fulcio/releases/download/<version>/fulcio-<os>-<arch>.sigstore.json"

cosign verify-blob \
  --key artifact.pub \
  --bundle "fulcio-<os>-<arch>.sigstore.json" \
  "fulcio-<os>-<arch>"
```

#### For Fulcio v1.9.x and earlier

Releases prior to v1.10.0 published detached base64-encoded `.sig` signatures instead of `.sigstore.json` bundles:

```bash
curl -sSfLO "https://github.com/sigstore/fulcio/releases/download/<version>/fulcio-<os>-<arch>"
curl -sSfLO "https://github.com/sigstore/fulcio/releases/download/<version>/fulcio-<os>-<arch>.sig"
base64 -d "fulcio-<os>-<arch>.sig" > "fulcio-<os>-<arch>.sig.decoded"

openssl dgst -sha256 -verify artifact.pub -signature "fulcio-<os>-<arch>.sig.decoded" "fulcio-<os>-<arch>"
```

### Verify the Fulcio container image

Use `cosign verify` with `artifact.pub` to verify the signed container image on GHCR:

```bash
cosign verify \
  --key artifact.pub \
  -a "GIT_VERSION=<version>" \
  "ghcr.io/sigstore/fulcio:<version>"
```

_Note: Fulcio v1.10.0+ container signatures use the Sigstore bundle format (`cosign` v3 default). If you are verifying with `cosign` v2.x, pass `--new-bundle-format` (note that `-a` annotation checks are not supported with `--new-bundle-format` in `cosign` v2.x)._
