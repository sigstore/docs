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

To use this instance, run `cosign initialize --staging`.

#### Revert Back to Production

To revert, run `cosign initialize`.
