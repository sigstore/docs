---
title: "Installation"
category: "Cosign"
position: 102
---

## With Go 1.17+

If you have Go 1.17+, you can directly install Cosign by running:

```console
go install github.com/sigstore/cosign/cmd/cosign@latest
```

The resulting binary will be placed at `$GOPATH/bin/cosign` (or `$GOBIN/cosign`, if set).

## With the Cosign binary or rpm/dpkg package

Check for the file in https://github.com/sigstore/cosign/releases

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

If you are using Homebrew (or Linuxbrew), you can install Cosign by running:

```console
brew install cosign
```

## Arch Linux

If you are using Arch Linux, you can install Cosign by running:

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

If you are using Nix, you can install Cosign by running:

```console
nix-env -iA nixpkgs.cosign
```

## NixOS

If you are on NixOS, you can install Cosign by running:

```console
nix-env -iA nixos.cosign
```

## GitHub Actions

Cosign can be installed in your GitHub Actions using the [Cosign installer](https://github.com/marketplace/actions/cosign-installer) on the GitHub Marketplace.

```yaml
uses: sigstore/cosign-installer@main
with:
  cosign-release: 'v1.2.1' # optional
```

## Container Images

Signed release images are available at [`gcr.io/projectsigstore/cosign`](http://gcr.io/projectsigstore/cosign).
They are tagged with the release name (for example, `gcr.io/projectsigstore/cosign:v1.0.0`).
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

Further details and installation instructions for `crane` available via https://github.com/google/go-containerregistry/tree/main/cmd/crane

## Releases

Releases are published in the Cosign repository under the [Releases page](https://github.com/sigstore/cosign/releases), and hosted in the GCS bucket `cosign-releases`.

They can be reviewed with `gsutil`:

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
