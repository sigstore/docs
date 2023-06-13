---
title: "FAQ"
category: "Cosign"
position: 124
---

## Can I use Cosign to sign things *besides* OCI container images?

Yes! See [Signing Blobs.](/cosign/signing_with_blobs/) But Cosign *does* have great support for OCI registries.

## Why not use Notary v2

It's hard to answer this briefly. This post contains some comparisons:

[Notary V2 and Cosign](https://medium.com/@dlorenc/notary-v2-and-cosign-b816658f044d)

If you find other comparison posts, please send a PR here and we'll link them all.


## Why not use containers/image signing

`containers/image` signing is close to `cosign`, and we reuse payload formats.
`cosign` differs in that it signs with ECDSA-P256 keys instead of PGP, and stores
signatures in the registry.

## Why not use $FOO?

See [Requirements](#design-requirements).
We designed `cosign` to meet a few specific requirements, and didn't find anything else that met all of these.
If you're aware of another system that does meet these, please let us know!

## Design Requirements

* No external services for signature storage, querying, or retrieval
* We aim for as much registry support as possible
* Everything should work over the registry API
* PGP should not be required at all.
* Users must be able to find all signatures for an image
* Signers can sign an image after push
* Multiple entities can sign an image
* Signing an image does not mutate the image
* Pure-go implementation
