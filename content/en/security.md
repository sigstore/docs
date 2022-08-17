---
title: 'Security Model'
description: ''
category: 'About sigstore'
position: 3
---

The Sigstore security model has a few key components, each aimed at establishing trust or proving identity. For a quick overview of the key services mentioned in this document, see [main concepts](main-concepts).

## Proving Identity in Sigstore

Sigstore relies on the widely used OpenID Connect (OIDC) protocol to prove identity. When running something like `cosign sign`, users will complete an OIDC flow and authenticate via an identity provider (GitHub, Google, etc.) to prove they are the owner of their account. Similarly, automated systems (like GitHub Actions) can use Workload Identity or [SPIFFE](https://spiffe.io/) Verifiable Identity Documents (SVIDs) to authenticate themselves via OIDC. The identity and issuer associated with the OIDC token is embedded in the short-lived certificate issued by Sigstore’s Certificate Authority, Fulcio. 

## Sigstore’s Trust Model

Sigstore’s trust model originates from the Trust Root and chains down to short-lived certificates issued by Fulcio. 

### Sigstore’s Trust Root

The Trust Root, which was established during a public [root key signing ceremony](https://www.youtube.com/watch?v=GEuFsc8Zm9U), is made up of a rotation of five keyholders from varying companies and academic institutions who contribute to Sigstore. It leverages the principles of [The Update Framework](https://theupdateframework.io/) (TUF), a set of defined attacks and threat models specific to software distribution systems. TUF provides a cleverly designed set of protocols to protect against these types of attacks, which the Trust Root follows.

The Sigstore Trust Root is used to secure the keys used by the entire Sigstore project. It allows individuals and systems to automatically retrieve trusted keys and certificates used to verify artifacts produced by the Sigstore ecosystem. Using the Sigstore Trust Root, end users can verify:
* Certificates issued by Fulcio
* Entries in the Rekor transparency log
This allows end users to verify (and trust) that the distributors of the software they use are who they say they are.

For more details on the Trust Root or the key signing ceremony, see [A New Kind of Trust Root](https://blog.sigstore.dev/a-new-kind-of-trust-root-f11eeeed92ef). For an overview of TUF, see [The Update Framework and You](https://blog.sigstore.dev/the-update-framework-and-you-2f5cbaa964d5).

### Rekor Security Model
The Rekor service provides a transparency log of software signatures. The log is append-only and once entries are added they cannot be modified; a valid log can be cryptographically verified by any third-party. As entries are appended into this log, Rekor periodically signs the full [Merkle tree](https://transparency.dev) along with a timestamp.

An entry in Rekor provides a single-party attestation that a piece of data existed prior to a certain time. These timestamps and the contents of the log cannot be tampered with or removed later, providing long-term trust. This long-term trust also requires that the log is monitored.

Transparency Logs make it hard to forge timestamps long term, but in short time windows, it would be much easier for the Rekor operator to fake or forge timestamps. To mitigate this, Rekor’s timestamps and tree head are signed with a valid Signed Tree Head (STH) that contains a non-repudiable timestamp. These signed timestamp tokens are saved as evidence in case Rekor’s clock changes in the future.

### Fulcio Security Model

One of the targets secured by the Sigstore Trust Root is the Fulcio root certificate, which is used to issue short-lived code signing certificates. 

**Certificate Transparency Log**

Fulcio assumes that a valid OIDC token from a trusted provider is sufficient “proof of ownership” of the associated identity.  To help protect against OIDC compromise, Fulcio uses an append-only certificate transparency log. This means:

* Fulcio MUST publish all certificates to the log.
* Clients MUST NOT trust certificates that are not in the log.

As a result, users can detect any misissued certificates (detection). Combined with Rekor's signature transparency, artifacts signed with compromised accounts can be identified (auditability).

_Note: Fulcio itself does not monitor the certificate transparency log; users are responsible for monitoring the log for unauthorized certificates issued to their identities._

**Short Lived Certificates**

Fulcio also uses short-lived certificates as a solution to the key management problem. Traditional signing involves issuing long-lived certificates, but this method assumes that users won’t lose their private key or that the key won’t get stolen or otherwise compromised for long periods of time.

Fulcio was designed to avoid revocation by issuing short-lived certificates instead. When signing, the user only needs to know that the artifact was signed while the certificate was valid. 

How can a user do that?

### Putting it All Together

End users can leverage Fulcio's short-lived code signing certificates and Rekor's transparency log to confirm that an artifact was signed while the certificate was valid. When a signature is stored in the log, the associated entry is included into the log with a signed timestamp. End users can request the entry, cryptographically verify the timestamp is correct, and verify that an artifact was signed while the certificate was valid.

Storing the signature in a transparency log also makes certificates easily discoverable so that maintainers don’t have to worry about public key distribution.

**Ephemeral Keys**

Sigstore clients like Cosign can also eliminate the key management problem by using ephemeral keys. These ephermeral keys only exist in memory; the private key never hits disk and is never known by Sigstore services.

Cosign will:
1. Generate an ephemeral public/private keypair in memory
1. Bind the public key to a short-lived certificate requested from Fulcio
1. Sign an artifact with the ephemeral private key while the certificate is still valid
1. Store the signature and certificate in Rekor as proof the artifact was signed while the certificate was valid

Clients like Cosign only need to find the correct Rekor entry to verify the artifact.

## What Sigstore *Doesn't* Guarantee

- If an OIDC identity or OIDC provider is compromised, Fulcio might issue unauthorized certificates. However, these certificates are useless unless they are published to the certificate transparency log, so such compromise can be detected.
- If Fulcio is compromised, it might issue unauthorized certificates. However, like before, these should be detectable.
- If no third parties monitor the logs, then any misbehavior by Rekor and Fulcio might go undetected.
