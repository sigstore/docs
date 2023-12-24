---
type: docs
category: System configuration
title: Installation
weight: 950
---

## With Go 1.20+

If you have Go 1.20+, you can directly install Cosign by running:

```bash
go install github.com/sigstore/cosign/v2/cmd/cosign@latest
```

The resulting binary will be placed at `$GOPATH/bin/cosign` (or `$GOBIN/cosign`, if set).

## With the Cosign binary or rpm/dpkg package

Download the binary for your platform from the [Cosign releases page](https://github.com/sigstore/cosign/releases/latest).

```bash
# binary
curl -O -L "https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64"
sudo mv cosign-linux-amd64 /usr/local/bin/cosign
sudo chmod +x /usr/local/bin/cosign

# rpm
LATEST_VERSION=$(curl https://api.github.com/repos/sigstore/cosign/releases/latest | grep tag_name | cut -d : -f2 | tr -d "v\", ")
curl -O -L "https://github.com/sigstore/cosign/releases/latest/download/cosign-${LATEST_VERSION}-1.x86_64.rpm"
sudo rpm -ivh cosign-${LATEST_VERSION}-1.x86_64.rpm

# dkpg
LATEST_VERSION=$(curl https://api.github.com/repos/sigstore/cosign/releases/latest | grep tag_name | cut -d : -f2 | tr -d "v\", ")
curl -O -L "https://github.com/sigstore/cosign/releases/latest/download/cosign_${LATEST_VERSION}_amd64.deb"
sudo dpkg -i cosign_${LATEST_VERSION}_amd64.deb
```

## Homebrew/Linuxbrew

If you are using Homebrew (or Linuxbrew), you can install Cosign by running:

```bash
brew install cosign
```

## Arch Linux

If you are using Arch Linux, you can install Cosign by running:

```bash
pacman -S cosign
```

## Alpine Linux

If you are using Alpine Linux edge, with the [community repository enabled](https://wiki.alpinelinux.org/w/index.php?title=Enable_Community_Repository),
you can install `cosign` by running:

```bash
apk add cosign
```

## Nix

If you are using Nix, you can install Cosign by running:

```bash
nix-env -iA nixpkgs.cosign
```

## NixOS

If you are on NixOS, you can install Cosign by running:

```bash
nix-env -iA nixos.cosign
```

## GitHub Actions

Cosign can be installed in your GitHub Actions using the [Cosign installer](https://github.com/marketplace/actions/cosign-installer) on the GitHub Marketplace.

```yaml
uses: sigstore/cosign-installer@main
```

You can specify a specific release of Cosign:

```yaml
uses: sigstore/cosign-installer@main
with:
  cosign-release: "v2.0.2" # optional
```

## GitLab

Cosign can be installed in your CI/CD pipeline by using a before script in your job:

```yaml
before_script:
  - apk add --update cosign
```

## Container Images

Signed release images are available at [`gcr.io/projectsigstore/cosign`](http://gcr.io/projectsigstore/cosign).
They are tagged with the release name (for example, `gcr.io/projectsigstore/cosign:v2.0.2`).

You can get the latest release with `crane ls gcr.io/projectsigstore/cosign | tail -1`. To list all versions, signatures and SBOMs:

```bash
$ crane ls gcr.io/projectsigstore/cosign
...
sha256-a95d7c4ab27e48aaf89253e0703014709129f010578be809b6c95ccee908fa1b.sbom
sha256-a95d7c4ab27e48aaf89253e0703014709129f010578be809b6c95ccee908fa1b.sig
...
v2.0.2
...
```

CI Built containers are published for every commit at `gcr.io/projectsigstore/cosign/ci/cosign`.
They are tagged with the commit.
They can be found with `crane ls`:

```bash
$ crane ls gcr.io/projectsigstore/cosign/ci/cosign
749f896
749f896bb378aca5cb45c5154fc0cb43f6728d48
```

Further details and installation instructions for `crane` are available via https://github.com/google/go-containerregistry/tree/main/cmd/crane

## Verifying Cosign Releases

Before using a downloaded Cosign binary, it's important to verify its authenticity to ensure that it hasn't been tampered with. The Cosign binary is signed both with keyless signing and an artifact key. You first need to verify Cosign with the artifact key, since you will need Cosign to verify the keyless signature.

### Verifying Cosign with artifact key

#### Downloading The Update Framework (TUF) client

Before using Cosign, you will need to download and also initialize the TUF environment which allows you to ensure that your software artifacts are distributed securely and that any updates to these artifacts are signed and verified.

To do this, install and use [go-tuf](https://github.com/theupdateframework/go-tuf)'s CLI tools:

```bash
go install github.com/theupdateframework/go-tuf/cmd/tuf-client@latest
```

Then, obtain trusted root keys for Sigstore. You will use the 5th iteration of Sigstore's TUF root to start the root of trust, due to a backward incompatible change. The TUF client uses this root to start a chain of roots, and will download the latest, unexpired root as part of [its workflow](https://theupdateframework.github.io/specification/latest/#update-root).

```bash
curl -o sigstore-root.json https://raw.githubusercontent.com/sigstore/root-signing/main/ceremony/2022-10-18/repository/5.root.json
```

Note that you can verify the 5th TUF root against the 1st TUF root, which was signed in a publicly documented signing ceremony. However, due to the backward incompatible change, this requires manual verification steps. See the [Sigstore root repo](https://github.com/sigstore/root-signing) for more information.

#### Initializing TUF Environment

Then initialize the tuf client with the previously obtained root key and the remote repository;

```bash
tuf-client init https://tuf-repo-cdn.sigstore.dev sigstore-root.json
```

#### Verifying with key

You will retrieve the artifact verification key from the trusted TUF repository and use it to verify the Cosign release.

```bash
tuf-client get https://tuf-repo-cdn.sigstore.dev artifact.pub > artifact.pub

curl -o cosign-release.sig -L https://github.com/sigstore/cosign/releases/download/<version>/cosign-<os>.sig
base64 -d cosign-release.sig > cosign-release.sig.decoded

curl -o cosign -L https://github.com/sigstore/cosign/releases/download/<version>/cosign-<os>

openssl dgst -sha256 -verify artifact.pub -signature cosign-release.sig.decoded cosign
```

The `<version>`and `<os>` placeholders in the URLs should be replaced with the specific version and operating system that you want to download.

### Verifying Cosign with identity-based verification

Once you have verified Cosign with an artifact key, you can use Cosign to verify future releases of Cosign using identity-based verification.

#### Verifying Cosign binary

To verify a Cosign binary, you will need to fetch the signature and certificate from GitHub.

```bash
curl -o cosign-release.sig -L https://github.com/sigstore/cosign/releases/download/<version>/cosign-<os>-keyless.sig
base64 -d cosign-release.sig > cosign-release.sig.decoded

curl -o cosign-release.pem -L https://github.com/sigstore/cosign/releases/download/<version>/cosign-<os>-keyless.pem
base64 -d cosign-release.pem > cosign-release.pem.decoded

curl -o new-cosign -L https://github.com/sigstore/cosign/releases/download/<version>/cosign-<os>

cosign verify-blob new-cosign --certificate cosign-release.pem.decoded --signature cosign-release.sig.decoded \
  --certificate-identity keyless@projectsigstore.iam.gserviceaccount.com --certificate-oidc-issuer https://accounts.google.com
```

#### Verify Cosign in container image

You can also verify a container image of Cosign. You can use [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) to get the latest version of Cosign. You can skip the first two steps if you already have the container image.

```bash
COSIGN_VERSION=$(crane ls gcr.io/projectsigstore/cosign | tail -1)
COSIGN_DIGEST=$(crane digest gcr.io/projectsigstore/cosign:$COSIGN_VERSION)

cosign verify gcr.io/projectsigstore/cosign@$COSIGN_DIGEST \
  --certificate-identity keyless@projectsigstore.iam.gserviceaccount.com --certificate-oidc-issuer https://accounts.google.com
```
