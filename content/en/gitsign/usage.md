---
title: "Detailed Gitsign Usage"
menuTitle: "Detailed Usage"
category: "Gitsign"
position: 153
---

## Signing a Commit

After installing Gitsign and [configuring Git to use it as a signer application](/gitsign/installation#configuring-git-to-use-gitsign-for-signing) for your project (or globally), you can sign commits as usual with `git commit -s`.

```console
$ git commit -s --allow-empty --message="Signed commit"
[main cb6eee1] Signed commit
```

This will redirect you through the Sigstore keyless flow to authenticate and sign the commit.

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

## Debugging

If there is a problem during signing, you may receive an error similar to the following:

```
error: gpg failed to sign the data
fatal: failed to write commit object
```

Because of limitations with Git signing tools, Gitsign cannot write back to stderr. Instead, you can use the `GITSIGN_LOG` environment variable to tee logs into a readable location for debugging.


