---
title: "Detailed Gitsign Usage"
menuTitle: "Detailed Usage"
category: "Gitsign"
position: 153
---

## Signing a Commit

After installing Gitsign and
[configuring Git to use it as a signer application](/gitsign/installation#configuring-git-to-use-gitsign-for-signing)
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
