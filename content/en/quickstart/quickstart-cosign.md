---
type: docs
category: Quickstart
description: Sign and Verify with Cosign
title: Sigstore Quickstart with Cosign
weight: 5
---

![Cosign Overview](/sigstore_cosign-horizontal-color.svg)

Join us on our [Slack channel](https://sigstore.slack.com/). (Need an [invite](https://links.sigstore.dev/slack-invite)?)

## Quickstart signing and verifying with Cosign

Cosign is a command line utility that is used to sign software artifacts and verify signatures using Sigstore.

Sigstore has a number of [language specific clients](../../language_clients/language_client_overview) that you can use to build custom tooling. Although a number of the clients include a basic CLI, Cosign is the recommended tool for signing and verifying.

This quickstart will walk you through how to sign and verify a blob and a container.

### Installation

To sign software artifacts and verify signatures using Sigstore, you need to install Cosign. Instructions to install Cosign can be found on the [Cosign Installation page]({{< relref "cosign/system_config/installation">}}). This will allow you to sign and verify both blobs and containers.

### Signing a blob

The basic signing format for a blob is as follows:

```bash
cosign sign-blob <file> --bundle artifact.sigstore.json
```

The bundle contains signing metadata, including the signature, certificate, timestamp and proof of transparency log inclusion.

The Cosign command requests a certificate from the Sigstore certificate authority, Fulcio. Fulcio checks your identity by using an authentication protocol (OpenID Connect) to confirm your email address. If your identity is correct, Fulcio grants a short-lived, time-stamped certificate. The certificate is bound to the public key to attest to your identity. This activity is logged using the Sigstore signature transparency log, Rekor.

Note that you don’t need to use a key to sign. Currently, you can authenticate with Google, GitHub, or Microsoft, which will associate your identity with a short-lived signing key. 

For more information about Cosign's additional options and features, run the command:

```
cosign sign-blob --help
```

### Verifying a signed blob

To verify a signed blob, you need to provide three pieces of information:

- The artifact blob
- The verification bundle, containing the signature, certificate, and proof of log inclusion
- The identity used in signing

The following example verifies the signature on `file.txt` from user `name@example.com` issued by `accounts@example.com`. It uses a provided bundle `artifact.sigstore.json` that contains the certificate and signature.

```bash
cosign verify-blob file.txt --bundle artifact.sigstore.json \
  --certificate-identity=name@example.com --certificate-oidc-issuer=https://accounts.example.com
```

Cosign verifies the signed timestamp in the bundle, and uses the timestamp when verifying the short-lived code signing certificate containing the ephemeral public key.
A signature is valid if the timestamp falls within the small time window of certificate issuance.
Cosign then uses the certificate's public key to verify the artifact signature. Cosign also verifies the proof of transparency log inclusion
artifact and its certificate.

## Example: Working with containers

> NOTE: You will need access to a container registry for Cosign to work with. If you're not sure what container registry to use, you can set up a local one for testing.

[google/go-containerregistry](https://github.com/google/go-containerregistry) allows you to run a container registry locally, and [ko-build/ko](https://github.com/ko-build/ko) lets you build an image:

```shell
google/go-containerregistry$ go run cmd/registry/main.go
serving on port 1338
```

```shell
sigstore/cosign$ ko build cmd/conformance/main.go
Published localhost:1338/demo/main.go-38af7bca496e2316e5b02c5d5bafd5f3@sha256:a5a6744c9d069ac7081ceccc2291995a999f02b027995cd5e8508f35e40e7dd1
$ export IMAGE_URI_DIGEST=localhost:1338/demo/main.go-38af7bca496e2316e5b02c5d5bafd5f3@sha256:a5a6744c9d069ac7081ceccc2291995a999f02b027995cd5e8508f35e40e7dd1
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

## SCM Integration

Cosign integrates natively with source code management (SCM) systems like GitHub and GitLab. You can use the official [GitHub Actions Cosign installer](https://github.com/marketplace/actions/cosign-installer) or use Cosign to generate and work safely with [SCM secrets]({{< relref "cosign/signing/git_support">}}) with native API integration.

## Attestations

In addition to signatures, Cosign can be used with [In-Toto Attestations](https://github.com/in-toto/attestation).

Attestations provide an additional semantic-layer on top of plain cryptographic signatures that can be used in policy systems. Learn more in the [Attestations]({{< relref "cosign/verifying/attestation">}}) documentation.

## Other Formats

Cosign is useful not only for blobs, containers, and container-related artifacts; it can also be used for other file types.

To learn how to sign SBOMs, WASM modules, Tekton bundles and more, review [Signing Other Types]({{< relref "cosign/signing/other_types" >}}). For more information about blobs, review [Signing Blobs]({{< relref "cosign/signing/signing_with_blobs" >}}). For containers, see [Signing Containers]({{< relref "cosign/signing/signing_with_containers" >}}).
