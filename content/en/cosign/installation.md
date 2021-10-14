---
title: "Installation"
category: "Cosign"
position: 2
---

## Installation

If you have Go 1.16+, you can directly install by running:

    $ go install github.com/sigstore/cosign/cmd/cosign@latest

and the resulting binary will be placed at `$GOPATH/bin/cosign` (or `$GOBIN/cosign`, if set).

### GitHub Action

`cosign` can easily be installed in your GitHub actions using [`sigstore/cosign-installer`](https://github.com/marketplace/actions/install-cosign):

```yaml
uses: sigstore/cosign-installer@main
with:
  cosign-release: 'v1.2.1' # optional
```

### Kubernetes webhook

`cosign` can be installed on your Kubernetes cluster in a form of a [`cosigned webhook`](https://github.com/sigstore/helm-charts/tree/main/charts/cosigned).
By installing a webhook, you can automatically validate that all the container
images have been signed. The webhook also resolves the image tags to ensure the
image being ran is not different from when it was admitted.

### Container Images

Signed release images are available at `gcr.io/projectsigstore/cosign`.
They are tagged with the release name (e.g. `gcr.io/projectsigstore/cosign:v1.0.0`).
They can be found with `crane ls`:

```shell
$ crane ls gcr.io/projectsigstore/cosign
sha256-7e9a6ca62c3b502a125754fbeb4cde2d37d4261a9c905359585bfc0a63ff17f4.sig
v0.4.0
...
```

CI Built containers are published for every commit at `gcr.io/projectsigstore/cosign/ci/cosign`.
They are tagged with the commit.
They can be found with `crane ls`:

```shell
$ crane ls gcr.io/projectsigstore/cosign/ci/cosign
749f896
749f896bb378aca5cb45c5154fc0cb43f6728d48
```

Further details and installation instructions for `crane` available here: https://github.com/google/go-containerregistry/tree/main/cmd/crane

### Releases

Releases are published in this repository under the [Releases page](https://github.com/sigstore/cosign/releases), and hosted in the GCS bucket `cosign-releases`.

They can be viewed with `gsutil`:

```shell
$ gsutil ls gs://cosign-releases/v1.0.0
gs://cosign-releases/v1.0.0/cosign-darwin-amd64
gs://cosign-releases/v1.0.0/cosign-darwin-amd64.sig
gs://cosign-releases/v1.0.0/cosign-darwin-arm64
gs://cosign-releases/v1.0.0/cosign-darwin-arm64.sig
gs://cosign-releases/v1.0.0/cosign-linux-amd64
gs://cosign-releases/v1.0.0/cosign-linux-amd64.sig
gs://cosign-releases/v1.0.0/cosign-windows-amd64.exe
gs://cosign-releases/v1.0.0/cosign-windows-amd64.exe.sig
gs://cosign-releases/v1.0.0/cosign_checksums.txt
gs://cosign-releases/v1.0.0/release-cosign.pub
```
