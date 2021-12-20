---
title: "Signing Other Types"
category: "Cosign"
position: 120
---

## SBOMs (Software Bill Of Materials)

SBOMs can also be stored in an OCI registry, using this [specification](https://github.com/sigstore/cosign/blob/main/specs/SBOM_SPEC.md).

`Cosign` can attach these using the `cosign attach sbom` command. In the following example, we'll be generating SBOM for our sample container image by using [syft](https://github.com/anchore/syft) tool created by Anchore community, then we'll be storing it in an OCI registry, once we store it, then we'll be signing the image tag that includes the SBOM itself, and verifying it.

```shell
$ crane copy alpine:latest gcr.io/$(gcloud config get-value project)/alpine:latest

$ syft packages gcr.io/$(gcloud config get-value project)/alpine:latest -o spdx > latest.spdx

$ cosign attach sbom --sbom latest.spdx gcr.io/$(gcloud config get-value project)/alpine:latest # get the digest from the output

$ cosign sign --key cosign.key gcr.io/$(gcloud config get-value project)/alpine:sha256-e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a.sbom

$ cosign verify --key cosign.pub gcr.io/$(gcloud config get-value project)/alpine:sha256-e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a.sbom
```

## Tekton Bundles

[Tekton](https://tekton.dev) bundles can be uploaded and managed within an OCI registry.
The specification is [here](https://tekton.dev/docs/pipelines/tekton-bundle-contracts/).
This means they can also be signed and verified with `cosign`.

Tekton Bundles can currently be uploaded with the [tkn cli](github.com/tekton/cli), but we may add this support to
`cosign` in the future.

```shell
$ tkn bundle push us.gcr.io/dlorenc-vmtest2/pipeline:latest -f task-output-image.yaml
Creating Tekton Bundle:
        - Added TaskRun:  to image

Pushed Tekton Bundle to us.gcr.io/dlorenc-vmtest2/pipeline@sha256:124e1fdee94fe5c5f902bc94da2d6e2fea243934c74e76c2368acdc8d3ac7155
$ cosign sign --key cosign.key us.gcr.io/dlorenc-vmtest2/pipeline:latest
Enter password for private key:
tlog entry created with index: 5086
Pushing signature to: us.gcr.io/dlorenc-vmtest2/demo:sha256-124e1fdee94fe5c5f902bc94da2d6e2fea243934c74e76c2368acdc8d3ac7155.sig
```

## WASM

Web Assembly Modules can also be stored in an OCI registry, using this [specification](https://github.com/solo-io/wasm/tree/master/spec).

Cosign can upload these using the `cosign upload wasm` command:

```shell
$ cosign upload wasm -f hello.wasm us.gcr.io/dlorenc-vmtest2/wasm
$ cosign sign --key cosign.key us.gcr.io/dlorenc-vmtest2/wasm
Enter password for private key:
tlog entry created with index: 5198
Pushing signature to: us.gcr.io/dlorenc-vmtest2/wasm:sha256-9e7a511fb3130ee4641baf1adc0400bed674d4afc3f1b81bb581c3c8f613f812.sig
```

## OCI Artifacts

Push an artifact to a registry using [oras](https://github.com/deislabs/oras) (in this case, `cosign` itself!):

```shell
$ oras push us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact ./cosign
Uploading f53604826795 cosign
Pushed us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact
Digest: sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
```

Now sign it! Using `cosign` of course:

```shell
$ cosign sign --key cosign.key us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
Enter password for private key:
Pushing signature to: us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact:sha256-551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef.sig
```

Finally, verify `cosign` with `cosign` again:

```shell
$ cosign verify --key cosign.pub  us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The claims were present in the transparency log
  - The signatures were integrated into the transparency log when the certificate was valid
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.

{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef"},"Type":"cosign container image signature"},"Optional":null}