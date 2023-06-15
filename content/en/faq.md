---
title: "Frequently asked questions"
category: "Help"
menuTitle: "FAQs"
position: 900
---

This FAQ is intended to go as in depth as possible for anyone using sigstore. 

## General

### What security checks do you use internally?
 
We’ve adopted a security disclosures and response policy to make sure we can responsibly handle critical issues. We have an initial Security Response Committee, who for each vulnerability reported will coordinate to create the fix and release, and communicate the process. You can read the [full policy on GitHub](https://github.com/sigstore/.github/blob/main/SECURITY.md).

### How does Sigstore integrate in-toto?

Sigstore is co-led by Santiago Torres-Arias, the lead of the in-toto project, and the two efforts are complementary. Sigstore supports and uses in-toto in a number of ways. Cosign can be used to generate and verify in-toto attestations and Rekor can store those attestations. in-toto also supports the use of PKI semantics for signing metadata which will be used in future to support Fulcio for developer key management.

### What is the relationship between Sigstore and TUF?

Sigstore's root of trust for Fulcio and Rekor are distributed using The Update Framework [TUF](https://theupdateframework.io).  The releases for Cosign, Rekor, and Fulcio are also signed by a key distributed with TUF.  The projects solve a similar problem of signing and verifying software that will be distributed via a repository. Sigstore provides key signing using multiple techniques, including without requiring developers to manage keys by using OIDC.  In contrast, TUF typically requires keys to be managed by developers, but addresses a threat model where all online servers and keys could be compromised.  The projects are collaborating and can be used cooperatively.  More guidance on this will be forthcoming as the communities collaborate on their first large co-deployments.

## Cosign

### Why not use Notary v2?

The differences right now between Notary V2 and Cosign are in three main parts — Signature Formats, Signature Discovery, and Key Management. For a complete discussion, review [Notary V2 and Cosign](https://medium.com/@dlorenc/notary-v2-and-cosign-b816658f044d).

### Why not use containers/image signing?

`containers/image` signing is close to `cosign`, and we reuse payload formats.
`cosign` differs in that it signs with ECDSA-P256 keys instead of PGP, and stores
signatures in the registry.

### Why not use $FOO?

We designed `cosign` to meet a few specific requirements.  The design requirements are:

* No external services for signature storage, querying, or retrieval
* We aim for as much registry support as possible
* Everything should work over the registry API
* PGP should not be required at all.
* Users must be able to find all signatures for an image
* Signers can sign an image after push
* Multiple entities can sign an image
* Signing an image does not mutate the image
* Pure-go implementation

## Gitsign

### Why use Gitsign instead of the usual commit signing workflow?

A typical commit signing workflow requires developers to create special signing
keys that must be safely stored in the system that will sign the commits.
Additionally, verifying signatures requires access to the signer’s public key.
Distributing public keys while also attesting that they truly belong to a
certain identity can be very challenging. That’s where keyless signing comes in handy, allowing developers to
use their OpenID identities to sign commits and improve the overall trust of an
open source project.

### I signed my commit with Gitsign, but it shows up as “unverified” in my GitHub repository page. Why?

![Unverified signed commit](https://github.com/sigstore/gitsign/raw/main/images/unverified.png)

At the moment, GitHub doesn’t recognize Gitsign signatures as `verified` for two
reasons:

1. The Sigstore CA root is not a part of
   [GitHub’s trust root](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#smime-commit-signature-verification).
2. Gitsign’s ephemeral keys are only valid for a short time, so using standard
   x509 verification would consider the certificate invalid after expiration.
   Verification needs to include validation via [Rekor](/rekor/overview/) to
   verify that the certificate was valid at the time it was used.

We hope to work closely with GitHub to get these types of signatures recognized
as verified in the near future.

You can find more information about GitHub’s commit signature verification in
their
[official docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification).

### What data does Gitsign store?

Gitsign stores data in two places:

#### 1. Within the Git commit

The commit itself contains a signed digest of the user commit content (that is,
the author, committer, message, etc.) along with the code signing certificate.
This data is stored within the commit itself as part of your repository. Review
guidance on
[inspecting the Git commit signature](/gitsign/inspecting/) for
more details.

#### 2. Within the Rekor transparency log

To be able to verify signatures for ephemeral certs past their `Not After` time,
Gitsign records commits and the code signing certificates to
[Rekor](/rekor/overview/). This data is a
[HashedRekord](https://github.com/sigstore/rekor/blob/e375eb461cae524270889b57a249ff086bea6c05/types.md#hashed-rekord)
containing a SHA256 hash of the commit SHA, as well as the code signing
certificate. Review guidance on
[Verifying the Transparency Log](/rekor/public-instance/#auditing-the-public-instance) for more
details.

By default, data is written to the
[public Rekor instance](/rekor/public-instance/). In
particular, users and organizations may be sensitive to the data contained
within code signing certificates returned by Fulcio, which may include user
emails or repository identifiers. Review
[OIDC Usage in Fulcio](/fulcio/oidc-in-fulcio/) for more details regarding what
data is contained in the code signing certs. Alternately, you can learn how to
[Deploy a Rekor Server Manually](/rekor/installation/#deploy-a-rekor-server-manually),
which would set up your own Rekor instance.

### Why does a browser window open for each commit in a rebase?

For Git, each commit in a rebase is considered a distinct signing operation so
by default an ephemeral key is generated for each commit. There are a
few options to help automating the authentication process:

- Setting the [`connectorID`](/gitsign/usage/#configuration) value can be set to
  automatically select the desired provider for Dex backed OIDC providers
  (including the public Sigstore instance at `oauth.sigstore.dev`). While this
  still requires a browser window to open, this does not require an extra click
  to select the provider.
- Starting in v0.2.0, Gitsign has experimental support for key caching to allow
  users to reuse ephemeral keys for the lifetime of the Fulcio certificate. If
  you are interested, check out the
  [`gitsign-credential-cache` README](https://github.com/sigstore/gitsign/tree/main/cmd/gitsign-credential-cache).


## Rekor

### Is the transparency log monitored?

Purdue University operates a log monitor, checking that the log remains append-only. Sigstore provides an easy-to-use GitHub Actions-based monitor for consistency and identity at https://github.com/sigstore/rekor-monitor.

### Can I run my own transparency log monitor?

We would love that. The more people monitoring the logs and providing useful services to users, the better. Check out https://github.com/sigstore/rekor-monitor for a GitHub Actions based monitor.
  
### Why is Rekor centralized?

There's no need for a distributed source of transparency as there can be multiple points of transparency which only adds more sources of security guarantee, not less. An entity can post to as many Rekors as they want and inform users of where they post. We do encourage folks to use common public instances, but we don't seek to enforce this. We do plan to look to produce a gossip protocol, for those that desire a more decentralised model (if there's demand).

### How do I verify downloaded code?

Public blockchains often end up using a centralized entry point for canonicalization and authentication. Consensus algorithms can be susceptible to majority attacks, and transparency logs are more mature and capable for what we aim to build with sigstore.

### Why use a Merkle Tree/Transparency log?

- Rekor's back end is [Trillian](https://github.com/google/trillian)
- Trillian is an open source community under active development
- Trilian is deployed by Google, CloudFlare (nimbus), Let's Encrypt for certificate transparency, so it already is considered production grade

### Can I get Rekor to work with my X format, framework standard?

- Yes. Using pluggable types you can create your own manifest layout and send it to Rekor. Head over to [pluggable types](/rekor/pluggable-types/)
