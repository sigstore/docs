---
title: "Public Deployment"
category: "Cosign"
position: 310
---

There is a public staging environment, or deployment, that is running Fulcio, Rekor and OIDC issuer.

**NOTE** The staging environment provides neither SLO guarantees nor the same protection of the root key material for TUF. This environment is meant for development and testing only. It is not appropriate to use for production purposes.

The endpoints are as follows:

* https://fulcio.sigstage.dev
* https://rekor.sigstage.dev
* https://oauth2.sigstage.dev/auth

These instances are operated and maintained in the same manner as the public production environment for Sigstore.

### Usage

To use this instance, follow the steps below:

1. `rm -r ~/.sigstore`
1. `curl -O https://raw.githubusercontent.com/sigstore/root-signing/main/staging/repository/1.root.json`
1. `cosign initialize --mirror=https://tuf-repo-cdn.sigstage.dev --root=1.root.json`
1. `cosign sign --oidc-issuer "https://oauth2.sigstage.dev/auth" --fulcio-url "https://fulcio.sigstage.dev" --rekor-url "https://rekor.sigstage.dev" ${IMAGE_DIGEST}`
1. `cosign verify --rekor-url "https://rekor.sigstage.dev" ${IMAGE}` --certificate-identity=name@example.com
                                                                     --certificate-oidc-issuer=https://accounts.example.com

* Steps 1-4 configure your local environment to use the staging keys and certificates.
* Step 5 specifies the staging environment with flags needed for signing.
* Step 6 specifies the staging environment with flags needed for verifying.

#### Revert Back to Production

In order to revert, we need to clear the local TUF root data and re-initialize with the default production TUF root data.

1. `rm -r ~/.sigstore`
1. `cosign initialize`

