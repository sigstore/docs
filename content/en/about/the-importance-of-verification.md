---
type: docs
category: About sigstore
menuTitle: The Importance of Verification
title: The Importance of Verification
weight: 70
---

## A note on verification

As we learned in the [Sigstore overview](({{< relref "about/overview">}})), the Sigstore framework and tooling empowers software developers and consumers to securely sign and verify software artifacts (release files, container images, SBOMs, etc).

With so many tools, and the ability to sign so many types of software artifacts, it could be easy to focus on the details of how to use the project and miss the large picture of what Sigstore is trying to accomplish. Our end goal is a secure software supply chain, but if projects are only using Sigstore to sign their artifacts and no one is verifying those signatures, we are no closer to our goal. A signature becomes valuable when it is checked.

So we would like to implore you to not only make use of our [signing tools](({{< relref "cosign/signing/overview">}})) but of the [verification tools](({{< relref "cosign/verifying/verify">}})) as well.

## For project maintainers

Verfication requires the user of your software to have prior knowledge of the identity of the signer. To help users successfully verify your project we recommend that you publish the signature information in an easily discoverable place that can only be updated by trusted people. For example, the Python Software Foundation [publishes](https://www.python.org/downloads/metadata/sigstore/) a table that includes each signed CPython release, the release manager's email address, and the associated OIDC issuer.

Your project README is an excellent place to let your users know that your project is signed with Sigstore and include a link to further signature information.

## Verification Information

Here are some quick links to further information on using Sigstore's verification tooling.

* [Identity Verification Cheat Sheet](({{< relref "quickstart/verification-cheat-sheet">}}))
* [Verifying with Cosign](({{< relref "cosign/verifying/verify">}}))
* [Verifying using CI](({{< relref "quickstart/quickstart-ci">}}))
