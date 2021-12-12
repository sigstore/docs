---
title: "SBOM signing"
category: "Cosign"
position: 108
---

#### SBOM (Software Bill Of Materials)

SBOMs can also be stored in an OCI registry, using this [specification](https://github.com/sigstore/cosign/blob/main/specs/SBOM_SPEC.md).

`Cosign` can attach these using the `cosign attach sbom` command. In the following example, we'll be generating SBOM for our sample container image by using [syft](https://github.com/anchore/syft) tool created by Anchore community, then we'll be storing it in an OCI registry, once we store it, then we'll be signing the image tag that includes the SBOM itself, and verifying it.

```shell
$ crane copy alpine:latest gcr.io/$(gcloud config get-value project)/alpine:latest

$ syft packages gcr.io/$(gcloud config get-value project)/alpine:latest -o spdx > latest.spdx

$ cosign attach sbom --sbom latest.spdx gcr.io/$(gcloud config get-value project)/alpine:latest # get the digest from the output

$ cosign sign --key cosign.key gcr.io/$(gcloud config get-value project)/alpine:sha256-e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a.sbom

$ cosign verify --key cosign.pub gcr.io/$(gcloud config get-value project)/alpine:sha256-e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a.sbom
```