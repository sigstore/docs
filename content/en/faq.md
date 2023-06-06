---
title: "Frequently asked questions"
category: "Help"
menuTitle: "FAQs"
position: 900
---

This FAQ is intended to go as in depth as possible for anyone using sigstore. 

## General

### "What security checks do you use internally?
 
We’ve adopted a security disclosures and response policy to make sure we can responsibly handle critical issues. We have an initial Security Response Committee, who for each vulnerability reported will coordinate to create the fix and release, and keep the committee looped in. The policy in full is here: <https://github.com/sigstore/.github/blob/main/SECURITY.md>.

### How does Sigstore integrate in-toto?

Sigstore is co-led by Santiago Torres-Arias, the lead of the in-toto project, and the two efforts are complementary. Sigstore supports and uses in-toto in a number of ways. Cosign can be used to generate and verify in-toto attestations and Rekor can store those attestations. in-toto also supports the use of PKI semantics for signing metadata which will be used in future to support Fulcio for developer key management.

### What is the relationship between Sigstore and TUF?

Sigstore's root of trust for Fulcio and Rekor are distributed using TUF.  The releases for Cosign, Rekor, and Fulcio are also signed by a key distributed with TUF.  The projects solve a similar problem of signing and verifying software that will be distributed via a repository. Sigstore provides key signing using multiple techniques, including without requiring developers to manage keys by using OIDC.  In contrast, TUF typically requires keys to be managed by developers, but addresses a threat model where all online servers and keys could be compromised.  The projects are collaborating and can be used cooperatively.  More guidance on this will be forthcoming as the communities collaborate on their first large co-deployments.

## Cosign

### Can I use Cosign to sign things *besides* OCI container images?

Yes! See [Signing with Blobs.](../signing_with_blobs) But Cosign *does* have great support for OCI registries.

### Why not use Notary v2

It's hard to answer this briefly. This post contains some comparisons:

[Notary V2 and Cosign](https://medium.com/@dlorenc/notary-v2-and-cosign-b816658f044d)

If you find other comparison posts, please send a PR here and we'll link them all.


### Why not use containers/image signing

`containers/image` signing is close to `cosign`, and we reuse payload formats.
`cosign` differs in that it signs with ECDSA-P256 keys instead of PGP, and stores
signatures in the registry.

### Why not use $FOO?

See [Requirements](#design-requirements).
We designed `cosign` to meet a few specific requirements, and didn't find anything else that met all of these.
If you're aware of another system that does meet these, please let us know!

### What are the design requirements?

* No external services for signature storage, querying, or retrieval
* We aim for as much registry support as possible
* Everything should work over the registry API
* PGP should not be required at all.
* Users must be able to find all signatures for an image
* Signers can sign an image after push
* Multiple entities can sign an image
* Signing an image does not mutate the image
* Pure-go implementation

## Rekor

### Is the transparency log monitored?

Purdue University operates a log monitor, checking that the log remains append-only. Sigstore provides an easy-to-use GitHub Actions-based monitor for consistency and identity at https://github.com/sigstore/rekor-monitor.

### Can I run my own transparency log monitor?

We would love that, you’re definitely encouraged to do so. The more people monitoring the logs and providing useful services to users, the better. Check out https://github.com/sigstore/rekor-monitor for a GitHub Actions based monitor.
  
### Why is Rekor centralized?

- Well, why not? There's no need for a distributed source of transparency. There can be multiple points of transparency which only adds more sources of security guarantee, not less. An entity can post to as many Rekors as they want and inform users of where they post. We do encourage folks to use common public instances, but we don't seek to enforce this. We do plan to look to produce a gossip protocol, for those that desire a more decentralised model (if the demand is shown).

### How do I verify downloaded code?

Public blockchains often end up using a centralized entry point for canonicalization and authentication. Consensus algorithms can be susceptible to majority attacks, and transparency logs are more mature and capable for what we aim to build with sigstore.

### Why use a Merkle Tree/Transparency log?

- Rekor's back end is [Trillian](https://github.com/google/trillian)
- Trillian is an open source community under active development
- Trilian is deployed by Google, CloudFlare (nimbus), Let's Encrypt for certificate transparency, so it already is considered production grade

### Can I get Rekor to work with my X format, framework standard?

- Yes. Using pluggable types you can create your own manifest layout and send it to Rekor. Head over to [pluggable types](/rekor/pluggable-types/)
