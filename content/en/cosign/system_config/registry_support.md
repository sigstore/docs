---
type: docs
category: System configuration
title: Registry Support
weight: 965
---

Cosign uses [go-containerregistry](https://github.com/google/go-containerregistry) for registry
interactions, which has generally excellent compatibility, but some registries may have quirks.

Today, Cosign has been tested and works against the following registries:

* AWS Elastic Container Registry
* GCP's Artifact Registry and Container Registry
* Docker Hub
* Azure Container Registry
* JFrog Artifactory Container Registry
* The CNCF distribution/distribution Registry
* GitLab Container Registry
* GitHub Container Registry
* The CNCF Harbor Registry
* Digital Ocean Container Registry
* Sonatype Nexus Container Registry
* Alibaba Cloud Container Registry
* Quay.io and Project Quay Container Registry

We aim for wide registry support. Please help test and file bugs if you see issues!
Instructions can be found in the [tracking issue](https://github.com/sigstore/cosign/issues/40).

## Registry details

Cosign signatures are stored using the OCI 1.1 referrer specification.

## Specifying registry

Cosign will default to storing signatures in the same repo as the image it is signing.
To specify a different repo for signatures, you can set the `COSIGN_REPOSITORY` environment variable.

This will replace the repo in the provided image:

```
$ export COSIGN_REPOSITORY=gcr.io/my-new-repo
$ cosign sign gcr.io/user-vmtest2/demo
```

So the signature for `gcr.io/user-vmtest2/demo` will be stored in `gcr.io/my-new-repo/demo`.
