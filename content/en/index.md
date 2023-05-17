---
title: "Sigstore"
description: "Documentation for sigstore"
category: "About sigstore"
menuTitle: "Overview"
position: 1
---

![Sigstore](/sigstore-logo_horizontal-color.svg)

**Sigstore empowers software developers to securely sign software artifacts such as release files, container images, binaries, bill of material manifests and more. Signing materials are then stored in a tamper-resistant public log.**

It’s free to use for all developers and software providers, with Sigstore’s code and operational tooling being 100% open source, and everything maintained and developed by the Sigstore community.

## How to use Sigstore

* I want to [install and Quick Start](/cosign/overview/#quick-start)
* I want to [sign a blob](cosign/signing_with_blobs/)
* I want to [sign a container](cosign/signing_with_containers/)
* I want to Sign Git commits with [Gitsign](/gitsign/overview/) - [Quick start](/gitsign/overview/#quick-start)
* I want to [verify entries with Cosign](/cosign/verify/)

## How Sigstore works

A Sigstore client, such as Cosign, requests a certificate from Fulcio, a code-signing certificate authority. A verifiable OpenID Connect identity token, which contains a user's email address or service account, is provided in the request. Fulcio verifies this token and issues a short-lived certificate bound to the provided identity. 

You don’t have to manage signing keys, and Sigstore services never obtain your private key. The public key that a Sigstore client creates gets bound to the issued certificate, and the private key is discarded after a single signing.

After the client signs the artifact, the artifact's digest, signature and certificate are persisted in Rekor, an immutable, append-only transparency ledger, so that signing events can be publicly audited. Identity owners can monitor the log to verify that their identity is being properly used. This also timestamps the signing event, so that the short-lived certificate can be later verified. 

For verifying an artifact, a Sigstore client will verify the signature on the artifact using the public key from the certificate, verify the identity in the certificate matches an expected identity, verify the certificate's signature using Sigstore's root of trust, and verify proof of inclusion in Rekor.

## Software supply chain security

Software supply chains are exposed to multiple risks. Users are susceptible to various targeted attacks, along with account and cryptographic key compromise. Keys in particular are a challenge for software maintainers to manage. Projects often have to maintain a list of current keys in use, and manage the keys of individuals who no longer contribute to a project. Projects all too often store public keys and digests on git repo readme files or websites, two forms of storage susceptible to tampering and less than ideal means of securely communicating trust.

The tool sets we’ve historically relied on were not built for the present circumstance of remote teams either. This can be seen by the need to create a web of trust, with teams having to meet in person and sign each others’ keys. The current tooling (outside of controlled environments) all too often feel inappropriate to even technical users.

## About the project

Sigstore is a Linux Foundation project backed by Google, Red Hat and Purdue University. We provide a public good, non-profit service to improve the open source software supply chain by easing the adoption of cryptographic software signing.

## Contributing

Up to date documentation, best practices and detailed scenarios for Sigstore live here. These pages are maintained by the community and intended to help anyone get set up easily with any of the technologies, to find what you’re looking for fast. It’s also where we keep all the relevant pages for the Sigstore trust root, from ceremonies to security practices.

Ready to jump in? Check the [contributing guidelines](/contributing/).
