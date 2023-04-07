---
title: "Signing with Self-Managed Keys"
category: "Cosign"
position: 103
---

To generate a key pair in Cosign, run `cosign generate-key-pair`, you'll be interactively prompted to provide a password. 

```shell
$ cosign generate-key-pair
Enter password for private key:
Enter again:
Private key written to cosign.key
Public key written to cosign.pub
```

Alternatively, you can use the `COSIGN_PASSWORD` environment variable to provide one. 

*Note:* Cosign supports RSA, ECDSA, and ED25519 keys. For RSA, Cosign only supports RSA PKCS#1.5 padded keys.

## Key generation and management

To generate keys using a KMS provider, you can use the `cosign generate-key-pair` command with the `--kms` flag.

```shell
$ cosign generate-key-pair --kms <some provider>://<some key>
```

Read more about this in our [KMS Support page](/cosign/kms_support/).

The public key can be retrieved with:

```shell
$ cosign public-key --key <some provider>://<some key>
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEXc+DQU8Pb7Xo2RWCjFG/f6qbdABN
jnVtSyKZxNzBfNMLLtVxdu8q+AigrGCS2KPmejda9bICTcHQCRUrD5OLGQ==
-----END PUBLIC KEY-----
```

## Signing with a local key pair

This usage is a common use case that uses traditional key signing from a key pair. 

```shell
$ cosign sign --key cosign.key user/demo
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```
