---
title: "OpenID Connect signing"
category: "Cosign"
position: 115
---

This document explains how identity-based, or "keyless" signing works in Sigstore.

To learn more about OIDC, please review [OIDC Usage in Fulcio](/fulcio/oidc-in-fulcio/).

Keyless signing associates identities, rather than keys, with an artifact signature. Fulcio issues short-lived certificates binding an ephemeral key to an OpenID Connect identity. Signing events are logged in Rekor, a signature transparency log, providing an auditable record of when a signature was created.

See the [Fulcio repository](https://github.com/sigstore/fulcio) and [Rekor repository](https://github.com/sigstore/rekor) for more information.

## Root of Trust

Sigstore's root of trust, which includes Fulcio's root CA certificate and Rekor's public key, are distributed by The Update Framework (TUF). TUF is a framework to provide secure software and file updates. TUF defines a set of protocols to protect against [various types of attacks](https://theupdateframework.io/security/). For more information about how Sigstore uses TUF, see [How Sigstore uses TUF](https://dlorenc.medium.com/using-the-update-framework-in-sigstore-dc393cfe6b52).

## Identity Tokens

Cosign supports two OAuth flows today: the standard flow and the device flow.

When there is no terminal attached (non-interactive mode), Cosign will automatically use the device flow where a link is printed to stdout. This link must be opened in a browser to complete the flow.

In automated environments, Cosign also supports directly using OIDC Identity Tokens from specific issuers. These can be supplied on the command line with the `--identity-token` flag. The `audiences` claim in the token must contain `sigstore`.

### Logging in to identity issuers

To log in and set up your OIDC Identity, follow these steps:

1. Follow the link that Cosign provides to the Issuer login page.
2. Log in to one of the supported systems that is shown:
![Identity Sign-in](/cosign_identity_login.png)
3. Go back to your terminal or other application. Redirection back to Cosign is seamless.

Currently, Sigstore supports Microsoft, Google, and GitHub. As an alternative, you can also use the environment variable `SIGSTORE_ID_TOKEN` to identify yourself by setting its value to that of the identity token. Cosign also has support for detecting some of these automated environments and producing an identity token. Currently this supports Google and GitHub, in addition to other environments. See [Cosign's providers](https://github.com/sigstore/cosign/tree/main/pkg/providers) for a complete list.

### The signing, witnessing, and verifying process

When using Sigstore's defaults for signing and verification, the process of signing is as follows:

#### Verifying identity and signing the artifact

1) An in-memory public/private keypair is created. 
2) Sigstore's certificate authority checks the identity of the user signing the artifact and issues a certificate attesting to their identity. 
3) The certificate is bound to the public key, which adds an extra layer of verification. Exchanging the keys will prove the identity of the private keyholder. 
4) As the artifact is signed, the keys are exchanged, confirming the signer’s identity. 
5) For security, the private key is destroyed shortly after and the short-lived identity certificate expires. Users who wish to verify the software will use the transparency log entry, rather than relying on the signer to safely store and manage the private key.

#### Witnessing and recording the process

To create the transparency log entry, a Sigstore client creates an object containing information that will allow signature verification without the (destroyed) private key. The object contains the hash of the artifact, the public key, and the signature. Crucially, this object is timestamped. The Rekor transparency log "witnesses" the signing event by entering a timestamped entry into the records that attests that the secure signing process has occurred. The software creator publishes the timestamped object, including the hash of the artifact, public key, and signature.

#### Verifying the signed artifact

When a software consumer wants to verify the software’s signature, sigstore compares the signature from the timestamped object against the timestamped Rekor entry. If they match, it confirms that the signature is valid because the user knows that the expected software creator, whose identity was certified at the moment of signing, published the software artifact in their possession. The entry in the Rekor’s immutable transparency log means that there’s no need to rely on a potentially insecure private key to perform the verification. 

### On Google Cloud Platform

From a Google Cloud Engine (GCE) virtual machine, you can use the VM's service account identity to sign an image:

```shell
$ cosign sign --identity-token=$(
    gcloud auth print-identity-token \
        --audiences=sigstore) \
    gcr.io/user-vmtest2/demo
```

From outside a GCE VM, you can impersonate a GCP IAM service account to sign an image:

```shell
$ cosign sign --identity-token=$(
    gcloud auth print-identity-token \
        --audiences=sigstore \
        --include-email \
        --impersonate-service-account my-sa@my-project.iam.gserviceaccount.com) \
    gcr.io/user-vmtest2/demo
```

In order to impersonate an IAM service account, your account must have the `roles/iam.serviceAccountTokenCreator` role.

**Note**: On Google Cloud Build, standard identity tokens are not supported through the GCE metadata server. Cosign has a special flow for this case, where you can instruct the Cloud Build service account to impersonate another service account. To configure this flow:

1. Create a service account to use for signatures (the email address will be present in the certificate subject).
2. Grant the Cloud Build service account the `roles/iam.serviceAccountTokenCreator` role for this target account.
3. Set the `GOOGLE_SERVICE_ACCOUNT_NAME` environment variable to the name of the target account in your cloudbuild.yaml
4. Sign images in GCB, without keys!

## Custom infrastructure

If you're running your own sigtore services flags are available to set your own endpoint's, e.g

```
 cosign sign --oidc-issuer "https://oauth2.example.com/auth" \
                        --fulcio-url "https://fulcio.example.com" \
                        --rekor-url "https://rekor.example.com"  \
                        ghcr.io/jdoe/somerepo/testcosign

```

### Custom roots of trust

For information on custom roots of trust, see [Configuring Cosign with Custom Components](/cosign/custom_components/).


