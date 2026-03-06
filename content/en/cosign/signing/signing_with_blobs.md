---
type: docs
category: Signing
title: Signing Blobs
weight: 130
---

You can use Cosign for signing and verifying standard files and blobs (or binary large objects), in addition to containers. This topic discusses signing blobs/files. For information on verifying, see [Verifying Signatures]({{< relref "cosign/verifying/verify">}}).

## Keyless signing of blobs and files

Cosign supports identity-based signing, associating an ephemeral signing key with an identity from an OpenID Connect provider. We refer to this process as "keyless signing". You use `cosign sign-blob` to sign standard files as well as blobs. You can store signature and certificate information either as separate file, or in a bundled text file, but using a bundle is the recommended way of signing a blob, as users can specify just the bundle name instead of separate files for the signature and certificate.  Use the `cosign` command to sign:

```shell
$ cosign sign-blob <file> --bundle bundle.sigstore.json 
```

The bundle contains verification metadata, including an artifact's signature, certificate and proof of transparency log inclusion. You need to store the bundle for verification.

## Signing with a key

While keyless signing is recommended, you may specify your own keys for signing.  You will need the password for the private key to sign:

```shell
$ cosign sign-blob --key cosign.key --bundle bundle.sigstore.json README.md
Using payload from: README.md
Enter password for private key:
MEQCIAU4wPBpl/U5Vtdx/eJFgR0nICiiNCgyWPWarupH0onwAiAv5ycIKgztxHNVG7bzUjqHuvK2gsc4MWxwDgtDh0JINw==
```

This supports all the same flags and features as `cosign sign`, including KMS support, hardware tokens, and keyless signatures. See [Signing with Self-Managed Keys]({{< relref "cosign/key_management/signing_with_self-managed_keys">}}) for more information.

## Non-Interactive Signing with the Yes Flag

In situations where automated signing is required, such as within CI/CD pipelines, the `--yes` flag becomes essential. This flag, when used with signing commands, bypasses any confirmation prompts, enabling a smooth, uninterrupted signing process. This is particularly crucial in automated environments where manual input isn't feasible. The `--yes` flag ensures that your signing operations can proceed without manual intervention, maintaining the efficiency and speed of your automated workflows.

```
$ cosign sign-blob --yes --key cosign.key --bundle bundle.sigstore.json myregistry/myimage:latest
```
