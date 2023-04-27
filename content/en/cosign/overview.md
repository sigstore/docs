---
title: "Cosign"
menuTitle: "Overview"
description: ""
category: "Cosign"
position: 100
features:
  - Hardware and KMS signing
  - Bring-your-own PKI
  - Our free OIDC PKI (Fulcio)
  - Built-in binary transparency and timestamping service (Rekor)
  - Kubernetes policy enforcement
  - Rego and Cuelang integrations for policy definition
---

![Cosign Overview](/sigstore_cosign-horizontal-color.svg)

## Getting Started (Quick Start)

Cosign is a command line utility that can sign and verify software artifact, such as container images and blobs.
Join us on our [Slack channel](https://sigstore.slack.com/). (Need an [invite](https://links.sigstore.dev/slack-invite)?)

### Installation

To sign software artifacts and verify signatures using Sigstore, you need to install Cosign. Instructions to install Cosign can be found on the [Cosign Installation page](/cosign/installation/). This will allow you to sign and verify both blobs and containers.

### Signing a blob

The basic signing format for a blob is as follows:

```
$ cosign sign-blob <file> --bundle cosign.bundle
```

The bundle contains signing metadata, including the signature and certificate.

The Cosign command requests a certificate from the Sigstore certificate authority, Fulcio. Fulcio checks your identity by using an authentication protocol (OpenID Connect) to confirm your email address. If your identity is correct, Fulcio grants a short-lived, time-stamped certificate. The certificate is bound to the public key to attest to your identity. This activity is logged using the Sigstore transparency and timestamping log, Rekor.

Note that you don’t need to use a key to sign. Currently, you can authenticate with Google, GitHub, or Microsoft, which will associate your identity with a short-lived signing key. 

For more information about Cosign's additional options and features, run the command:

```
cosign sign-blob --help
```

### Verifying a signed blob

To verify a signed blob, you need to provide three pieces of information:

- The certificate
- The signature
- The identity used in signing

You may be provided with a bundle that includes the certificate and signature. The blob maintainer should provide the trusted identity.

The following example verifies the signature on `file.txt` from user `name@example.com` issued by `accounts@example.com`. It uses a provided bundle `cosign.bundle` that contains the certificate and signature.

```
$ cosign verify-blob <file> --bundle cosign.bundle --certificate-identity=name@example.com
                              --certificate-oidc-issuer=https://accounts.example.com
```

To verify, Cosign queries the transparency log (Rekor) to compare the public key bound to the certificate, and checks the timestamp on the signature against the artifact’s entry in the transparency log. The signature is valid if its timestamp falls within the small window of time that the key pair and certificate issued by the certificate authority were valid.

## Example: Working with containers

> NOTE: In this example, we will create a container using [ttl.sh](https://ttl.sh/).  It offers free, short-lived (i.e., hours), anonymous container image hosting if you just want to try out signing and verifying commands.  

To use `ttl.sh` and [crane](https://github.com/google/go-containerregistry/tree/main/cmd/crane) to prepare the image that we want to sign. Run the following:

```
$ SRC_IMAGE=busybox
$ SRC_DIGEST=$(crane digest busybox)
$ IMAGE_URI=ttl.sh/$(uuidgen | head -c 8 | tr 'A-Z' 'a-z')
$ crane cp $SRC_IMAGE@$SRC_DIGEST $IMAGE_URI:1h
$ IMAGE_URI_DIGEST=$IMAGE_URI@$SRC_DIGEST
```

### Keyless signing of a container

The following code signs the created container image.  The command to sign container images is `cosign sign <image URI>`.  Note that for containers, there is no bundle as there is with blobs, as the signature and certificate are attached directly to the container:

```
$ cosign sign $IMAGE_URI_DIGEST
Generating ephemeral keys...
Retrieving signed certificate...
Successfully verified SCT...

	Note that there may be personally identifiable information associated with this signed artifact.
	This may include the email address associated with the account with which you authenticate.
	This information will be used for signing this artifact and will be stored in public transparency logs and cannot be removed later.

By typing 'y', you attest that you grant (or have permission to grant) and agree to have this information stored permanently in transparency logs.
Are you sure you would like to continue? [y/N] y
tlog entry created with index: 18914440
Pushing signature to: ttl.sh/4d6d55ae
```

### Keyless verifying of a container

This works the similar to verifying a blob, but there is no need to place the certificate and signature on the verify command. To verify a signed container image, use the following command:

```
$ cosign verify <image URI> --certificate-identity=name@example.com
                            --certificate-oidc-issuer=https://accounts.example.com
```

> Note that for our example we use the `regexp` versions of the identity options:

```
cosign verify $IMAGE_URI_DIGEST --certificate-identity-regexp=.* --certificate-oidc-issuer-regexp=.*

Verification for ttl.sh/4d6d55ae@sha256:b5d6fe0712636ceb7430189de28819e195e8966372edfc2d9409d79402a0dc16 --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates

[{"critical":{"identity":{"docker-reference":"ttl.sh/4d6d55ae"},"image":{"docker-manifest-digest":"sha256:b5d6f2a0dc1"

...
```

The rest of the flags (annotations, claims, tlog, etc.) all work the same.

The above example uses ephemeral keys and certificates, which are signed automatically by the `fulcio` CA.
Signatures are stored in the `rekor` transparency log, which automatically provides an attestation
as to when the signature was created.

Information on the `fulcio` CA can be found in the [fulcio repository](https://github.com/sigstore/fulcio).  Information about the `rekor` log can be found in the [rekor repository](https://github.com/sigstore/rekor).

## Signing with a generated key

It is recommended that you use keyless signing, as a main feature of Sigstore is to make signatures invisible infrastructure that do not require key management. However, Sigstore allows you to use an existing key or generate a key if you prefer.

To generate keys using Cosign, use the `cosign generate-key-pair` command.

```
$ cosign generate-key-pair
```

The following example shows the process of signing with an existing key. You must enter the password of the private key to sign.

```
$ cosign sign --key cosign.key user/demo
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79be4def8.sig
```
## OAuth Flows

Cosign supports two OAuth flows today: the standard flow and the device flow.

When there is no terminal attached (non-interactive mode), Cosign will automatically use the device flow
where a link is printed to stdout.
This link must be opened in a browser to complete the flow.

## Identity Tokens

In automated environments, Cosign also supports directly using OIDC Identity Tokens from specific issuers.
These can be supplied on the command line with the `--identity-token` flag.
The `audiences` field must contain `sigstore`.

Cosign also has support for detecting some of these automated environments
and producing an identity token. Currently this supports Google Compute Engine, GitHub Actions and SPIFFE tokens.

### On GCP

From a GCE VM, you can use the VM's service account identity to sign an image:

```
$ IDENTITY_TOKEN=$(gcloud auth print-identity-token --audiences=sigstore)
$ cosign sign --identity-token=$IDENTITY_TOKEN $IMAGE_DIGEST
```

From outside a GCE VM, you can impersonate a GCP IAM service account to sign an image:

```
$ IDENTITY_TOKEN=$(gcloud auth print-identity-token \
        --audiences=sigstore \
        --include-email \
        --impersonate-service-account my-sa@my-project.iam.gserviceaccount.com)
$ cosign sign --identity-token=$IDENTITY_TOKEN $IMAGE_DIGEST
```

In order to impersonate an IAM service account, your account must have the
`roles/iam.serviceAccountTokenCreator` role.

> Note: On Google Cloud Build, standard identity tokens are not supported through the GCE metadata server.
Cosign has a special flow for this case, where you can instruct the Cloud Build service account to impersonate
another service account.
To configure this flow:

1. Create a service account to use for signatures (the email address will be present in the certificate subject).
2. Grant the Cloud Build service account the `roles/iam.serviceAccountTokenCreator` role for this target account.
3. Set the `GOOGLE_SERVICE_ACCOUNT_NAME` environment variable to the name of the target account in your cloudbuild.yaml
4. Sign images in GCB, without keys!


## Other Formats

Cosign is useful not only for blobs, containers, and container-related artifacts; it can also be used for other file types.

To learn how to sign SBOMs, WASM modules, Tekton bundles and more, review [Signing Other Types](/cosign/other_types/). For more information about blobs, review [Signing with Blobs](/cosign/signing_with_blobs/).

