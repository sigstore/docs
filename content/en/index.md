---
title: "Sigstore"
description: "Documentation for sigstore"
category: "About sigstore"
menuTitle: "Overview"
position: 1
---

![Sigstore](/sigstore-logo_horizontal-color.svg)

**Sigstore is a Linux Foundation project backed by Google, Red Hat and Purdue University, that help improve software suppy chain security through automation and transparency. We provide a public good, non-profit service to improve the open source software supply chain by easing the adoption of cryptographic software signing.**

Sigstore empowers software developers to securely sign software artifacts such as release files, container images, binaries, bill of material manifests and more. Signing materials are then stored in a tamper-resistant public log.

It’s free to use for all developers and software providers, with Sigstore’s code and operational tooling being 100% open source, and everything maintained and developed by the Sigstore community.

# Why Supply Chain Security?

Software supply chains face multiple risks, but these risks can be mitigated with careful management. Unfortunately, users are still susceptible to targeted attacks, account and cryptographic key compromises, and other vulnerabilities. In particular, managing cryptographic keys can be a challenge for software maintainers, who must keep track of current keys in use and manage the keys of individuals who are no longer contributing to a project. It is concerning that many projects still store keys in public repositories or on websites, as these forms of storage are susceptible to tampering and not ideal for communicating trust securely.

The current situation of remote teams presents new challenges, and the toolsets we've relied on in the past are no longer suitable. We need to create a web of trust, but traditional methods such as in-person key signing are not always feasible. Unfortunately, current tooling (outside of controlled environments) often falls short, even for technical users.


## How Sigstore works

A Sigstore client, such as Cosign, obtains a certificate from Fulcio, a code-signing certificate authority, by requesting it with a verifiable OpenID Connect identity token. This token contains a user's email address or service account. Fulcio verifies the token and issues a short-lived certificate that is bound to the provided identity.

You don't need to manage signing keys, and Sigstore services will never obtain your private key. The public key that a Sigstore client creates gets bound to the issued certificate, and the private key is discarded after a single signing.

After the client signs the artifact, the artifact's digest, signature, and certificate are stored in Rekor, an immutable, append-only transparency ledger, so that signing events can be publicly audited. Identity owners can monitor the log to verify that their identity is being properly used. This also timestamps the signing event, so that the short-lived certificate can be later verified.

To verify an artifact, a Sigstore client will:

- verify the signature on the artifact using the public key from the certificate
- verify that the identity in the certificate matches an expected identity
- verify the certificate's signature using Sigstore's root of trust
- verify proof of inclusion in Rekor.

## Sigstore Tools 

* Sign software artifacts with [Cosign](/cosign/overview/) — [Quick start](/cosign/overview/#quick-start)
* Sign Git commits with [Gitsign](/gitsign/overview/) - [Quick start](/gitsign/overview/#quick-start)
* Verify entries with [Rekor](/rekor/CLI/#verify-proof-of-entry)
* Use the [policy controller](/policy-controller/overview/) to enforce Kubernetes policies
* Use the [Fulcio Certificate Authority](/fulcio/overview/)


## Contributing

Here you can find up-to-date documentation, best practices, and detailed scenarios for Sigstore. These pages are maintained by the community to help anyone easily set up any of the technologies and quickly find what they're looking for. This is also where we keep all the relevant pages for the Sigstore trust root, from ceremonies to security practices.

Ready to jump in? Check the [contributing guidelines](/contributing/).
