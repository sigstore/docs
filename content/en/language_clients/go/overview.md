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
Alternatively, you can use `go run cmd/sigstore-go/main.go` to access the CLI, as show in the [example](#cli-example). 

## Example

### CLI example

The following is an example of using the sigstore-go CLI to verify a signature. 

```console
go run cmd/sigstore-go/main.go \
  -artifact-digest 76176ffa33808b54602c7c35de5c6e9a4deb96066dba6533f50ac234f4f1f4c6b3527515dc17c06fbe2860030f410eee69ea20079bd3a2c6f3dcf3b329b10751 \
  -artifact-digest-algorithm sha512 \
  -expectedIssuer https://token.actions.githubusercontent.com \
  -expectedSAN https://github.com/sigstore/sigstore-js/.github/workflows/release.yml@refs/heads/main \
  examples/bundle-provenance.json
Verification successful!
{
   "version": 20230823,
   "statement": {
      "_type": "https://in-toto.io/Statement/v0.1",
      "predicateType": "https://slsa.dev/provenance/v0.2",
      "subject": ...
    },
    ...
}
```
### Additional examples

Additional examples are available in the [project documentation](https://github.com/sigstore/sigstore-go#sigstore-go). 

- [Signing example](https://github.com/sigstore/sigstore-go/blob/main/docs/signing.md#examples)
- [Verifying example](https://github.com/sigstore/sigstore-go/blob/main/docs/verification.md#verification-using-sigstore-go)
- [OCI image verifying example](https://github.com/sigstore/sigstore-go/blob/main/docs/oci-image-verification.md#example-of-oci-image-verification-using-sigstore-go)
