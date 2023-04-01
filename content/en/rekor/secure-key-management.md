# Secure use of Rekor pub key(s)

A guide or document that outlines the steps for securely using Rekor public keys. Here are some possible sections for the document:

## Introduction:
Rekor is an open-source project that provides a tamper-evident log of software artifacts. The logs contain a record of each artifact's metadata, including the artifact's digest, signature, and other relevant information. It is essential to secure key management in Rekor to ensure the authenticity and integrity of the log entries. Public keys are used to verify the signatures on log entries, ensuring that they have not been tampered with. In this guide, we'll cover the steps for securely using Rekor public keys.

## API vs. TUF:
Rekor offers two methods for key management: the Rekor API and The Update Framework (TUF). TUF is the recommended approach for public deployments, while private deployments may choose to use the API with trust-on-first-use. TUF provides a secure method for distributing public keys to clients and verifying signatures on log entries. It uses a set of metadata files that describe the software artifact's expected state, which is signed by a trusted root key.

## Key and certificate locations:
In Rekor, public keys and certificates are stored in the TUF repository for each artifact. Each artifact has a corresponding metadata file, which contains the public key used to verify its signature. The metadata file is signed by a trusted root key, and the signature is included in the file. The root key is stored in a separate metadata file that is signed by a higher-level key. This chain of trust extends up to a root of trust, such as the Sigstore root.

## Keys per shard/log:
In Rekor, each shard or log has one public key assigned to it. The key is used to verify the signatures on log entries. This approach ensures that if one key is compromised, only the entries associated with that key are affected, and other entries remain secure.

## Verifying public keys:
To verify the public keys, you can use openssl or other tools. Here's an example of how to verify a public key using openssl:

1. Retrieve the public key from the TUF repository.
2. Save the key to a file.
3. Use openssl to verify the key's signature: `openssl dgst -sha256 -verify pubkey.pem -signature signature.bin metadata.json`
4. The output should indicate that the signature is valid

## Trusting TUF community trust root:
To trust the Rekor public keys, you need to link them back to the TUF community trust root. Here's how to do it:

1. Retrieve the Sigstore root public key from the Sigstore website.
2. Import the root key into your trusted key store.
3. Retrieve the Rekor root public key from the TUF repository.
4. Verify the Rekor root key's signature using the Sigstore root key: `tuf key verify --root keys/sigstore.root.pem keys/root.json`
5. If the verification succeeds, the Rekor public keys can be trusted.

Using Rekor's tamper-evident log is essential to ensure the authenticity and integrity of software artifacts. Secure key management is crucial to achieve this goal. By following the steps outlined in this guide, you can securely use Rekor public keys to verify the signatures on log entries.
