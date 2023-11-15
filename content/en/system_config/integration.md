---
type: docs
category: System configuration
title: Integration
weight: 952
---

![Sigstore](sigstore-logo_horizontal-color.svg)

## Integration

One of the key tenets of the Sigstore community’s strategy has been to focus on open source package managers as our primary stakeholders. OSS package managers serve as a critical link in the overall software supply chain, both in the distribution of artifacts and metadata, but also often as an implicitly trusted actor that is expected to curate content based on static and transient information. Package managers also typically create command line tools used to download, install and manage packages on systems in a variety of environments.

A package manager looking to adopt Sigstore as part of its artifact signing and verification workflows will generally follow these steps, adjusted appropriately to the nuances of the specific programming language and/or ecosystem:

1. Develop language-specific implementation of Sigstore’s signing and verification workflows (if one does not already exist)
2. Integrate language-specific Sigstore signing and verification functionality into package management tooling
3. Add support for storing Sigstore signatures and attestations in the package registry for consumers to access
4. Publish community RFC proposal describing end-to-end workflows, ecosystem-specific threat model, and roadmap for adoption
5. Once RFC proposal is approved per community norms, drive implementation plan
6. Work to drive initial package adoption strategy; this often involves highly visible or valuable packages that can serve as references for other package maintainers within the ecosystem
7. Work with popular build and packaging extensions (like GoReleaser, JReleaser) and builder templates (Jenkins plugins, GitHub Actions)
8. Release all code and service extensions required for Sigstore support in a fully-supported mode
9. Presuming success to this point, set date for mandating Sigstore signing and verification for all packages in ecosystem   

Integrating Sigstore with your own applications provides an effective way to enhance security:

- The ability to control how Sigstore is used.
- The creation of your own user interfaces.
- Package integrity.
- Key management unecessary.
- Transparency.

You can do this while using the underlying Sigstore software that already exists.

There are several libraries available for developers who want to integrate Sigstore signing and/or verification into their project:

- Cosign, is a legacy system that still should be used for signing, and Sigstore-go, which is recommended for use in verification. Cosign was developed with a focus on container image signing/verification and has a rich CLI and a long legacy of features and development.
- Sigstore-go is a more minimal and friendly API for integrating Go code with Sigstore, with a focus on a unified format for Sigstore verification metadata.
- Sigstore-python is a python language based API.
- Sigstore-JS for code signing  NPM packages
- Sigstore-java for Java based applications (pre-release).
- Sigstore-rs for Rust applications (pre-release).

**NOTE:** Each of the above libraries has their own entry points.  Refer to the specific documentation of each library for details. You can also get support on Slack at the "#clients" channel.

In addition to the individual libraries, a work-in-progress client specification describes the expected signer and verifier flows.   You can find it [here](https://docs.google.com/document/d/1kbhK2qyPPk8SLavHzYSDM8-Ueul9_oxIMVFuWMWKz0E/edit#heading=h.xib7qycxsp4i). Join https://groups.google.com/g/sigstore-dev to get access.

### Cosign

[Cosign documentation and examples](https://github.com/sigstore/cosign/blob/main/doc/cosign.md) are available.  A few relevant functions:

- For [verifying containers](https://github.com/sigstore/cosign/blob/b309a0f048462b3fcecb1ac721db537a9cc90372/pkg/cosign/verify.go#L479) [or here](https://github.com/sigstore/cosign/blob/b309a0f048462b3fcecb1ac721db537a9cc90372/pkg/cosign/verify.go#L818).
- For [verifying blobs](https://github.com/sigstore/cosign/blob/b309a0f048462b3fcecb1ac721db537a9cc90372/pkg/cosign/verify.go#L812). Note that it's up to the caller to construct the function input structure.
- For [signing blobs](https://github.com/sigstore/cosign/blob/b309a0f048462b3fcecb1ac721db537a9cc90372/cmd/cosign/cli/sign/sign_blob.go#L40).
- For [signing containers](https://github.com/sigstore/cosign/blob/b309a0f048462b3fcecb1ac721db537a9cc90372/cmd/cosign/cli/sign/sign.go#L133).

These functions were designed to be used within Cosign as a command line utility and not as an API. There are no API stability guarantees for Cosign, and we do not follow semantic versioning (semver). Note that we do not recommend Cosign for integration, as it will pull in a lot of dependencies that will cause your application to increase in size.

Also note that Cosign lacks support for the Protobufs-based bundle format.

### Sigstore-Go

The Sigstore-go library represents the future of Sigstore’s support for the Go programming language. It supports the Protobufs-based bundle format, and is a lightweight software package that is much simpler than Cosign.  Cosign is focused on OCI use cases, which makes it difficult for library integrators who want to limit their implementations to core sign/verify flows. It can be used today as a smaller alternative than depending on Cosign’s internal libraries (which can come with lots of potentially unnecessary transitive dependencies), and provides the basis for Sigstore bundle support in the policy controller.  Cosign was designed as a CLI for signing containers, and Sigstore-go is designed as an API.

Sigstore-go can be found [here](https://github.com/sigstore/sigstore-go). [Examples](https://github.com/sigstore/sigstore-go#examples) are also available.

### Sigstore-python

The Sigstore-python library is an interface for the Python programming language. Examine the [repository](https://github.com/sigstore/sigstore-python) for more information.

### Sigstore-JS

The Sigstore-JS library is designed for code signing NPM packages.   See the [repository](https://github.com/sigstore/sigstore-js) for more information.
