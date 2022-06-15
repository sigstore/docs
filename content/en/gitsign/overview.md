---
title: "Gitsign Overview"
menuTitle: "Overview"
category: "Gitsign"
position: 150
---

<img src="/sigstore_overview_v1.jpg" class="light-img" width="1280" height="640" alt=""/>

Gitsign implements keyless Sigstore to sign Git commits with a valid [OpenID](https://openid.net/connect/) identity.
In practice, that means you won’t need GPG keys and a complicated setup in order to sign your Git commits. After installing and configuring Gitsign within your project and signing your commits, you will be redirected to a browser window to authenticate with a supported OpenID provider, such as GitHub or Google. Signing details will then be stored in [Rekor](/rekor/overview) for subsequent consultation.

Gitsign is part of the Sigstore project. Join us on our [Slack channel](https://sigstore.slack.com/) if you want to learn more or get involved. Join our Slack channel with [this invite](https://links.sigstore.dev/slack-invite).

## Quick Start

Gitsign can be installed via the Go installer or with one of the package installers available on the project’s [releases page](https://github.com/sigstore/gitsign/releases). These include  `.deb` and `.rpm` formats for Debian and Fedora systems, respectively. Check the [installation](/gitsign/installation) page for more details on how to get Gitsign installed on your system.

Once configured, you can sign commits as usual with `git commit -s`:

```sh
$ git commit -s --allow-empty --message="Signed commit"
[main cb6eee1] Signed commit
```

This will redirect you through the [Sigstore Keyless flow](/cosign/openid_signing) to authenticate and sign the commit.

Commits can then be verified using `git log`:

```sh
$ git --no-pager log --show-signature -1
```

```console
commit 227e796042fdd170e58b7e3b7627a1badd320224 (HEAD -> main)
searching tlog for commit: 227e796042fdd170e58b7e3b7627a1badd320224
tlog index: 2212633
smimesign: Signature made using certificate ID 0x815ada5516906a862af8f528d69d3c86e4774b4f | CN=sigstore,O=sigstore.dev
smimesign: Good signature from "" ([billy@chainguard.dev])
Author: Billy Lynch <billy@chainguard.dev>
Date:   Mon May 2 16:51:44 2022 -0400

    Signed commit
```

## Environment Variables

| Environment Variable      | Default                          | Description                                                                                                   |
| ------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| GITSIGN_FULCIO_URL        | https://fulcio.sigstore.dev      | Address of Fulcio server                                                                                      |
| GITSIGN_LOG               |                                  | Path to log status output. Helpful for debugging, since Git will not forward stderr output to user terminals. |
| GITSIGN_OIDC_CLIENT_ID    | sigstore                         | OIDC client ID for application                                                                                |
| GITSIGN_OIDC_ISSUER       | https://oauth2.sigstore.dev/auth | OIDC provider to be used to issue ID token                                                                    |
| GITSIGN_OIDC_REDIRECT_URL |                                  | OIDC Redirect URL                                                                                             |
| GITSIGN_REKOR_URL         | https://rekor.sigstore.dev       | Address of Rekor server                                                                                       |
