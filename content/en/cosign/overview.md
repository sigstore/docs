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

Cosign is part of the Sigstore project. Join us on our [Slack channel](https://sigstore.slack.com/). (Need an [invite](https://links.sigstore.dev/slack-invite)?)

### Installation

To sign software artifacts and verify signatures using Sigstore, you need to install Cosign. Instructions to install Cosign can be found on the [Cosign Installation page](/cosign/installation/). This will allow you to sign and verify both blobs and containers.  

### Signing a blob

The basic signing format for a blob is as follows:


```
$ cosign sign-blob <file> --bundle cosign.bundle
```

The bundle contains signing metadata, including the signature and certificate.  

The Cosign command requests a certificate from the Sigstore certificate authority, Fulcio. Fulcio checks your identity by using an authentication protocol (OpenID Connect) to confirm your email address. If your identity is correct, Fulcio grants a short-lived, time-stamped certificate. The certificate is bound to the public key to attest to your identity.  This activity is logged using the Sigstore transparency and timestamping log, Rekor.
 
Note that you don’t need to use a key to sign.  Currently, you can authenticate with Google, GitHub, or Microsoft, which will associate your identity with a short-lived signing key. For more information, read [Keyless Signatures](/cosign/keyless/).

For more information about Cosign's additional options and features, run the command:

```
cosign sign-blob --help
```

### Verifying a signed blob

To verify a signed blob, you need to provide three pieces of information:
* The certificate
* The signature
* The identity used in signing

You may be provided with a bundle that includes the certificate and signature.  The blob maintainer should provide the trusted identity.

The following example verifies the signature on `file.txt` from user `name@example.com` issued by `accounts@example.com`.  It uses a provided bundle `cosign.bundle` that contains the certificate and signature.

```
$ cosign verify-blob <file> --bundle cosign.bundle --certificate-identity=name@example.com 
                              --certificate-oidc-issuer=https://accounts.example.com
```

To verify, Cosign queries the transparency log (Rekor) to compare the public key bound to the certificate, and checks the timestamp on the signature against the artifact’s entry in the transparency log. The signature is valid if its timestamp falls within the small window of time that the key pair and certificate issued by the certificate authority were valid.

### Working with containers

Signing and verifying a container is similar to working with blobs.  The Cosign command to sign a container image is:

```
$ cosign sign <image URI>
```

This works the same as signing a blob, but the signature and certificate are attached as container metadata.

To verify a signed container image, use the following command:

```
$ cosign verify <image URI> --certificate-identity=name@example.com 
                            --certificate-oidc-issuer=https://accounts.example.com
```
### Signing with a generated key

Although you do not have to use an existing key, you can generate a key or use an existing key for signing.  However, it is recommended that you use keyless signing, as a main feature of Sigstore is to make signatures invisible infrastructure.

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
### Other Formats
Cosign is useful not only for blobs, containers, and container-related artifacts; it can also be used for other file types.

To learn how to sign SBOMs, WASM modules, Tekton bundles and more, review [Signing Other Types](/cosign/other_types/). For more information about blobs, review [Working with Blobs](/cosign/working_with_blobs/).

### SCM Integration
Cosign integrates natively with source code management (SCM) systems like GitHub and GitLab. You can use the official [GitHub Actions Cosign installer](https://github.com/marketplace/actions/cosign-installer) or use cosign to generate and work safely with [SCM secrets](/cosign/git_support/) with native API integration.

### Attestations
In addition to signatures, Cosign can be used with [In-Toto Attestations](https://github.com/in-toto/attestation).

Attestations provide an additional semantic-layer on top of plain cryptographic signatures that can be used in policy systems.
