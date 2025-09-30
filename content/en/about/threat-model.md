---
type: docs
category: About Sigstore
description: ''
title: Threat Model
weight: 40
---

## Introduction

**What types of security analysis have you done on Sigstore?**
This page contains the results of a threat modeling exercise on Sigstore. First, we enumerate the components of Sigstore along with third parties and infrastructure that it uses during the [“keyless” signing]({{< relref "cosign/signing/overview">}}) and verification flows. Second, we postulate an attacker that can compromise various subsets of these parties. Finally, we analyze the impact of such an attacker on these security properties. The results of a similar exercise are included in the peer-reviewed paper [Sigstore: Software Signing for Everybody](https://dl.acm.org/doi/pdf/10.1145/3548606.3560596).

This will be most useful to those building secure systems on top of Sigstore, rather than end users. The security guarantees of such systems depends on the details of integration; an example analysis can be found in [TAP-18](https://github.com/theupdateframework/taps/blob/master/tap18.md), which proposes using Sigstore identities with a [TUF](https://theupdateframework.com/) repository used to securely distribute software artifacts.

**Which areas should I be confident in trusting?**
Provided that both Sigstore and its identity providers (like Google or GitHub) are not compromised, you can trust Sigstore signatures correspond to the purported identities. Even in the event of compromise, “auditors” and “monitors” will be able to detect misbehavior; you can run an auditor or monitor yourself! Further, the TUF root of trust provides strong revocation abilities that allow for recovery in the event of a compromise of any Sigstore service.

**Which areas might be more vulnerable in case of compromise?**
In the event of compromise of an identity provider (like Google or GitHub) or individual identity (an account with such a provider), Sigstore will issue certificates to those identities. These certificates will be logged and therefore such compromise can be detected, but this detection relies on monitoring.

**What does a signature guarantee?**

Under normal operation (no Sigstore compromise), verifying a "keyless" signature from `user@example.com` using the `ExampleIdP` identity provider at a given timestamp guarantees that the signature was created by a signer who successfully authenticated to Sigstore using that identity at that time.

It does not guarantee that the signer *should* be able to authenticate (for instance, in the event of a compromised account, or compromised identity provider), that the signer *should* have signed the given message, or that the software artifact in question is "good" (see the section on "Policy" below).

Further, if Sigstore itself is compromised, this property may not hold; see our analysis below.

**What should I do or keep in mind to mitigate these threats when using Sigstore?**
First, users of Sigstore should ensure that they have tooling to audit Sigstore’s transparency logs for consistency and to monitor the use of their identities in Sigstore. Sigstore operators provide [some tooling](https://github.com/sigstore/rekor-monitor) for these efforts. Second, all OIDC accounts used to create Sigstore signatures should have 2FA enabled to reduce the likelihood of a compromise.

In this threat model, we consider the compromise of any of the following:

* Fulcio CA server
* Fulcio CT Log
* Rekor server
* Fulcio monitor
* Rekor monitor
* OIDC server: OIDC issuer/IdP
* OIDC account
* TUF Root of trust

Here’s a high-level diagram of the Sigstore signing flow, with the components and steps that might be compromised highlighted in red:

![Sigstore signing flow](/sigstore-threat-model-signing.svg)

## Main takeaways

* Identity and consistency monitoring is critical to mitigate risks of compromise to both the Fulcio CT log and Rekor. All signers should monitor the Fulcio CT log for unauthorized use of their identity, and all verifiers should look for alerts from consistency monitors.
* The Fulcio CA is a particularly important source of trust and must be hardened.
* OIDC issuers are highly trusted in Sigstore, and only properly hardened OIDC issuers should be used.
* OIDC account compromise is not handled by Sigstore, but we recommend that OIDC issuers provide revocation in the case of a compromised OIDC account. In addition, we recommend the use of 2FA on all OIDC accounts used with Sigstore in order to reduce the likelihood of a compromise.
* TUF root of trust provides strong revocation abilities for all services managed by Sigstore.

## Sigstore threat model

### Scenario for Table 1

This table analyzes the attacker capabilities when the attacker compromises different Sigstore components. This table assumes that Fulcio is used to sign any software artifacts. The storage mechanism (repository, etc.) for artifacts and metadata are out of scope for this model. The table description assumes TUF is not in play, except in the root of trust defined by Sigstore. We assume that there are multiple monitors of Rekor and the Fulcio CT log that communicate with a gossip protocol. Each monitor ensures that the log remains append only by reviewing the full state of the log. A compromise would mean all monitors are compromised. The table is sorted by the impact of the attacker’s capabilities. Compromises which have different capabilities with the same impact are grouped together. The actors in this table are described below:

### Action: Alice signs an artifact with Sigstore

Alice authenticates herself against the OIDC identity provider to get an OIDC ID token. She then sends a certificate request to the Fulcio CA with a generated public key and the OIDC ID token. The Fulcio CA verifies the authenticity of the OIDC ID token with the OIDC identity provider, then extracts the subject from the token to use as the SAN in the certificate. The Fulcio CA generates and signs a precertificate, which is uploaded to the Fulcio CT log. The Fulcio CT log generates and signs a SCT (signed certificate timestamp), which is sent back to the Fulcio CA. The Fulcio CA combines the SCT with the precertificate to get the final certificate which is sent to Alice. Alice uses the key associated with the certificate to sign the artifact. She uploads the certificate and signature to Rekor, which stores them in the logs and returns an SET (signed entry timestamp) that promises inclusion in the log at a particular time. The verifier can use this time to ensure the certificate was used while it was valid.

### Action: Bob verifies an artifact with Sigstore

Bob has an artifact, signature, and Fulcio certificate. He knows that Alice is trusted to sign this artifact due to either a TUF delegation that lists her as the identity, or some other namespacing mechanism such as a policy configuration. Bob gets trusted keys for Sigstore services using the TUF root of trust. He then checks that the certificate was signed by the Fulcio CA and that Alice is the subject. He verifies that the certificate is present in the Fulcio CT log. He checks the signature on the artifact using the key in the certificate. He then checks the Rekor SET embedded in the signature to ensure the signature was made during the validity window of the certificate. Next, he queries Rekor for the proof of inclusion to perform online verification and ensure that the signature is included in the Rekor TL.

### Action: Charlie monitors the Rekor CT log

Charlie queries Rekor periodically and ensures that the log is append-only by ensuring that all entries that were in the log are still present. Charlie also talks to other Rekor monitors to ensure that the tree head is consistent for all users. If he notices an issue, he reports it to Sigstore admins, who verify the report before working toward recovery. Charlie may do additional checks for entry validity.

### Action: Deborah monitors the Fulcio CT log

Deborah queries the Fulcio CT log periodically to ensure that all entries that were in the log are still present. She also talks to other Fulcio monitors to ensure that the tree head is consistent for all users. If she notices an issue, she reports it to Sigstore admins,  who verify the report before working toward recovery.

| **Compromise**          | **Attacker capabilities**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | **Other security impacts** |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----|
|              Fulcio CT monitor | None: alerts will be logged, Sigstore admins manually check reports from Deborah by querying the log and will reject false reports.                                                                                                                                                                                                                                                                                                                                                                                                                      | |
|  Rekor monitor | None: alerts are logged, may be sent to Slack. Sigstore admins manually check reports from Charlie.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | |
| Fulcio CT log | Can remove certificates (invalidate them) by indicating that they are not in the log when Bob queries, fork attack by showing different times or certificates to different users (for things Fulcio has signed), and may block the issuance of Fulcio certificates by not creating an SCT.  | Deletion / fork may be detected by Fulcio CT log monitors. |
|  Rekor Server | Can change the timestamp on Fulcio signatures used outside the validity window to make them appear valid when Bob queries.  Can deny the existence of valid signatures leading to them being untrusted.  | Can later recover using offline delegation in Sigstore’s TUF root of trust.  Deletion or fork attacks may be detected by Rekor monitors. Changes to the Rekor CT log would be challenging to recover as it eliminates the append-only promise of Rekor.                                                                                         |
|  Fulcio CT log AND Fulcio CT log monitor | Same as Fulcio CT log. | Replay and fork attacks are undetected.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Fulcio CT log AND Rekor server | Same as Fulcio CT log and Rekor server rows, but can now use the replayed certs created by Fulcio CT log because Rekor will not report that they are already in the log, even with more sophisticated monitors.                                                                                                                                                                                                                                                                                                                                                     |
| Rekor Server AND Rekor monitor | Same as Rekor server, but changes to the CT log would not be reported by the monitor, would make recovery of the log much harder because the attacker could alter the historical entries, may require re-signing all metadata as previous timestamps are untrusted.                                                                                                                                                                                                                                                                                      |
|  Fulcio CT log AND Fulcio CT log monitor AND Rekor server | Same as Fulcio CT log and Rekor server. | Replay and fork attacks will not be reported by monitors.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Fulcio CA server  | Arbitrary software attack: Can issue certs for any OIDC issuer/identity and use those to sign any software desired. Bob will see these certificates as valid as they are signed by the Fulcio CA and included in the Fulcio CT log. | Fulcio CT log prevents changes to the history  or blocking issuance/modification of past entries (which is not that relevant given the ability to issue keys, etc., now) To recover, the TUF root of trust for Fulcio needs to be invoked to revoke trust in the compromised Fulcio CA server.    |
|   Fulcio CA server AND Fulcio CT log | Arbitrary software attack: Same as Fulcio CA server, but can now also rewrite historical Fulcio certificates in the Fulcio CT log by changing the Merkle tree hash so that the times will appear different when Bob queries. | Modifying CT log history would be caught by the Fulcio monitor. Can recover using the Sigstore root of trust.                                                                                                                                                                                                               |Fulcio CA server and Rekor server | Fulcio CA server and Rekor compromise capabilities. | The recovery is harder than just Fulcio CA server or Rekor server compromise because the history of both tables may be lost.                                                                                                                                                                                                                                                                                                                                                                           |
|    Fulcio CA server AND Fulcio CT log AND Fulcio CT log monitor | Same as Fulcio CA server and Fulcio CT | Replay and fork attacks will not be reported by the monitors.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|   OIDC account | Arbitrary software attack for whatever that specific account has access to. | Might be recoverable through a mechanism set up by the OIDC server.                                                                                                                                                                                                                                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |  Fulcio CA server AND OIDC account| Same as OIDC account and Fulcio, but can use OIDC for an attack that is harder to recover from, or Fulcio for an attack that is not account limited.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|  OIDC server | Arbitrary software attack for anything that OIDC domain covers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |  Fulcio CA server AND OIDC server | Same as OIDC server + Fulcio.  OIDC cannot recover, Fulcio is not domain limited                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Sigstore root of trust | Can become the Fulcio CA, Rekor, the Fulcio CA log, etc. Arbitrary software attack is trivial from there with MITM. | Monitors may detect the attack, but Sigstore admins can’t recover without control of the root of trust.                                                                                                                                                                                                                                                                                                                              |

## Mitigations and recommendations

Here, we describe recommendations for using Sigstore in such a way that the likelihood and impact of a compromise are both mitigated.

### 2FA on OIDC accounts

As shown in the table above, compromise of an OIDC account is sufficient for an arbitrary software attack for any packages that account is trusted to sign. To mitigate this risk, we recommend reducing the likelihood of account compromise through the use of 2FA on all accounts that will be used with Sigstore. 2FA requires that not just a password, but a second factor like a YubiKey or authenticator app is also compromised. For maximum security, users should avoid less secure forms of 2FA such as text messages and phone calls.

OIDC does not provide a mechanism for checking if accounts have 2FA enabled, and so enforcement of this recommendation is up to individual signers in the ecosystem.

### Identity monitors

All certificates that are issued by Fulcio are written to a Certificate Transparency log, accessible at ctfe.sigstore.dev. For each artifact, Sigstore clients publish the artifact's hash, signature, and certificate to this transparency log. A signature verifier must check that an artifact has been uploaded to Rekor and the certificate has been published to Fulcio's log before trusting the artifact. This ensures that the artifact and certificate are publicly auditable, so that the identity owner can monitor the log to find unexpected occurrences of their identity.

Sigstore provides an easy-to-use GitHub Actions-based log monitor, [rekor-monitor](https://github.com/sigstore/rekor-monitor). Currently, it supports monitoring identities only for the hashedrekord Rekor type, which is the default uploaded type for Cosign and other Sigstore clients. See the [README](https://github.com/sigstore/rekor-monitor#readme) for information on setting up the reusable workflow with identity monitoring.

Identities can include email or machine identity, for example for CI workflows such as GitHub Actions or GKE. rekor-monitor currently supports matching on exact string matches, which works well for email or specific CI workflows. We plan to add support for matching on regular expressions so that repository owners can monitor across repositories in an organization.

### Secure distribution (and revocation) of Sigstore key material

The above compromise scenarios for Fulcio, Rekor, and other parties describe either a compromise of the infrastructure itself or a compromise of the signing material used by those parties to make claims. That is, if you had Fulcio’s signing key, you wouldn’t need to additionally hack Fulcio to make false claims.

This means that secure distribution of Sigstore key material is paramount for security—if that process can be intercepted, we can consider all of the infrastructure effectively compromised.

To deal with this, we recommend the use of a strong root of trust for distributing the key material. Once that root of trust is established, all additional key material can flow through the root of trust. Specifically, we recommend using The Update Framework (TUF) to distribute this key material, as is done by the public good instance. This supports features like:

* Threshold signing by root-of-trust keys (the root of trust can comprise 5 keys, and signatures from 3 of 5 are needed to add new top-level key material).
* Root keys are offline.
* Rotation of both the root keys and other key material.
* Revocation: compromised material can be marked as such, with an indication of the compromise time to allow continued verification of legitimate signatures from before the compromise.
* Freshness: if an attacker tries to use an old key by preventing the victim from getting updates to key material (or serving old key material), the victim will detect this.

The Sigstore public good instance has a [root of trust](https://github.com/sigstore/root-signing) based on TUF that can be publicly audited, with geographically- and organizationally-distributed root key holders.

### Policy considerations

The security guarantees that Sigstore provides are useful but relatively minimal: it can show you that a signature came from someone controlling a specific digital identity, but not whether you should trust that identity. Critically, [not everything that’s signed is secure](https://blog.sigstore.dev/signatus-ergo-securus-who-can-sign-what-with-tuf-and-sigstore-ea4d3d84b8b6): when verifying software, you need a policy for knowing whom to trust.

That policy should cover:

* How do you identify software artifacts (e.g., by their name)?
* Which identities are permitted to sign a given software artifact?
* Which identity providers can those identities come from?
  * Do the identity providers perform identity verification like “know-your-customer?”
  * Do they handle account compromise and recovery?
* Do you permit the use of public verification keys for identities, or must identities have an associated identity provider?
* Which Sigstore instance(s) do you trust, and how do you retrieve the key material for those instances?
* How do you handle revocation?

The answers will be different in different settings. For instance, a small organization may be able to meet their security needs by requiring signatures from one fixed party, with a blocklist for revoked artifacts. A large package repository may need to manage signing identities that change frequently over time. We hope to provide more detailed guidance for a variety of settings in future documentation.
