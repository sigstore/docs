---
title: "Sigstore"
description: "Documentation for sigstore"
category: "About sigstore"
menuTitle: "Overview"
position: 1
---

<img src="/sigstore_overview_v2.jpg" class="light-img" width="1280" height="640" alt=""/>

**Sigstore empowers software developers to securely sign software artifacts such as release files, container images, binaries, bill of material manifests and more. Signing materials are then stored in a tamper-resistant public log.**

It’s free to use for all developers and software providers, with Sigstore’s code and operational tooling being 100% open source, and everything maintained and developed by the Sigstore community.

## How to use Sigstore

* Sign software artifacts with [Cosign](/cosign/overview) — [Quick start](/cosign/overview#getting-started-quick-start)
* Sign Git commits with [Gitsign](/gitsign/overview) - [Quick start](/gitsign/overview#quick-start)
* Verify entries with [Rekor](/rekor/CLI#verify-proof-of-entry)
* Use the [policy controller](/policy-controller/overview) to enfore Kubernetes policies
* Use the [Fulcio Certificate Authority](/fulcio/overview)

## How Sigstore works

Using Fulcio, Sigstore requests a certificate from our root Certificate Authority (CA). This checks you are who you say you are using OpenID Connect, which looks at your email address to prove you’re the author. Fulcio grants a time-stamped certificate, a way to say you’re signed in and that it’s you.

You don’t have to do anything with keys yourself, and Sigstore never obtains your private key. The public key that Cosign creates gets bound to your certificate, and the signing details get stored in Sigstore’s trust root, the deeper layer of keys and trustees and what we use to check authenticity.

Your certificate then comes back to Sigstore, where Sigstore exchanges keys, asserts your identity and signs everything off. The signature contains the hash itself, public key, signature content and the time stamp. This all gets uploaded to a Rekor transparency log, so anyone can check that what you’ve put out there went through all the checks needed to be authentic.

## Software supply chain security

Software supply chains are exposed to multiple risks. Users are susceptible to various targeted attacks, along with account and cryptographic key compromise. Keys in particular are a challenge for software maintainers to manage. Projects often have to maintain a list of current keys in use, and manage the keys of individuals who no longer contribute to a project. Projects all too often store public keys and digests on git repo readme files or websites, two forms of storage susceptible to tampering and less than ideal means of securely communicating trust.

The tool sets we’ve historically relied on were not built for the present circumstance of remote teams either. This can be seen by the need to create a web of trust, with teams having to meet in person and sign each others’ keys. The current tooling (outside of controlled environments) all too often feel inappropriate to even technical users.

## About the project

Sigstore is a Linux Foundation project backed by Google, Red Hat and Purdue University. We provide a public good, non-profit service to improve the open source software supply chain by easing the adoption of cryptographic software signing.

## Contributing

Up to date documentation, best practices and detailed scenarios for Sigstore live here. These pages are maintained by the community and intended to help anyone get set up easily with any of the technologies, to find what you’re looking for fast. It’s also where we keep all the relevant pages for the Sigstore trust root, from ceremonies to security practices.

Ready to jump in? Check the [contributing guidelines](/contributing).
