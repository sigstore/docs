---
title: "Keyless Signatures"
category: "Cosign"
position: 122
---

This page explains how the keyless signatures work in Cosign. This signature mode relies on the Sigstore Public Good Instance.






## Overview


### OAuth Flows

Cosign supports two OAuth flows today: the standard flow and the device flow.

When there is no terminal attached (non-interactive mode), Cosign will automatically use the device flow
where a link is printed to stdout.
This link must be opened in a browser to complete the flow.

### Identity Tokens

In automated environments, Cosign also supports directly using OIDC Identity Tokens from specific issuers.
These can be supplied on the command line with the `--identity-token` flag.
The `audiences` field must contain `sigstore`.

Cosign also has support for detecting some of these automated environments
and producing an identity token. Currently this supports Google Compute Engine, GitHub Actions and SPIFFE tokens.

#### On GCP

From a GCE VM, you can use the VM's service account identity to sign an image:

```shell
$ IDENTITY_TOKEN=$(gcloud auth print-identity-token --audiences=sigstore)
$ cosign sign --identity-token=$IDENTITY_TOKEN $IMAGE_DIGEST
```

From outside a GCE VM, you can impersonate a GCP IAM service account to sign an image:

```shell
$ IDENTITY_TOKEN=$(gcloud auth print-identity-token \
        --audiences=sigstore \
        --include-email \
        --impersonate-service-account my-sa@my-project.iam.gserviceaccount.com)
$ cosign sign --identity-token=$IDENTITY_TOKEN $IMAGE_DIGEST
```

In order to impersonate an IAM service account, your account must have the
`roles/iam.serviceAccountTokenCreator` role.

**Note**: On Google Cloud Build, standard identity tokens are not supported through the GCE metadata server.
Cosign has a special flow for this case, where you can instruct the Cloud Build service account to impersonate
another service account.
To configure this flow:

1. Create a service account to use for signatures (the email address will be present in the certificate subject).
2. Grant the Cloud Build service account the `roles/iam.serviceAccountTokenCreator` role for this target account.
3. Set the `GOOGLE_SERVICE_ACCOUNT_NAME` environment variable to the name of the target account in your cloudbuild.yaml
4. Sign images in GCB, without keys!

### Timestamps

Signature timestamps are checked in the [rekor](https://github.com/sigstore/rekor) transparency log. Rekor's `IntegratedTime` is signed as part of its `signedEntryTimestamp`. Cosign verifies the signature over the timestamp and checks that the signature was created while the certificate was valid.

> TODO: Add more documentation here

## Public Staging Environment

There is a public staging environment that is running Fulcio, Rekor and OIDC issuer.

**NOTE** The staging environment provides no SLO guarantees nor the same protection of the root key material for TUF. This environment is meant for development and testing only, PLEASE do not use for production purposes.

The endpoints are as follows:

* https://fulcio.sigstage.dev
* https://rekor.sigstage.dev
* https://oauth2.sigstage.dev/auth

These instances are operated and maintained in the same manner as the public production environment for Sigstore.

### Usage

To use this instance, follow the steps below:

1. `rm -r ~/.sigstore`
1. `curl -O https://raw.githubusercontent.com/sigstore/root-signing/main/staging/repository/1.root.json`
1. `cosign initialize --mirror=https://tuf-repo-cdn.sigstore.dev --root=1.root.json`
1. `COSIGN_EXPERIMENTAL=1 cosign sign --oidc-issuer "https://oauth2.sigstage.dev/auth" --fulcio-url "https://fulcio.sigstage.dev" --rekor-url "https://rekor.sigstage.dev" ${IMAGE_DIGEST}`
1. `COSIGN_EXPERIMENTAL=1 cosign verify --rekor-url "https://rekor.sigstage.dev" ${IMAGE}`

* Steps 1-4 configures your local environment to use the staging keys and certificates.
* Step 5 specify the staging environment with flags needed for signing.
* Step 6 specify the staging environment with flags needed for verifying.

#### Revert Back to Production

We need to clear the local TUF root data and re-initialize with the default production TUF root data.

1. `rm -r ~/.sigstore`
1. `cosign initialize`

## Custom Components

For configuring Cosign to work with custom components, checkout the [Configuring Cosign with Custom Components](https://docs.sigstore.dev/cosign/custom_components/) docs to find out how to achieve this.

### Custom Root Cert

You can override the public good instance CA using the environment variable `SIGSTORE_ROOT_FILE`, e.g.

```shell
export SIGSTORE_ROOT_FILE="/home/jdoe/myrootCA.pem"
```
