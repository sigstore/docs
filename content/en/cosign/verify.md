---
title: "Verifying"
category: "Cosign"
position: 106
---

The general verification format with the `cosign verify` command is as follows.

```shell
$ cosign verify [--key <key path>|<key url>|<kms uri>] <image uri> 
```
## Keyless verification using OpenID Connect

We'll use `user/demo` as our example image in the following commands and keyless signing where appropriate.

For identity-based verification of a container image, use the following command:

```
$ cosign verify <image URI> --certificate-identity=name@example.com 
                            --certificate-oidc-issuer=https://accounts.example.com
                           
```

The oidc-issuer for Google is https://accounts.google.com, Microsoft is https://login.microsoftonline.com, and GitHub is https://github.com/login/oauth.

The following example verifies the signature on file.txt from user name@example.com issued by accounts@example.com. It uses a provided bundle cosign.bundle that contains the certificate and signature.

```
$ cosign verify-blob <file> --bundle cosign.bundle --certificate-identity=name@example.com 
                              --certificate-oidc-issuer=https://accounts.example.com
```

With container images, the signature and certificate are attached to the container.  For blobs, the signature and certificate can be stored in a bundle file that is created at the time of signing.  Either the bundle must be specified, or the individual signature and certificate must be specified.

**Important Note**:

Signature payloads created by `cosign` included the digest of the container image they are attached to.
By default, `cosign` validates that this digest matches the container during `cosign verify`.

If you are using other payload formats with `cosign`, you can use the `--check-claims=false` flag:

```shell
$ cosign verify --check-claims=false user/demo
Warning: the following claims have not been verified:
{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8"},"Type":"cosign container image signature"},"Optional":null}
```

This will still verify the signature and payload against the supplied public key, but will not
verify any claims in the payload.

## Verify multiple images

You can pass more than one image to `cosign verify`. 

```shell
$ cosign verify user-0/demo-0 user-1/demo-1
```

## Local verifications

Verify with an on-disk public key provided by the signer or other organization:

```shell
$ cosign verify --key cosign.pub user/demo
```

Verify with an on-disk signed image from `cosign save`:

```shell
$ cosign verify --key cosign.pub --local-image PATH/to/user/demo
```

Verify image with local certificate and local certificate chain:

```shell
$ cosign verify --certificate cosign.crt --certificate-chain chain.crt user/demo
```

## Verify an image on the transparency log

```shell
$ cosign verify user/demo
```

## Verify attestation

You can verify attestations on an image with `verify-attestation`.

```shell
$ cosign verify-attestation user/demo
```

This will work with other flags, for example public key.

```shell
$ cosign verify-attestation --key cosign.pub user/demo
```

You can also verify an attestation with the transparency log.

```shell
$ cosign verify-attestation user/demo
```

## Verify annotations

Annotations made in the original signature (`cosign sign -a foo=bar`) are present under the `Optional` section of the payload:

```shell
$ cosign verify --key cosign.pub  user/demo | jq .
{
  "Critical": {
    "Identity": {
      "docker-reference": ""
    },
    "Image": {
      "Docker-manifest-digest": "97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36"
    },
    "Type": "cosign container image signature"
  },
  "Optional": {
    "sig": "original"
  }
}
```

These can be checked with matching `-a foo=bar` flags on `cosign verify`.
When using this flag, **every** specified key-value pair **must exist and match** in the verified payload.
The payload may contain other key-value pairs.

```shell
# This works
$ cosign verify -a --key cosign.pub  user/demo
{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36"},"Type":"cosign container image signature"},"Optional":{"sig":"original"}}

# This works too
$ cosign verify -a sig=original --key cosign.pub  user/demo
{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36"},"Type":"cosign container image signature"},"Optional":{"sig":"original"}}

# This doesn't work
$ cosign verify -a sig=original -a=foo=bar --key cosign.pub  user/demo
error: no matching claims:
invalid or missing annotation in claim: map[sig:original]
```

## Download the signatures to verify with another tool

Each signature is printed to `stdout` in a JSON format:

