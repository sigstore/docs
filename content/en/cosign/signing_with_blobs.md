---
title: "Signing with Blobs"
category: "Cosign"
position: 109
---

Cosign supports signing and verifying standard files and blobs (or binary large objects), in addition to containers. This topic discusses signing.  For invormation on verifying see [verifying](../verifying.md).


```

## Signing blobs as files

The `cosign sign-blob` command can be used to sign standard files. Signature and certificate information can be sent to a bundled text file, which makes key management invisible infrastructure.  Using a bundle is the simplest way of signing a blob.  Use the `cosign` command to sign:

```
cosign sign-blob <file> --bundle cosign.bundle
```
The bundle is output as a `base64` encoded string that contains the certificate and signature. In addition, signatures are output as `base64` encoded strings to stdout by default. 

```shell
$ cosign sign-blob --key cosign.key README.md
Using payload from: README.md
Enter password for private key:
MEQCIAU4wPBpl/U5Vtdx/eJFgR0nICiiNCgyWPWarupH0onwAiAv5ycIKgztxHNVG7bzUjqHuvK2gsc4MWxwDgtDh0JINw==

$ cosign verify-blob --key cosign.pub --signature MEQCIAU4wPBpl/U5Vtdx/eJFgR0nICiiNCgyWPWarupH0onwAiAv5ycIKgztxHNVG7bzUjqHuvK2gsc4MWxwDgtDh0JINw== README.md
Verified OK
```

This supports all the same flags and features as `cosign sign`, including KMS support, hardware tokens, and keyless signatures.

#### Certificate management

When using `cosign sign-blob` in keyless mode, you may need to store the certificate (in addition to the signature) for verification.
This output defaults to stderr, but can be redirected to a file by using the `--output-certificate` and `--output-signature` flags.

```shell
COSIGN_EXPERIMENTAL=1 cosign sign-blob README.md --output-certificate cert.pem --output-signature sig
Using payload from: README.md
Generating ephemeral keys...
Retrieving signed certificate...
Your browser will now be opened to:
https://oauth2.sigstore.dev/auth/auth?access_type=online&client_id=sigstore&code_challenge=0D8yG7r5IUq77b4egHdmwl0Qibx4AFeLTZDfJVwHLHU&code_challenge_method=S256&nonce=22WQwzdXicldeusZNTXuwY0WBcG&redirect_uri=http%3A%2F%2Flocalhost%3A56461%2Fauth%2Fcallback&response_type=code&scope=openid+email&state=22WQwzRfkMPUI6NIRHhpdcWFHjt
Successfully verified SCT...
using ephemeral certificate:
-----BEGIN CERTIFICATE-----
MIICojCCAiegAwIBAgITXUsve2wjuSq6KkM+u+SpeaAMejAKBggqhkjOPQQDAzAq
MRUwEwYDVQQKEwxzaWdzdG9yZS5kZXYxETAPBgNVBAMTCHNpZ3N0b3JlMB4XDTIx
MTIxOTIxNTgyOFoXDTIxMTIxOTIyMTgyN1owADBZMBMGByqGSM49AgEGCCqGSM49
AwEHA0IABN58WDnzn3s9DZ8SmT5KWSLlnOYl3nAHfP1EfV+lAno39GWWvcVW2htp
Vapzctx5L2Y7JcX8kc8i0rbG36zaBwajggFUMIIBUDAOBgNVHQ8BAf8EBAMCB4Aw
EwYDVR0lBAwwCgYIKwYBBQUHAwMwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUG45K
i7pgxuixE7EpWiwHzrrFPR0wHwYDVR0jBBgwFoAUyMUdAEGaJCkyUSTrDa5K7UoG
0+wwgY0GCCsGAQUFBwEBBIGAMH4wfAYIKwYBBQUHMAKGcGh0dHA6Ly9wcml2YXRl
Y2EtY29udGVudC02MDNmZTdlNy0wMDAwLTIyMjctYmY3NS1mNGY1ZTgwZDI5NTQu
c3RvcmFnZS5nb29nbGVhcGlzLmNvbS9jYTM2YTFlOTYyNDJiOWZjYjE0Ni9jYS5j
cnQwIAYDVR0RAQH/BBYwFIESbG9yZW5jLmRAZ21haWwuY29tMCkGCisGAQQBg78w
AQEEG2h0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbTAKBggqhkjOPQQDAwNpADBm
AjEAhcn+ORgRzA/m4VZ7tUzEs1aTAl87PlVisQIOFW3cBj/5om5vO2hbxptZvORb
adLkAjEAqGj3Dv/DQ0BSnb1mFPrZGp6So4XE9OsV8EUTBXc0mpd1fsmotdhc4KQO
PHpisPhj
-----END CERTIFICATE-----

tlog entry created with index: 965333
Signature wrote in the file sig
Certificate wrote in the file cert.pem
```
