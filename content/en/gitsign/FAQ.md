---
title: "Gitsign FAQ"
menuTitle: "FAQ"
category: "Gitsign"
position: 155
---

## Why use Gitsign instead of the usual commit signing workflow?

A typical commit signing workflow requires developers to create special signing keys that must be safely stored in the system that will sign the commits. Additionally, verifying signatures requires access to the signer’s public key. Distributing public keys while also attesting that they truly belong to a certain identity can be very challenging. 
That’s where [keyless signing with Cosign](/cosign/openid_signing) comes in handy, allowing developers to use their OpenID identities to sign commits and improve the overall trust of an open source project.

## Why does the authentication workflow require opening a browser window? 

When Git invokes signing tools, both stdout and stderr are captured, which means Gitsign cannot interactively push back messages to shells. Because of this, device mode does not work with Gitsign and a browser capable session is required to sign commits. 

## I signed my commit with Gitsign, but it shows up as “unverified” in my GitHub repository page. Why?

![Unverified signed commit](https://github.com/sigstore/gitsign/raw/main/images/unverified.png)

At the moment, GitHub doesn’t recognize Gitsign signatures as `verified` for two reasons:

1. The Sigstore CA root is not a part of [GitHub’s trust root](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#smime-commit-signature-verification).
2. Gitsign’s ephemeral keys are only valid for a short time, so using standard x509 verification would consider the certificate invalid after expiration. Verification needs to include validation via [Rekor](/rekor/overview) to verify that the certificate was valid at the time it was used.

We hope to work closely with GitHub to get these types of signatures recognized as verified in the near future.

You can find more information about GitHub’s commit signature verification in their [official docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification).

## What data does Gitsign store?

Gitsign stores data in two places:

### 1. Within the Git commit

The commit itself contains a signed digest of the user commit content (that is, the author, committer, message, etc.) along with the code signing certificate. This data is stored within the commit itself as part of your repository. Review guidance on [inspecting the Git commit signature](#inspecting-the-git-commit-signature) for more details.

### 2. Within the Rekor transparency log

To be able to verify signatures for ephemeral certs past their `Not After` time, Gitsign records commits and the code signing certificates to [Rekor](https://docs.sigstore.dev/rekor/overview/). This data is a [HashedRekord](https://github.com/sigstore/rekor/blob/e375eb461cae524270889b57a249ff086bea6c05/types.md#hashed-rekord) containing a SHA256 hash of the commit SHA, as well as the code signing certificate. Review guidance on [Verifying the Transparency Log](#verifying-the-transparency-log) for more details.

By default, data is written to the [public Rekor instance](https://docs.sigstore.dev/rekor/public-instance). In particular, users and organizations may be sensitive to the data contained within code signing certificates returned by Fulcio, which may include user emails or repository identifiers. Review [OIDC usage in Fulcio](https://github.com/sigstore/fulcio/blob/6ac6b8c94c3ec6106d68c0f92225016a3a6eef79/docs/oidc.md) for more details regarding what data is contained in the code signing certs. Alternately, you can learn how to [Deploy a Rekor Server Manually](https://docs.sigstore.dev/rekor/installation/#deploy-a-rekor-server-manually), which would set up your own Rekor instance.