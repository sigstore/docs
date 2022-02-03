---
title: "Installation"
category: "Rekor"
position: 310
---

There are serveral methods to install Rekor which we will cover here for both the `rekor-cli` and `rekor-server`.
<!--more-->

## Using go install

If you have go installed, you can use go to retreive the `rekor-cli` binaries

    $ go install -v github.com/sigstore/rekor/cmd/rekor-cli@latest

You may also do the same for `rekor-server`, but **note** that rekor server also
requires trillian and database. See [database](database.md)

    $ go install -v github.com/sigstore/rekor/cmd/rekor-server@latest

## From the release page

Rekor releases are available on the [Release page](https://github.com/sigstore/rekor/releases).

Releases are available for the server, `rekor-server` and the CLI tool `rekor-cli`.

See [Verify a release](verify-release.md) for details of to verify Rekor release binaries.
