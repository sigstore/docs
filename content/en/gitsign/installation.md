---
title: "Gitsign Installation"
menuTitle: "Installation"
category: "Gitsign"
position: 405
---

## Installing Gitsign

You can install Gitsign on your system with the Go installer, via Homebrew, or
with one of the available downloadable packages. Releases are published in
[the Gitsign repository](https://github.com/sigstore/gitsign) under the
[Releases page](https://github.com/sigstore/gitsign/releases).

### Installing Gitsign with Go 1.17+

If you have Go 1.17+, you can install Gitsign with:

```console
go install github.com/sigstore/gitsign@latest
```

The resulting binary will be placed at `$GOPATH/bin/gitsign`.

### Installing Gitsign with Homebrew

If you are using [Homebrew](https://docs.brew.sh/) as a package manager for
macOS or Linux, you can use it to install Gitsign. Use `brew tap` to add
Sigstore's repository to your system, then run `brew install` to get it
installed:

```console
brew tap sigstore/tap
brew install gitsign
```

### Installing Gitsign with the `.deb` Package (Debian / Ubuntu Linux)

Check the [releases page](https://github.com/sigstore/cosign/releases) for the
latest release, and download the appropriate `.deb` file.

```console
wget https://github.com/sigstore/gitsign/releases/download/v0.7.1/gitsign_0.7.1_linux_amd64.deb
sudo dpkg -i gitsign_0.7.1_linux_amd64.deb
```

### Installing Gitsign with the `.rpm` Package (Fedora Linux)

Check the [releases page](https://github.com/sigstore/cosign/releases) for the
latest release, and download the appropriate `.rpm` file.

```console
wget https://github.com/sigstore/gitsign/releases/download/v0.7.1/gitsign_0.7.1_linux_amd64.rpm
rpm -ivh gitsign_0.7.1_linux_amd64.rpm
```

## Checking your Installation

Once you finish installing Gitsign, you can test that it is functional and
ensure that it can be found on your $PATH by running a `gitsign` command.

```shell
$ gitsign --version
gitsign version v0.7.1
```

### Troubleshooting

If you get an error such as `command not found`, it may be the case that your
`$PATH` does not include the relevant bin directories where Gitsign should be
installed.

If you installed Gitsign with Go, make sure you have your Go bin directory added
to your `$PATH`.

## Configuring Git to use Gitsign

After installing Gitsign on your system and making sure it is functional, you’ll
need to tell Git that you want to use Gitsign to sign your commits from now on,
whether locally on a project-based configuration or globally, which will be
valid for commits made from your current system to any project.

### Single Repository (Local Config):

```sh
cd /path/to/my/repository
git config --local commit.gpgsign true  # Sign all commits
git config --local tag.gpgsign true  # Sign all tags
git config --local gpg.x509.program gitsign  # Use Gitsign for signing
git config --local gpg.format x509  # Gitsign expects x509 args
```

### All Repositories (Global Config):

```sh
git config --global commit.gpgsign true  # Sign all commits
git config --global tag.gpgsign true  # Sign all tags
git config --global gpg.x509.program gitsign  # Use Gitsign for signing
git config --global gpg.format x509  # Gitsign expects x509 args
```
