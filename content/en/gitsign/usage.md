---
title: "Detailed Gitsign Usage"
menuTitle: "Detailed Usage"
category: "Gitsign"
position: 153
---

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

| Environment Variable      | sigstore<br>Prefix | Default                          | Description                                                                                                                                                                                                                                |
| ------------------------- | ------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GITSIGN_CREDENTIAL_CACHE  | ❌                 |                                  | Optional path to [gitsign-credential-cache](https://github.com/sigstore/gitsign/tree/main/cmd/gitsign-credential-cache) socket.                                                                                                            |
| GITSIGN_CONNECTOR_ID      | ✅                 |                                  | Optional Connector ID to auto-select to pre-select auth flow to use. For the public sigstore instance, valid values are:<br>- `https://github.com/login/oauth`<br>- `https://accounts.google.com`<br>- `https://login.microsoftonline.com` |
| GITSIGN_FULCIO_URL        | ✅                 | https://fulcio.sigstore.dev      | Address of Fulcio server                                                                                                                                                                                                                   |
| GITSIGN_LOG               | ❌                 |                                  | Path to log status output. Helpful for debugging when no TTY is available in the environment.                                                                                                                                              |
| GITSIGN_OIDC_CLIENT_ID    | ✅                 | sigstore                         | OIDC client ID for application                                                                                                                                                                                                             |
| GITSIGN_OIDC_ISSUER       | ✅                 | https://oauth2.sigstore.dev/auth | OIDC provider to be used to issue ID token                                                                                                                                                                                                 |
| GITSIGN_OIDC_REDIRECT_URL | ✅                 |                                  | OIDC Redirect URL                                                                                                                                                                                                                          |
| GITSIGN_REKOR_URL         | ✅                 | https://rekor.sigstore.dev       | Address of Rekor server                                                                                                                                                                                                                    |

For environment variables that support `sigstore Prefix`, the values may be
provided with either a `GITSIGN_` or `SIGSTORE_` prefix - e.g.
`GITSIGN_CONNECTOR_ID` or `SIGSTORE_CONNECTOR_ID`. If both environment variables
are set, `GITSIGN_` prefix takes priority.

## Signing a Commit

After installing Gitsign and
[configuring Git to use it as a signer application](/gitsign/installation/#configuring-git-to-use-gitsign)
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

This will redirect you through the sigstore Keyless flow to authenticate and
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
