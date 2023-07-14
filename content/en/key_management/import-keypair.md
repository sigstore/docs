---
title: "Importing Key Pairs"
category: "Key management"
position: 510
---

> Currently only supports RSA and ECDSA private keys

### Import a Key Pair

The importing of a key pair with `cosign` is as follows.

```shell
$ cosign import-key-pair --key opensslrsakey.pem
Enter password for private key:
Enter password for private key again:
Private key written to import-cosign.key
Public key written to import-cosign.pub
```

### Sign a container with imported keypair

The use of the imported key pair to sign an artifact with `cosign` is as follows.

```shell
$ cosign sign --key import-cosign.key $IMAGE_DIGEST
Enter password for private key:
tlog entry created with index: *****
Pushing signature to: *****
```
