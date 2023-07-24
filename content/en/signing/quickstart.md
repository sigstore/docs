---
title: "Cosign"
menuTitle: "Quick Start"
description: ""
category: "Signing"
position: 100
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

> NOTE: In this example, we will create a container using [ttl.sh](https://ttl.sh/).  It offers free, short-lived (as in minutes or hours), anonymous container image hosting so you can try out signing and verifying commands in a sample workflow

To use `ttl.sh` and [crane](https://github.com/google/go-containerregistry/tree/main/cmd/crane) to prepare the image to sign, run the following:

```
$ SRC_IMAGE=busybox
$ SRC_DIGEST=$(crane digest busybox)
$ IMAGE_URI=ttl.sh/$(uuidgen | head -c 8 | tr 'A-Z' 'a-z')
$ crane cp $SRC_IMAGE@$SRC_DIGEST $IMAGE_URI:1h
$ IMAGE_URI_DIGEST=$IMAGE_URI@$SRC_DIGEST
```

### Keyless signing of a container

The following code signs the created container image.  The command to sign container images is `cosign sign <image URI>`.  For our example, `<image URI>` is `$IMAGE_URI_DIGEST`. Note that for containers, there is no bundle as there is with blobs, as the signature and certificate are attached directly to the container:

```
$ cosign sign $IMAGE_URI_DIGEST
```

### Keyless verifying of a container

This works similarly to verifying a blob, but there is no need to place the certificate and signature on the `cosign verify` command. To verify a signed container image, use the following command:

```
$ cosign verify <image URI> --certificate-identity=name@example.com
                            --certificate-oidc-issuer=https://accounts.example.com
```

> Note that for our example we use the `regexp` versions of the identity options:

```
cosign verify $IMAGE_URI_DIGEST --certificate-identity-regexp=.* --certificate-oidc-issuer-regexp=.*
```

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
## SCM Integration

Cosign integrates natively with source code management (SCM) systems like GitHub and GitLab. You can use the official [GitHub Actions Cosign installer](https://github.com/marketplace/actions/cosign-installer) or use Cosign to generate and work safely with [SCM secrets](/signing/git_support/) with native API integration.

## Attestations

In addition to signatures, Cosign can be used with [In-Toto Attestations](https://github.com/in-toto/attestation).

Attestations provide an additional semantic-layer on top of plain cryptographic signatures that can be used in policy systems. Learn more in the [Attestations](/verifying/attestation) documentation.

## Other Formats

Cosign is useful not only for blobs, containers, and container-related artifacts; it can also be used for other file types.

To learn how to sign SBOMs, WASM modules, Tekton bundles and more, review [Signing Other Types](/signing/other_types/). For more information about blobs, review [Signing Blobs](/signing/signing_with_blobs/). For containers, see [Signing Containers](/signing/signing_with_containers/).

