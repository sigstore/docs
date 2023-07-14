---
title: "Gitsign Overview"
menuTitle: "Overview"
category: "Gitsign"
position: 400
---

![Gitsign Overview](/sigstore_gitsign-horizontal-color.svg)

Gitsign implements keyless Sigstore to sign Git commits with a valid
[OpenID Connect](https://openid.net/connect/) identity. In practice, that means
you won’t need GPG keys and a complicated setup in order to sign your Git
commits. After installing and configuring Gitsign within your project and
signing your commits, you will be redirected to a browser window to authenticate
with a supported OpenID provider, such as GitHub or Google. Signing details will
then be stored in [Rekor](/rekor/overview/) for subsequent verification.

Gitsign is part of the Sigstore project. Join us on our
[Slack channel](https://sigstore.slack.com/) if you want to learn more or get
involved. Join our Slack channel with
[this invite](https://links.sigstore.dev/slack-invite).

## Quick Start

Gitsign can be installed via the Go installer, with Homebrew, or with one of the
package installers available on the project
[releases page](https://github.com/sigstore/gitsign/releases). These include
`.deb` and `.rpm` formats for Debian and Fedora systems, respectively. Check the
[installation](/gitsign/installation/) page for more details on how to get
Gitsign installed on your system.

Once configured, you can sign commits as usual with `git commit -S` (or
`git config --global commit.gpgsign true` to enable signing for all commits).

```sh
$ git commit
Your browser will now be opened to:
https://oauth2.sigstore.dev/auth/auth?access_type=online&client_id=sigstore&...
[main 040b9af] Signed commit
```

This will redirect you through the [Sigstore Keyless](/cosign/openid_signing/)
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
