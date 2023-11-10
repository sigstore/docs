---
type: docs
category: System configuration
description: Integration
title: Integration
weight: 952
---

![Sigstore](sigstore-logo_horizontal-color.svg)

## Integration

Many of the recent high-profile software attacks that have alarmed open-source users globally were consequences of supply chain integrity vulnerabilities: attackers gained control of a build server to use malicious source files, inject malicious artifacts into a compromised build platform, and bypass trusted builders to upload malicious artifacts. Sigstore provides a way to sign, verify, and log artifacts to ensure that they are from who they say they are and to shore up supply chain vulnerabilities.  

Integrating Sigstore with your own applications provides an effective way to enhance security:

- The ability to control how Sigstre is used.
- The creation of your own user interfaces.

You can do this while using the underlying Sigstore software that already exists.

There are several libraries available for developers who want to integrate Sigstore signing and/or verification into their project:

- Cosign, is a legacy system that still should be used for signing, and Sigstore-go, which is recommended for use in verification. Cosign was developed with a focus on container image signing/verification and has a rich CLI and a long legacy of features and development.
- Sigstore-go is a more minimal and friendly API for integrating Go code with Sigstore, with a focus on a unified format for Sigstore verification metadata.
- Sigstore-python is a python language based API.
- Sigstore-JS for code signing  NPM packages
- Sigstore-java for Java based applications (upcoming).
- Sigstore-rs for Rust applications (upcoming).

**NOTE:** Each of the above libraries has their own entry points.  Refer to the specific documentation of each library for details.

In addition to the individual libraries, a work-in-progress client specification describes the expected signer and verifier flows.   You can find it [here](https://docs.google.com/document/d/1kbhK2qyPPk8SLavHzYSDM8-Ueul9_oxIMVFuWMWKz0E/edit#heading=h.xib7qycxsp4i).

### Cosign

[Cosign documentation and examples](https://github.com/sigstore/cosign/blob/main/doc/cosign.md) are available.  A few relevant functions:

- For [verifying containers](https://github.com/sigstore/cosign/blob/main/pkg/cosign/verify.go#L479) [or here](https://github.com/sigstore/cosign/blob/main/pkg/cosign/verify.go#L818).
- For [verifying blobs](https://github.com/sigstore/cosign/blob/main/pkg/cosign/verify.go#L812). Note that it's up to the caller to construct the function input structure.
- For [signing blobs](https://github.com/sigstore/cosign/blob/main/cmd/cosign/cli/sign/sign_blob.go#L40).
- For [signing containers](https://github.com/sigstore/cosign/blob/main/cmd/cosign/cli/sign/sign.go#L133).

These functions were designed to be used within Cosign as a command line utility and not as an API. There are no API stability guarantees for Cosign, and we do not follow semantic versioning (semver).

Also note that Cosign lacks support for the Protobufs-based bundle format.

### Sigstore-Go

The Sigstore-go library represents the future of Sigstore’s support for the Go programming language. It supports the Protobufs-based bundle format, and is a lightweight software package that is much simpler than Cosign.  Cosign is focused on OCI use cases, which makes it difficult for library integrators who want to limit their implementations to core sign/verify flows. It can be used today as a smaller alternative than depending on Cosign’s internal libraries (which can come with lots of potentially unnecessary transitive dependencies), and provides the basis for Sigstore bundle support in the policy controller.  Cosign was designed as a CLI for signing containers, and Sigstore-go is designed as an API.

Sigstore-go can be found [here](https://github.com/sigstore/sigstore-go). [Examples](https://github.com/sigstore/sigstore-go#examples) are also available.

### Sigstore-python

The Sigstore-python library is an interface for the Python programming language. Examine the [repository](https://github.com/sigstore/sigstore-python) for more information.

### Sigstore-JS

The Sigstore-JS library is designed for code signing NPM packages.   See the [repository](https://github.com/sigstore/sigstore-js) for more information.
