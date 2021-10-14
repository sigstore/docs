---
title: "Missing Features"
category: "Cosign"
position: 12
---

### Intentionally Missing Features

`cosign` only generates ECDSA-P256 keys and uses SHA256 hashes.
Keys are stored in PEM-encoded PKCS8 format.
However, you can use `cosign` to store and retrieve signatures in any format, from any algorithm.

### Unintentionally Missing Features

`cosign` will integrate with transparency logs!
See https://github.com/sigstore/cosign/issues/34 for more info.

`cosign` will integrate with even more transparency logs, and a PKI.
See https://github.com/sigStore/fulcio for more info.

`cosign` will also support The Update Framework for delegations, key discovery and expiration.
See https://github.com/sigstore/cosign/issues/86 for more info!
