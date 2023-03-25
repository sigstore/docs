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

Cosign is part of the Sigstore project. Join us on our [Slack channel](https://sigstore.slack.com/) (need an [invite](https://links.sigstore.dev/slack-invite)?)

### Installation

To get sigstore up and running, you simply need to install Cosign. instructions to install Cosign can be found at https://docs.sigstore.dev/cosign/installation/. 

This will allow you to sign both blobs and containers.   If you need a sample container to test signing with, you can create one by following the instructions at: https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images

### Signing a blob

The basic signing format for a blob is as follows:


```
$ cosign sign-blob <file> --bundle txtbundle.bundle
```

The bundle contains signing metadata, including the signature and certificate.  

The Cosign command requests a certificate from our Certificate Authority Fulcio. Fulcio checks your identity by using an authentication protocol (OpenID Connect) to look at your email address. If your identity is correct, Fulcio grants a short-lived, time-stamped certificate. The certificate is bound to the public key to attest to your identity.  This activity is logged using Rekor.
 
Note that you don’t need to use a key to sign.  Currently, you can authenticate with Google, GitHub, or Microsoft. For more information, read [Keyless Signatures](https://docs.sigstore.dev/cosign/keyless/).

Cosign has additional options and features.   For more information enter the command:

```
cosign sign-blob --help
```

### Verifying a signed blob

To verify a signed blob, you need to provide three pieces of information:
* The certificate, found in the bundle
* The signature, also found in the bundle
* The identity used in signing

The following example verifies the signature on file.txt from user "name@example.com" issued by "accounts@example.com":

```
$ cosign verify-blob file.txt --bundle txtbundle.bundle --certificate-identity=name@example.com 
                              --certificate-oidc-issuer=https://accounts.example.com
```

To verify, Cosign queries the transparency log to compare the public key to what’s in Rekor, and checks the timestamp on the signature against the artifact’s entry in the transparency log. The signature is valid if its timestamp falls within the small window of time that the key pair and certificate issued by OpenID Connect were valid.

### Working with containers

Signing and verifying a container is similar to working with blobs.   The Cosign command to sign a container image is:

```
$ cosign sign <image URI>
```

This works the same as signing a blob, but the signature becomes attached to the container itself.

To verify a signed container image, use the following command:

```
$ cosign verify <image URI>
```
### Signing with a generated key

While you do not have to use an existing key you can generate a key and sign with it or another key you may wish to use.  However, it is recommended that you use keyless signing.

To generate keys using a KMS provider, you can use the cosign generate-key-pair command with the --kms flag.

```
$ cosign generate-key-pair --kms <some provider>://<some key>
```

The following example shows the process of signing with an existing key.  You must enter the password of the private key to sign.
```
$ cosign sign --key cosign.key user/demo
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79be4def8.sig
```
