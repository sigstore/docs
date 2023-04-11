---
title: "Signing Blobs"
category: "Cosign"
position: 109
---

Cosign supports signing and verifying standard files and blobs (or binary large objects), in addition to containers. This topic discusses signing. For information on verifying, see [Verifying](/cosign/verify).

## Signing blobs as files in keyless mode

Cosign supports identity-based signing, associating an ephemeral signing key with an identity from an OpenID Connect provider. We refer to this process as "keyless signing". The `cosign sign-blob` command can be used to sign standard files as well as blobs. Signature and certificate information can be sent to a bundled text file, which makes key management invisible infrastructure.  Using a bundle is the recommended way of signing a blob.  Use the `cosign` command to sign:

```shell
$ cosign sign-blob <file> --bundle cosign.bundle
```
The bundle is output as a `base64` encoded string that contains the certificate and signature. In addition, signatures are output as `base64` encoded strings to stdout by default. 

When using `cosign sign-blob` in keyless mode, you need to store the bundle for verification. If you don't want to use the bundle, you can direct the output of the certificate by using the `--output-certificate` and `--output-signature` flags. The result from using the output flags:

```shell
$ cosign sign-blob README.md --output-certificate cert.pem --output-signature sig
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


## Signing with a key

You may specify your own keys for signing.  You will need the password for the private key to sign:

```shell
$ cosign sign-blob --key cosign.key README.md
Using payload from: README.md
Enter password for private key:
MEQCIAU4wPBpl/U5Vtdx/eJFgR0nICiiNCgyWPWarupH0onwAiAv5ycIKgztxHNVG7bzUjqHuvK2gsc4MWxwDgtDh0JINw==
```

This supports all the same flags and features as `cosign sign`, including KMS support, hardware tokens, and keyless signatures.

## Blobs in OCI Registries

You can upload blobs to an OCI registry (similar to [ORAS](https://github.com/oras-project/oras)) where they can then be signed like any other image.

You can publish an artifact with `cosign upload blob`:

```shell
$ echo "my first artifact" > artifact
$ cosign upload blob -f artifact gcr.io/user/demo/artifact
Uploading file from [artifact] to [gcr.io/user/demo/artifact:latest] with media type [text/plain; charset=utf-8]
File is available directly at [us.gcr.io/v2/user/demo/readme/blobs/sha256:b57400c0ad852a7c2f6f7da4a1f94547692c61f3e921a49ba3a41805ae8e1e99]
us.gcr.io/user/demo/readme@sha256:4aa3054270f7a70b4528f2064ee90961788e1e1518703592ae4463de3b889dec
```

Your users can download it from the "direct" URL with standard tools like curl or wget:

```shell
$ curl -L gcr.io/v2/user/demo/artifact/blobs/sha256:97f16c28f6478f3c02d7fff4c7f3c2a30041b72eb6852ca85b919fd85534ed4b > artifact
```

The digest is baked right into the URL, so users can check that as well:

```shell
$ curl -L gcr.io/v2/user/demo/artifact/blobs/sha256:97f16c28f6478f3c02d7fff4c7f3c2a30041b72eb6852ca85b919fd85534ed4b | shasum -a 256
97f16c28f6478f3c02d7fff4c7f3c2a30041b72eb6852ca85b919fd85534ed4b  -
```

You can sign it with the normal `cosign sign` command and flags:

```shell
$ cosign sign gcr.io/user/demo/artifact
```

