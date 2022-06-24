---
title: "Cosign"
menuTitle: "Overview"
description: ""
category: "Cosign"
position: 100
features:
  - Hardware and KMS signing
  - Bring-your-own PKI
  - Our free OIDC PKI (Fulcio https://github.com/sigstore/fulcio)
  - Built-in binary transparency and timestamping service (Rekor)
  - Kubernetes policy enforcement
  - Rego and Cuelang integrations for policy definition
---

<img src="/cosign_overview_v1.jpg" class="light-img" width="1280" height="640" alt=""/>

Cosign supports container signing, verification and storage in an OCI registry.
Cosign aims to make signatures invisible infrastructure.

<img src="/cosign.gif" class="light-img" width="1280" height="640" alt=""/>

Cosign supports:

<list :items="features" type="info"></list>

Cosign is part of the sigstore project. Join us on our [Slack channel](https://sigstore.slack.com/) (need an [invite](https://links.sigstore.dev/slack-invite)?)

[//]: # (In case the invite link is expired, ping Dan on Slack or via Twitter: @lorenc_dan)

## Getting Started

### Quick Start

This shows how to:

1. generate a keypair
1. sign a container image and store that signature in the registry
1. find signatures for a container image, and verify them against a public key

See the [Usage documentation](usage) for detailed information, and see the [further usage docs](further_usage) for some fun tips and tricks!

#### Prereqs

You'll need to install `cosign` first, and you will need access to a container registry for cosign to work with.
To install `cosign`, see the [Installation instructions](installation).

[ttl.sh](https://ttl.sh) offers free, short-lived (ie: hours), anonymous container image
hosting if you just want to try these commands out.

#### 1. Generate a keypair

```shell
$ cosign generate-key-pair
Enter password for private key:
Enter again:
Private key written to cosign.key
Public key written to cosign.pub
```

#### 2. Sign a container and store the signature in the registry

```shell
$ cosign sign --key cosign.key dlorenc/demo
Enter password for private key:
Pushing signature to: index.docker.io/dlorenc/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

The cosign command above prompts the user to enter the password for the private key.
The user can either manually enter the password, or if the environment variable `COSIGN_PASSWORD` is set then it is used automatically.

#### 3. Verify a container against a public key

This command returns `0` if *at least one* `cosign` formatted signature for the image is found
matching the public key.
See the detailed usage below for information and caveats on other signature formats.

Any valid payloads are printed to stdout, in json format.
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

`cosign` comes with a few builtin Kubernetes integrations: `Secret` generation and a [policy webhook](installation#cosigned) called `cosigned`.
In addition to `cosigned`, `cosign` is also compatible with and supported in other policy engines such as:

* [Conaisseur](https://github.com/sse-secure-systems/connaisseur#what-is-connaisseur)
* [Kyverno](https://kyverno.io/docs/writing-policies/verify-images/)
* [OPA Gatekeeper](https://github.com/sigstore/cosign-gatekeeper-provider)

To learn how to use `cosign` with Kubernetes, see [kubernetes](kubernetes).

## More Info

`cosign` can do lots more than is shown here.
To see more information on the commands, checkout the [detailed usage](usage).

### Other Formats

`cosign` is primarly for containers and container-related artifacts, but it can also be used for other file types!
To learn how to sign SBOMs, WASM modules, Tekton bundles and more, see [other types](other_types).
For basic blobs, see the [documentation](working-with-blobs) on working with blobs.

### SCM Integration

`cosign` integrates natively with SCM systems like `GitHub` and `GitLab`.
You can use the official [GitHub Action](https://github.com/marketplace/actions/cosign-installer)
or use `cosign` to generate and work safely with [SCM secrets](git_support) with native API integration.

### Attestations

In addition to signatures, `cosign` can be used with [In-Toto Attestations](https://github.com/in-toto/attestation).
Attestations provide an additional semantic-layer on top of plain cryptographic signatures that can be used in policy systems.
