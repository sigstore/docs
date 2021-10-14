---
title: "FAQ"
category: "Cosign"
position: 20
---

## FAQ

### Why not use Notary v2

### Why not use containers/image signing

`containers/image` signing is close to `cosign`, and we reuse payload formats.
`cosign` differs in that it signs with ECDSA-P256 keys instead of PGP, and stores
signatures in the registry.

### Why not use $FOO?

See the next section, [Requirements](#Requirements).
I designed this tool to meet a few specific requirements, and didn't find
anything else that met all of these.
If you're aware of another system that does meet these, please let me know!

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
