---
title: "Installation"
category: "Cosign"
position: 102
---

## With Go 1.16+

If you have Go 1.16+, you can directly install by running:

```console
go install github.com/sigstore/cosign/cmd/cosign@latest
```

and the resulting binary will be placed at `$GOPATH/bin/cosign` (or `$GOBIN/cosign`, if set).


## With the cosign binary or rpm/dpkg package

check for the file in https://github.com/sigstore/cosign/releases

```console
# binary
wget "https://github.com/sigstore/cosign/releases/download/v1.6.0/cosign-linux-amd64"
mv cosign-linux-amd64 /usr/local/bin/cosign
chmod +x /usr/local/bin/cosign

# rpm
wget "https://github.com/sigstore/cosign/releases/download/v1.6.0/cosign-1.6.0.x86_64.rpm"
rpm -ivh cosign-1.6.0.x86_64.rpm

# dkpg
wget "https://github.com/sigstore/cosign/releases/download/v1.6.0/cosign_1.6.0_amd64.deb"
dpkg -i "cosign_1.6.0_amd64.deb
```

## Homebrew/Linuxbrew

If you are using Homebrew (or Linuxbrew), you can install `cosign` by running:

```console
brew install cosign
```

## Arch Linux

If you are using Arch Linux, you can install `cosign` by running:

```console
pacman -S cosign
```

## Alpine Linux

If you are using Alpine Linux edge, with the community repository enabled,
you can install `cosign` by running:

```console
apk add cosign
```

The `sget` tool is also available:

```console
apk add sget
```

## Nix

If you are using Nix, you can install `cosign` by running:

```console
nix-env -iA nixpkgs.cosign
```

## NixOS

If you are on NixOS, you can install `cosign` by running:

```console
nix-env -iA nixos.cosign
```

## GitHub Action

`cosign` can easily be installed in your GitHub actions using [`sigstore/cosign-installer`](https://github.com/marketplace/actions/cosign-installer):

```yaml
uses: sigstore/cosign-installer@main
with:
  cosign-release: 'v1.2.1' # optional
```

## Cosigned

The `cosign` project contains an admission controller known as `cosigned`, which can be installed on your Kubernetes cluster in a form of a [`helm chart`](https://github.com/sigstore/helm-charts/tree/main/charts/cosigned).

The webhook can be used to automatically validate that all the container images have been signed.
The webhook also resolves the image tags to ensure the image being ran is not different from when it was admitted.

The `cosigned` admission controller will only validate resources in namespaces
that have chosen to opt-in. See the [Enable Cosigned Admission Controller for Namespaces](kubernetes#enable-cosigned-admission-controller-for-namespaces) instructions for more details.


See the [Configuring Cosigned ClusterImagePolicy](kubernetes#configuring-cosigned-clusterimagepolicy) instructions for more details on configuration.

## Container Images

Signed release images are available at `gcr.io/projectsigstore/cosign`.
They are tagged with the release name (e.g. `gcr.io/projectsigstore/cosign:v1.0.0`).
They can be found with `crane ls`:

```console
$ crane ls gcr.io/projectsigstore/cosign
sha256-7e9a6ca62c3b502a125754fbeb4cde2d37d4261a9c905359585bfc0a63ff17f4.sig
v0.4.0
...
```

CI Built containers are published for every commit at `gcr.io/projectsigstore/cosign/ci/cosign`.
They are tagged with the commit.
They can be found with `crane ls`:

```console
$ crane ls gcr.io/projectsigstore/cosign/ci/cosign
749f896
749f896bb378aca5cb45c5154fc0cb43f6728d48
```

Further details and installation instructions for `crane` available here: https://github.com/google/go-containerregistry/tree/main/cmd/crane

## Releases

Releases are published in this repository under the [Releases page](https://github.com/sigstore/cosign/releases), and hosted in the GCS bucket `cosign-releases`.

They can be viewed with `gsutil`:

```console
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
