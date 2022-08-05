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

Cosign supports container signing, verification, and storage in an OCI registry.
Cosign aims to make signatures invisible infrastructure.

![Cosign demo gif](/cosign.gif)

Cosign supports:

<list :items="features" type="info"></list>

Cosign is part of the Sigstore project. Join us on our [Slack channel](https://sigstore.slack.com/) (need an [invite](https://links.sigstore.dev/slack-invite)?)

## Getting Started (Quick Start)

To get up and running we'll demonstrate how to: 

1. Generate a keypair
1. Sign a container image and store that signature in the registry
1. Find signatures for a container image, and verify them against a public key

### Prerequisites

You'll need to [install Cosign](installation) first, and you will need access to a container registry.

[ttl.sh](https://ttl.sh) offers free, short-lived (hours), anonymous container image
hosting if you just want to try out these commands.

### 1. Generate a keypair

```shell
$ cosign generate-key-pair
Enter password for private key:
Enter again:
Private key written to cosign.key
Public key written to cosign.pub
```

### 2. Sign a container and store the signature in the registry

```shell
$ cosign sign --key cosign.key user/demo
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

The `cosign` command above prompts the user to enter the password for the private key.
The user can manually enter the password, or set an environment variable with `COSIGN_PASSWORD` to use a password automatically.

### 3. Verify a container against a public key

This command returns `0` if *at least one* `cosign` formatted signature for the image is found
matching the public key. Review the other sections of this site for information and caveats on other signature formats.

Any valid payloads are printed to `stdout`, in JSON format.
Note that these signed payloads include the digest of the container image, which is how we can be
sure these "detached" signatures cover the correct image.

```shell
$ cosign verify --key cosign.pub dlorenc/demo
The following checks were performed on these signatures:
  - The cosign claims were validated
  - The signatures were verified against the specified public key
{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"sha256:87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8"},"Type":"cosign container image signature"},"Optional":null}
```

## Kubernetes Integrations

Cosign comes with a few built-in Kubernetes integrations: `Secret` generation, and a [policy webhook](../policy-controller/overview) `policy-controller`.
In addition to the `policy-controller`, Cosign is also compatible with and supported by other policy engines such as:

* [Conaisseur](https://github.com/sse-secure-systems/connaisseur#what-is-connaisseur)
* [Kyverno](https://kyverno.io/docs/writing-policies/verify-images/)
* [OPA Gatekeeper](https://github.com/sigstore/cosign-gatekeeper-provider)

To learn how to use Cosign with Kubernetes, review [Kubernetes](kubernetes).

## More Info

Cosign can do much more than what is discussed here. Review more information on the commands by checking out the other sections of this site.

### Other Formats

Cosign is useful not only for containers and container-related artifacts; it can also be used for other file types. 

To learn how to sign SBOMs, WASM modules, Tekton bundles and more, review the [Signing Other Types](other_types) section. For basic blobs, review the [Working with blobs](working_with_blobs) section.

### SCM Integration

Cosign integrates natively with source code management (SCM) systems like GitHub and GitLab.
You can use the official [GitHub Actions Cosign installer](https://github.com/marketplace/actions/cosign-installer) or use `cosign` to generate and work safely with [SCM secrets](git_support) with native API integration.

### Attestations

In addition to signatures, Cosign can be used with [In-Toto Attestations](https://github.com/in-toto/attestation).
Attestations provide an additional semantic-layer on top of plain cryptographic signatures that can be used in policy systems.
