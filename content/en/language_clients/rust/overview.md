---
type: docs
category: Rust
title: Rust Client Overview
weight: 5
---

[`sigstore`](https://crates.io/crates/sigstore) is a crate designed to interact with Sigstore architecture.

This crate is under active development, but will not be considered stable until the 1.0 release.

## Features

- Cosign sign and verify
- Fulcio integration including an OpenID Connect API
- All Rekor client APIs can be leveraged to interact with the transparency log
- Cryptographic key management

## Installation

Run the following command in your project directory:

```console
cargo add sigstore
```

Or add the following to your Cargo.toml:

`sigstore = "0.10.0"`

## Example

Numerous examples are provided in the [project repository](https://github.com/sigstore/sigstore-rs/tree/main/examples), including a [simple signing example](https://github.com/sigstore/sigstore-rs/tree/main/examples/cosign/sign) and a number of examples interacting with the [Rekor transparency log](https://github.com/sigstore/sigstore-rs/tree/main/examples/rekor).
