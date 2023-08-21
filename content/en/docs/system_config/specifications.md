---
category: System configuration
title: Specifications
weight: 970
---

`cosign` is inspired by tools like [minisign](https://jedisct1.github.io/minisign/) and
[signify](https://www.openbsd.org/papers/bsdcan-signify.html).

## Signature Specifications

Specifications are maintained within the `cosign` repo and available in [SIGNATURE_SPEC.md](https://github.com/sigstore/cosign/blob/main/specs/SIGNATURE_SPEC.md).

## SBOM in OCI Specification

`Cosign` supports working with SBOMs (Software Bill Of Materials). Both formats such as [SPDX](https://spdx.org), [CycloneDX](https://cyclonedx.org) are supported.

The format for this is maintained within the `cosign` repo and available [SBOM_SPEC.md](https://github.com/sigstore/cosign/blob/main/specs/SBOM_SPEC.md).

## In-Toto Attestation Predicate

`Cosign` supports working with [In-Toto Attestations](https://github.com/in-toto/attestation) using the predicate model.
Several well-known predicates are supported natively, but `cosign` also supports a simple, generic, format for data that
doesn't fit well into other types.

The format for this is maintained within the `cosign` repo and available [COSIGN_PREDICATE_SPEC.md](https://github.com/sigstore/cosign/blob/main/specs/COSIGN_PREDICATE_SPEC.md).

## Signature Payload Format

`cosign` only supports Red Hat's [simple signing](https://www.redhat.com/en/blog/container-image-signing)
format for payloads.

That looks like:

```json
{
    "critical": {
           "identity": {
               "docker-reference": "testing/manifest"
           },
           "image": {
               "Docker-manifest-digest": "sha256:20be...fe55"
           },
           "type": "cosign container image signature"
    },
    "optional": {
           "creator": "Bob the Builder",
           "timestamp": 1458239713
    }
}
```
**Note:** This can be generated for an image reference using `cosign generate <image>`.