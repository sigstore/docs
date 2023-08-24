---
category: About sigstore
description: Documentation for sigstore
home: true
menuTitle: Overview
title: Sigstore
weight: 1
---

![Sigstore](sigstore-logo_horizontal-color.svg)

**Sigstore empowers software developers and consumers to securely sign and verify software artifacts such as release files, container images, binaries, software bills of materials (SBOMs), and more. The signing materials are stored in a tamper-resistant public log so there’s no need to manage or store keys.**

Sigstore is a Linux Foundation project backed by Google, Red Hat, and Purdue University. It is 100% open source and free to use for all developers and software providers. The sigstore community develops and maintains the source code and tooling as a public good, non-profit service to improve the open source software supply chain.  

## Why cryptographic signing?

Digital signatures are a way to verify the authenticity of a software artifact. Software consumers can trace software back to the source to know who created the artifact and that it has not been altered or tampered with after it was signed. 

In a landscape of growing software supply chain attacks, unsigned software is at risk for several attack vectors:

- Typosquatting
- Packages with similar names
- Compromised site where package is hosted
- Tampering after being published

  And so on.
  
## Why sigstore?

Traditional artifact signing relies on exchanging cryptographic keypairs for signature verification. The software creator keeps one key secret (the private “signing” key) and publishes the other (the public “verification” key). When a software consumer wants to verify an artifact’s signature, the veriication keys are exchanged to prove that the holder of the private key created the signature. 

This traditional approach has several weaknesses: 

- Identity. How do you know the person signing the artifact is who they say they are?
- Key management. How do you keep the private key secure so it can’t be lost or stolen? How do you make the public key easily accessible for users, but also protect it from tampering by a malicious attacker?
- Key revocation. If the keypair is compromised, how do you distribute new keys in a way that convinces users of your legitimacy and that you’re not an attacker? 

Sigstore addresses these problems by helping users move away from a key-based signing approach to an identity-based one. When using sigstore’s full capabilities, your artifact is:

- Signed. With easy-to-use tooling (called Cosign)
- Verified. By checking your identity with our certificate authority (called Fulcio)
- Witnessed. By recording the signing information in a permanent transparency log (called Rekor)

The signer can even forgo using long-lived keypairs. With “keyless” or “ephemeral key” signing, users verify the artifact using the transparency log for signature verification rather than keys. Sigstore improves on traditional methods of signing to be more convenient and secure:

- Convenience. Users can take advantage of convenient tooling, easy container signing, and can even bypass the difficult problem of key management and rotation. 
- Security. With sigstore, the artifact is not just signed; it’s signed, verified, and witnessed. 

## How sigstore works

A sigstore client, such as Cosign, requests a certificate from our a code-signing certificate authority (called Fulcio). A verifiable OpenID Connect identity token, which contains a user's email address or service account, is provided in the request. The certificate authority verifies this token and issues a short-lived certificate bound to the provided identity. 

You don’t have to manage signing keys, and sigstore services never obtain your private key. The public key that a sigstore client creates gets bound to the issued certificate, and the private key is discarded after a single signing.

After the client signs the artifact, the artifact's digest, signature and certificate are persisted in Rekor, an immutable, append-only transparency ledger, so that signing events can be publicly audited. Identity owners can monitor the log to verify that their identity is being properly used. This also timestamps the signing event, so that the short-lived certificate can be later verified. 

For verifying an artifact, a sigstore client will verify the signature on the artifact using the public key from the certificate, verify the identity in the certificate matches an expected identity, verify the certificate's signature using Sigstore's root of trust, and verify proof of inclusion in Rekor.

For more information on the modules that make up Sigstore, see [Toolling](/docs/about/tooling/)

## How to use Sigstore

To use sigstore, you must first install the product. See the [Installation](docs/system_config/installation/)  instructions. You can then pick the subject matter you wish to learn about from the menu items on the left. For a quick introduction, you can try using one of the links below:

* To get a quick view of how to use the program see [Quick Start](/docs/signing/quickstart/)
* To learn how to work with blobs, see [sign a blob](docs/signing/signing_with_blobs/)
* To learn how to work with containers, see [sign a container](docs/signing/signing_with_containers/)
* To use Gitsign, see [Sign Git commits with Gitsign](/docs/signing/gitsign/)
* To learn about verification, see [verify entries with Cosign](/docs/verifying/verify/)

## Contributing

Up to date documentation, best practices and detailed scenarios for sigstore live here. These pages are maintained by the community and intended to help anyone get set up easily with any of the technologies, to find what you’re looking for fast. It’s also where we keep all the relevant pages for the sigstore trust root, from ceremonies to security practices.

Ready to jump in? Check the [contributing guidelines](/docs/contributing/).

## Learn more

- [Sigstore YouTube Channel](https://www.youtube.com/@projectsigstore)
- [Sigstore Blog](https://blog.sigstore.dev/) 
