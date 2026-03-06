---
type: docs
category: Signing
title: Signing Other Types
weight: 140
---

Cosign can sign anything in a registry. Most of our examples show signing a single image, but you could also sign a multi-platform `Index`, or any other type of artifact. This includes Helm Charts, Tekton Pipelines, and anything else currently using OCI registries for distribution. This also means new artifact types can be uploaded to a registry and signed. This section discusses signing the following items:

- SBOMs
- Tekton Bundles
- WASM
- OCI Artifacts
- Tag signing
- Base Image and Layer Signing
- Countersigning

## SBOMs (Software Bill Of Materials)

There's a couple of different approaches SBOMs, depending on if you're working with container images or not.

If your SBOM is stored in a OCI registry, you can sign it and verify it like any other OCI object:

```shell
$ cosign sign --key cosign.key $SBOM_OCI_IMAGE

$ cosign verify --key cosign.pub $SBOM_OCI_IMAGE
```

Another option is to use `cosign attest` when signing your container image to include information about the SBOM:

```shell
$ echo '{"sbom_path": "example.com/...", "sbom_hash": "sha256:0a1b2c..."}' > sbom.predicate.json
$ cosign attest --type custom --predicate sbom.predicate.json $IMAGE
```

These approaches also work with files on disk, except you use `sign-blob` or `attest-blob` instead of the OCI versions `sign` or `attest`.

## Tekton Bundles

[Tekton](https://tekton.dev) Bundles can be uploaded and managed within an OCI registry.
The specification is [here](https://tekton.dev/docs/pipelines/tekton-bundle-contracts/).
This means they can also be signed and verified with `cosign`.

Tekton Bundles can currently be uploaded with the [tkn cli](https://github.com/tektoncd/cli), but we may add this support to
`cosign` in the future.

```shell
$ tkn bundle push us.gcr.io/user-vmtest2/pipeline:latest -f task-output-image.yaml
Creating Tekton Bundle:
        - Added TaskRun:  to image

Pushed Tekton Bundle to us.gcr.io/user-vmtest2/pipeline@sha256:124e1fdee94fe5c5f902bc94da2d6e2fea243934c74e76c2368acdc8d3ac7155
$ cosign sign --key cosign.key us.gcr.io/user-vmtest2/pipeline:latest
```

## OCI artifacts

Push an artifact to a registry using [ORAS](https://oras.land/cli) (in this case, `cosign` itself):

```shell
$ oras push us-central1-docker.pkg.dev/user-vmtest2/test/artifact ./cosign
Uploading f53604826795 cosign
Pushed us-central1-docker.pkg.dev/user-vmtest2/test/artifact
Digest: sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
```

Now sign it using `cosign`:

```shell
$ cosign sign --key cosign.key us-central1-docker.pkg.dev/user-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
Enter password for private key:
Pushing signature to: us-central1-docker.pkg.dev/user-vmtest2/test/artifact:sha256-551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef.sig
```

Finally, verify with `cosign` again:

```shell
$ cosign verify --key cosign.pub  us-central1-docker.pkg.dev/user-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The claims were present in the transparency log
  - The signatures were integrated into the transparency log when the certificate was valid
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.

{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef"},"Type":"cosign container image signature"},"Optional":null}
```

## WASM

Web Assembly Modules can also be stored in an OCI registry, using this [specification](https://github.com/solo-io/wasm/tree/master/spec).

See "OCI artifacts" above on how to upload items to an OCI registry.

```shell
$ cosign sign --key cosign.key us.gcr.io/user-vmtest2/wasm
```