```
$ cosign download signature us-central1-docker.pkg.dev/user-vmtest2/test/taskrun
{"Base64Signature":"Ejy6ipGJjUzMDoQFePWixqPBYF0iSnIvpMWps3mlcYNSEcRRZelL7GzimKXaMjxfhy5bshNGvDT5QoUJ0tqUAg==","Payload":"eyJDcml0aWNhbCI6eyJJZGVudGl0eSI6eyJkb2NrZXItcmVmZXJlbmNlIjoiIn0sIkltYWdlIjp7IkRvY2tlci1tYW5pZmVzdC1kaWdlc3QiOiI4N2VmNjBmNTU4YmFkNzliZWVhNjQyNWEzYjI4OTg5ZjAxZGQ0MTcxNjQxNTBhYjNiYWFiOThkY2JmMDRkZWY4In0sIlR5cGUiOiIifSwiT3B0aW9uYWwiOm51bGx9"}
```

## Retrieving a public key

If you lose the public key for some reason, you can re-export it from the private key.
(This also works with other key reference types, explained below)

```shell
$ ./cosign public-key --key cosign.key
Enter password for private key:
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjCxhhvb1KmIfe1J2ceT25kHepstb
IDYuTA0U1ri4F0CXXazLiftzGlyfse1No4orr8w1ZIchQ8TJlyCSaSuR0Q==
-----END PUBLIC KEY-----
```

### Verifyng KMS signatures

To verify using a key managed by a KMS provider, you can pass a provider-specific URI to the `--key` command:

```shell
$ cosign verify --key <some provider>://<some key> gcr.io/user-vmtest2/demo

Verification for gcr.io/user-vmtest2/demo --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.

[{"critical":{"identity":{"docker-reference":"gcr.io/user-vmtest2/demo"},"image":{"docker-manifest-digest":"sha256:410a07f17151ffffb513f942a01748dfdb921de915ea6427d61d60b0357c1dcd"},"type":"cosign container image signature"},"optional":null}]
```

### Retrieve the public key from a private key or KMS

When verifying using the full `--kms <some provider>://<some key>` reference, you'll make an API request to that service.
This may require special permissions, depending on the service.

Another option is to use `cosign` to export the public key from the service, and you can use that to verify signatures:

```shell
$ cosign public-key --key <some provider>://<some key> > kms.pub
$ cosign verify --key kms.pub gcr.io/user-vmtest2/demo
```

KMS:
```shell
# Retrieve from Google Cloud KMS
$ cosign public-key --key gcpkms://projects/someproject/locations/us-central1/keyRings/foo/cryptoKeys/bug/versions/1
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgrKKtyws86/APoULh/zXk4LONqII
AcxvLtLEgRjRI4TKnMAXtIGp8K4X4CTWPEXMqSYZZUa2I1YvHyLLY2bEzA==
-----END PUBLIC KEY-----

# Retrieve from HashiCorp Vault
$ cosign public-key --key hashivault://transit
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgrKKtyws86/APoULh/zXk4LONqII
AcxvLtLEgRjRI4TKnMAXtIGp8K4X4CTWPEXMqSYZZUa2I1YvHyLLY2bEzA==
-----END PUBLIC KEY-----
```
## Custom Components

For configuring Cosign to work with custom components, checkout the [Configuring Cosign with Custom Components](https://docs.sigstore.dev/cosign/custom_components/) docs to find out how to achieve this.

### Custom Root Cert

You can override the public good instance CA using the environment variable `SIGSTORE_ROOT_FILE`, e.g.

```
export SIGSTORE_ROOT_FILE="/home/jdoe/myrootCA.pem"
```

## Experimental Features

### Verify a signature was added to the transparency log

There are two options for verifying a Cosign signature was added to a transparency log:
1. Check the log to make sure the entry exists in the log
2. Use the `bundle` annotation on a Cosign signature to verify an element was added to the log without hitting the log

The Cosign `bundle` annotation contains a Signed Entry Timestamp (SET), which is conceptually similar to an SCT in a Web PKI system.
The SET is a signed inclusion promise provided by the transparency log, which acts as a guarantee by the log that an element has been included in it.
The SET can be verified with the logs public key and used to prove that an element is in the log without actually checking the log itself.

For more details on how the `bundle` annotation is formatted, review the Cosign [spec](https://github.com/sigstore/cosign/blob/main/specs/SIGNATURE_SPEC.md).

To verify the `bundle` annotation, follow these steps:
1. Marshal the `bundle` Payload into JSON
1. Canonicalize the payload by following RFC 8785 rules
1. Verify the canonicalized payload and signedEntryTimestamp against the transparency logs public key
