---
type: docs
category: Signing
menuTitle: Signing Git Commits
title: Gitsign
weight: 134
---

![Gitsign Overview](/sigstore_gitsign-horizontal-color.svg)

Gitsign implements keyless Sigstore to sign Git commits with a valid
[OpenID Connect](https://openid.net/connect/) identity. In practice, that means
you won’t need GPG keys and a complicated setup in order to sign your Git
commits. After installing and configuring Gitsign within your project and
signing your commits, you will be redirected to a browser window to authenticate
with a supported OpenID provider, such as GitHub or Google. Signing details will
then be stored in the transparency log [Rekor](/logging/overview/) for subsequent verification.

Gitsign is part of the Sigstore project. Join us on our
[Slack channel](https://sigstore.slack.com/) if you want to learn more or get
involved. Join our Slack channel with
[this invite](https://links.sigstore.dev/slack-invite).

## Quick Start

Gitsign can be installed via the Go installer, with Homebrew, or with one of the
package installers available on the project
[releases page](https://github.com/sigstore/gitsign/releases). These include
`.deb` and `.rpm` formats for Debian and Fedora systems, respectively. Check the
installing Gitsign section below for more details on how to get
Gitsign installed on your system.

Once configured, you can sign commits as usual with `git commit -S` (or
`git config --global commit.gpgsign true` to enable signing for all commits).

```sh
$ git commit
Your browser will now be opened to:
https://oauth2.sigstore.dev/auth/auth?access_type=online&client_id=sigstore&...
[main 040b9af] Signed commit
```

This will redirect you through the [Sigstore Keyless](/signing/overview/)
flow to authenticate and sign the commit.

Commits can then be verified using `git verify-commit`:

```sh
$ git verify-commit HEAD
tlog index: 2801760
gitsign: Signature made using certificate ID 0xf805288664f2e851dcb34e6a03b1a5232eb574ae | CN=sigstore-intermediate,O=sigstore.dev
gitsign: Good signature from [billy@chainguard.dev]
Validated Git signature: true
Validated Rekor entry: true
```
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
## Configuration

### File config

Gitsign can be configured with a standard
[git-config](https://git-scm.com/docs/git-config) file. For example, to set the
Fulcio option for a single repo:

```sh
$ git config --local gitsign.connectorID https://accounts.google.com
$ cat .git/config
[gitsign]
        connectorID = https://accounts.google.com
```

The following config options are supported:

| Option      | Default                          | Description                                                                                                                                                                                                                                |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| fulcio      | https://fulcio.sigstore.dev      | Address of Fulcio server                                                                                                                                                                                                                   |
| logPath     |                                  | Path to log status output. Helpful for debugging when no TTY is available in the environment.                                                                                                                                              |
| clientID    | sigstore                         | OIDC client ID for application                                                                                                                                                                                                             |
| issuer      | https://oauth2.sigstore.dev/auth | OIDC provider to be used to issue ID token                                                                                                                                                                                                 |
| redirectURL |                                  | OIDC Redirect URL                                                                                                                                                                                                                          |
| rekor       | https://rekor.sigstore.dev       | Address of Rekor server                                                                                                                                                                                                                    |
| connectorID |                                  | Optional Connector ID to auto-select to pre-select auth flow to use. For the public sigstore instance, valid values are:<br>- `https://github.com/login/oauth`<br>- `https://accounts.google.com`<br>- `https://login.microsoftonline.com` |

### Environment Variables

| Environment Variable      | Sigstore<br>Prefix | Default                          | Description                                                                                                                                                                                                                                |
| ------------------------- | ------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GITSIGN_CREDENTIAL_CACHE  | ❌                 |                                  | Optional path to [gitsign-credential-cache](https://github.com/sigstore/gitsign/tree/main/cmd/gitsign-credential-cache) socket.                                                                                                            |
| GITSIGN_CONNECTOR_ID      | ✅                 |                                  | Optional Connector ID to auto-select to pre-select auth flow to use. For the public sigstore instance, valid values are:<br>- `https://github.com/login/oauth`<br>- `https://accounts.google.com`<br>- `https://login.microsoftonline.com` |
| GITSIGN_FULCIO_URL        | ✅                 | https://fulcio.sigstore.dev      | Address of Fulcio server                                                                                                                                                                                                                   |
| GITSIGN_LOG               | ❌                 |                                  | Path to log status output. Helpful for debugging when no TTY is available in the environment.                                                                                                                                              |
| GITSIGN_OIDC_CLIENT_ID    | ✅                 | sigstore                         | OIDC client ID for application                                                                                                                                                                                                             |
| GITSIGN_OIDC_ISSUER       | ✅                 | https://oauth2.sigstore.dev/auth | OIDC provider to be used to issue ID token                                                                                                                                                                                                 |
| GITSIGN_OIDC_REDIRECT_URL | ✅                 |                                  | OIDC Redirect URL                                                                                                                                                                                                                          |
| GITSIGN_REKOR_URL         | ✅                 | https://rekor.sigstore.dev       | Address of Rekor server                                                                                                                                                                                                                    |

For environment variables that support `Sigstore Prefix`, the values may be
provided with either a `GITSIGN_` or `SIGSTORE_` prefix - e.g.
`GITSIGN_CONNECTOR_ID` or `SIGSTORE_CONNECTOR_ID`. If both environment variables
are set, `GITSIGN_` prefix takes priority.

## Signing a Commit

After installing Gitsign and configuring Git to use it as a signer application 
for your project (or globally), you can sign commits as usual with
`git commit -S` (or `git config --global commit.gpgsign true` to enable signing
for all commits).

```sh
$ git commit --message="Signed commit"
Your browser will now be opened to:
https://oauth2.sigstore.dev/auth/auth?access_type=online&client_id=sigstore&...
[main 040b9af] Signed commit
```

Commits can then be verified using `git verify-commit`:

```sh
$ git verify-commit HEAD
tlog index: 2801760
gitsign: Signature made using certificate ID 0xf805288664f2e851dcb34e6a03b1a5232eb574ae | CN=sigstore-intermediate,O=sigstore.dev
gitsign: Good signature from [billy@chainguard.dev]
Validated Git signature: true
Validated Rekor entry: true
```

## Signing Tags

You can sign tags with `git tag -s` (or `git config --global tag.gpgsign true`
to enable signing for all tags).

```sh
$ git tag v0.0.1
Your browser will now be opened to:
https://oauth2.sigstore.dev/auth/auth?access_type=online&client_id=sigstore&...
```

This will redirect you through the Sigstore Keyless flow to authenticate and
sign the tag.

Tags can then be verified using `git verify-tag`:

```sh
$ git verify-tag v0.0.1
tlog index: 2802961
gitsign: Signature made using certificate ID 0xe56a5a962ed59f9e3730d6696137eceb8b4ee8ea | CN=sigstore-intermediate,O=sigstore.dev
gitsign: Good signature from [billy@chainguard.dev]
Validated Git signature: true
Validated Rekor entry: true
```

## Debugging

If there is a problem during signing, you may receive an error similar to the
following:

```
error: gpg failed to sign the data
fatal: failed to write commit object
```

By default, gitsign will try and write to your terminal if there is a TTY
available. If you are running in an environment where there is not a TTY, you
can use the `GITSIGN_LOG` environment variable to tee logs into a readable
location for debugging.
