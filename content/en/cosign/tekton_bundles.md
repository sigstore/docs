---
title: "Tekton Bundles"
category: "Cosign"
position: 7
---

#### Tekton Bundles

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
