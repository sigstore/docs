---
type: docs
category: Go
title: Go Client Overview
weight: 5
---

[`sigstore-go`](https://pkg.go.dev/github.com/sigstore/sigstore-go) is the Go language client for Sigstore.

[Cosign](../../cosign/signing/overview.md) is a command line utility that is used to sign software artifacts and verify signatures using Sigstore and is also written in Go. `sigstore-go` is a lighter weight tool and boasts the following benefits:

- Friendly API for integrating Go code with Sigstore
- Smaller dependency tree
- Focuses on newly specified data structures in [sigstore/protobuf-specs](https://github.com/sigstore/protobuf-specs)
- Perfect for simple signing and verififcation tasks

`sigstore-go` is currently in beta. 

## Features

- Signing and verification of [Sigstore bundles](https://github.com/sigstore/protobuf-specs/blob/main/protos/sigstore_bundle.proto)
- Verification of raw Sigstore signatures
- Signing and verifying with a Timestamp Authority (TSA)
- Online and offline signing and verifying with Rekor (Artifact Transparency Log)
- Structured verification results including certificate metadata
- TUF support
- Verification support for custom [trusted root](https://github.com/sigstore/protobuf-specs/blob/main/protos/sigstore_trustroot.proto)
- Basic CLI

## Installation

### Main CLI installation

`sigstore-go` requires Go 1.21 or greater. The package is tested with Go 1.23. 

To compile/install the CLI, clone [`sigstore-go`](https://github.com/sigstore/sigstore-go) and run.   

```console
make install
```
Alternatively, you can use `go run cmd/sigstore-go/main.go` to access the CLI. 

### 

## Example

### Signing example

### Verifying example
