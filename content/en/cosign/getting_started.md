---
title: "Getting Started"
category: "Cosign"
position: 103
---

## Quick Start

This shows how to:

* generate a keypair
* sign a container image and store that signature in the registry
* find signatures for a container image, and verify them against a public key

See the [Usage documentation](USAGE.md) for more commands!

See the [further-usage.md](further-usage.md) documentation for some fun tips and tricks!

NOTE: you will need access to a container registry for cosign to work with.
[ttl.sh](https://ttl.sh) offers free, short-lived (ie: hours), anonymous container image
hosting if you just want to try these commands out.

### Generate a keypair

```shell
$ cosign generate-key-pair
Enter password for private key:
Enter again:
Private key written to cosign.key
Public key written to cosign.pub
```

### Sign a container and store the signature in the registry

```shell
$ cosign sign --key cosign.key dlorenc/demo
Enter password for private key:
Pushing signature to: index.docker.io/dlorenc/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

The cosign command above prompts the user to enter the password for the private key.
The user can either manually enter the password, or if the environment variable `COSIGN_PASSWORD` is set then it is used automatically.


### Verify a container against a public key

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
