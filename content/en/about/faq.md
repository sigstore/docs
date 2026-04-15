---
type: docs
category: About Sigstore
menuTitle: FAQs
title: Frequently asked questions
weight: 110
---

This FAQ is intended to go as in depth as possible for anyone using Sigstore.

## General

### What security checks do you use internally?

We’ve adopted a security disclosures and response policy to make sure we can responsibly handle critical issues. We have an initial Security Response Committee, who for each vulnerability reported will coordinate to create the fix and release, and communicate the process. You can read the [full policy on GitHub](https://github.com/sigstore/.github/blob/main/SECURITY.md).

### How does Sigstore integrate in-toto?

Sigstore is co-led by Santiago Torres-Arias, the lead of the in-toto project, and the two efforts are complementary. Sigstore supports and uses in-toto in a number of ways: Cosign can be used to generate and verify in-toto attestations and Rekor can store those attestations. in-toto also supports the use of PKI semantics for signing metadata which will be used in future to support Fulcio for developer key management.

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

## Sigstore and Continuous Integration

### Are there tools available to integrate Sigstore into my CI System?

Yes! Sigstore currently has two GitHub Actions that make it easy to use Sigstore in your workflows.

1. The [`gh-action-sigstore-python`](https://github.com/sigstore/gh-action-sigstore-python) GitHub Action is the easiest way to generate Sigstore signatures for your project, regardless of language ecosystem.
2. The [`cosign-installer`](https://github.com/sigstore/cosign-installer) GitHub Action installs Cosign into your workflow environment. You can use all the features of Cosign when writing your workflow. This GitHub Action allows for container signing.

You can learn more about using these GitHub Actions in our [Sigstore CI Quickstart]({{< relref "quickstart/quickstart-ci">}})

## Rekor

### Is the transparency log monitored?

Purdue University operates a log monitor, checking that the log remains append-only. Sigstore provides an easy-to-use GitHub Actions-based monitor for consistency and identity at [https://github.com/sigstore/rekor-monitor](https://github.com/sigstore/rekor-monitor).

### Can I run my own transparency log monitor?

We would love that. The more people monitoring the logs and providing useful services to users, the better. Check out [https://github.com/sigstore/rekor-monitor](https://github.com/sigstore/rekor-monitor) for a GitHub Actions based monitor.
  
### Why is Rekor centralized?

There's no need for a distributed source of transparency as there can be multiple points of transparency which only adds more sources of security guarantee, not fewer. An entity can post to as many Rekor logs as they want and inform users of where they post. We do encourage folks to use common public instances, but we don't seek to enforce this. We do plan to look to produce a gossip protocol, for those that desire a more decentralised model (if there's demand).

### Why use a Merkle Tree/Transparency log?

* Rekor's back end is [Trillian](https://github.com/google/trillian)
* Trillian is an open source community under active development
* Trilian is deployed by Google, CloudFlare (nimbus), Let's Encrypt for certificate transparency, so it already is considered production grade

### Can I get Rekor to work with my X format, framework standard?

* Yes. Using pluggable types you can create your own manifest layout and send it to Rekor. Head over to [pluggable types]({{< relref "logging/pluggable-types">}})
