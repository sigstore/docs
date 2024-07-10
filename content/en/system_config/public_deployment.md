---
type: docs
category: System configuration
title: Public Deployment
weight: 960
---

## Public-Good Instance

<iframe src="https://status.sigstore.dev/badge?theme=light" width="250" height="30" frameborder="0" scrolling="no"></iframe>

## Staging Instance

There is a public staging environment with staging versions of Fulcio, Rekor and an OIDC issuer, with its own roots of trust.

**NOTE** The staging environment provides neither SLO guarantees nor the same protection of the root key material for TUF. This environment is meant for development and testing only. It is not appropriate to use for production purposes.

The endpoints are as follows:

* https://fulcio.sigstage.dev
* https://rekor.sigstage.dev
* https://oauth2.sigstage.dev/auth

These instances are operated and maintained in the same manner as the public production environment for Sigstore.

### Usage

To use this instance, follow the steps below:

1. `rm -r ~/.sigstore`
1. `curl -O https://raw.githubusercontent.com/sigstore/root-signing-staging/main/metadata/root_history/1.root.json`
1. `cosign initialize --mirror=https://tuf-repo-cdn.sigstage.dev --root=1.root.json`
1. `cosign sign --oidc-issuer "https://oauth2.sigstage.dev/auth" --fulcio-url "https://fulcio.sigstage.dev" --rekor-url "https://rekor.sigstage.dev" ${IMAGE_DIGEST}`
1. `cosign verify --rekor-url "https://rekor.sigstage.dev" ${IMAGE} --certificate-identity=name@example.com --certificate-oidc-issuer=https://accounts.example.com`

* Steps 1-3 configure your local environment to use the staging keys and certificates.
* Step 4 specifies the staging environment with flags needed for signing.
* Step 5 specifies the staging environment with flags needed for verifying.

#### Revert Back to Production

In order to revert, we need to clear the local TUF root data and re-initialize with the default production TUF root data.

1. `rm -r ~/.sigstore`
1. `cosign initialize`
