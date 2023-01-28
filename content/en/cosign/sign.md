---
title: "Signing"
category: "Cosign"
position: 105
---

The general signing format with the `cosign sign` command is as follows.

```shell
$ cosign sign --key <key path>|<kms uri> [--payload <path>] [-a key=value] [--upload=true|false] [-f] [-r] <image uri>
```

We'll use `user/demo` as our example image in the following commands. 

## Sign with a local key pair

This usage is a common use case that uses traditional key signing from a key pair. 

```shell
$ cosign sign --key cosign.key user/demo
```

If you need to generate local keys, you can do so by running `cosign generate-key-pair`.

## Keyless signing

You can use Cosign to sign with ephemeral keys by authenticating with an OIDC (OpenID Connect) protocol supported by Sigstore. Currently, you can authenticate with Google, GitHub, or Microsoft. For more information, read [Keyless Signatures](/cosign/keyless/).

## Sign a container multiple times

Multiple signatures can be "attached" to a single container image:

```shell
$ cosign sign --key cosign.key user/demo
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig

$ cosign sign --key other.key user/demo
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

This only signs the digest, but you can pass by tag or digest.

## Add annotations with a signature

The `-a` flag can be used to add annotations to the generated, signed payload.

This flag can be repeated:

```shell
$ cosign sign --key other.key -a foo=bar user/demo
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

These values are included in the signed payload under the `Optional` section.

```json
"Optional":{"baz":"bat","foo":"bar"}
```

They can be verified with the `-a` flag as part of the `cosign verify` command.

## Sign and attach a certificate and certificate chain

You can sign a container and attach an existing certificate and certificate chain to an image. Note that you cannot currently generate a certificate chain but can use an existing chain. 

```shell
$ cosign sign --key cosign.key --cert cosign.crt --cert-chain chain.crt user/demo
```

## Sign with a key pair stored elsewhere

Cosign can use environment variables and KMS (Key Management Service) APIs, in addition to fixed keys.
When referring to a key managed by a KMS provider, `cosign` takes a [go-cloud](https://gocloud.dev) style URI to refer to the specific provider. The URI path syntax is provider specific.

```shell
$ cosign sign --key <some provider>://<some key> gcr.io/user-vmtest2/demo
Pushing signature to: gcr.io/user-vmtest2/demo:sha256-410a07f17151ffffb513f942a01748dfdb921de915ea6427d61d60b0357c1dcd.cosign
```

Read more about this in our [KMS Support page](/cosign/kms_support/).

### Key stored in an environment variable

```shell
$ cosign sign --key env://[ENV_VAR] user/demo
```

### Key stored in Azure Key Vault

```shell
$ cosign sign --key azurekms://[VAULT_NAME][VAULT_URI]/[KEY] user/demo
```

### Key stored in AWS KMS

```shell
$ cosign sign --key awskms://[ENDPOINT]/[ID/ALIAS/ARN] user/demo
```

### Key stored in Google Cloud KMS

```shell
$ cosign sign --key gcpkms://projects/[PROJECT]/locations/global/keyRings/[KEYRING]/cryptoKeys/[KEY]/versions/[VERSION] user/demo
```

### Key stored in Hashicorp Vault

```shell
$ cosign sign --key hashivault://[KEY] user/demo
```

### Key stored in a Kubernetes secret

```shell
$ cosign sign --key k8s://[NAMESPACE]/[KEY] user/demo
```

## Sign and upload a generated payload (in another format, from another tool)

The payload must be specified as a path to a file.

```shell
$ cosign sign --key cosign.key --payload README.md user/demo
Using payload from: README.md
Enter password for private key:
Pushing signature to: index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

You can also sign with another tool.
Cosign uses standard PKIX cryptographic formats, here's a full example with `openssl`:

```shell
# Generate a keypair
$ openssl ecparam -name prime256v1 -genkey -noout -out openssl.key
$ openssl ec -in openssl.key -pubout -out openssl.pub
# Generate the payload to be signed
$ cosign generate us.gcr.io/user-vmtest2/demo > payload.json
# Sign it and convert to base64
$ openssl dgst -sha256 -sign openssl.key -out payload.sig payload.json
$ cat payload.sig | base64 > payloadbase64.sig
# Upload the signature
$ cosign attach signature --payload payload.json --signature payloadbase64.sig us.gcr.io/user-vmtest2/demo
# Verify!
$ cosign verify --key openssl.pub us.gcr.io/user-vmtest2/demo
Verification for us.gcr.io/user-vmtest2/demo --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.
{"critical":{"identity":{"docker-reference":"us.gcr.io/user-vmtest2/demo"},"image":{"docker-manifest-digest":"sha256:124e1fdee94fe5c5f902bc94da2d6e2fea243934c74e76c2368acdc8d3ac7155"},"type":"cosign container image signature"},"optional":null}
```

## Sign but skip upload (to store somewhere else)

The upload is skipped by using the `--upload=false` flag (default true). To capture the output use the `--output-signature FILE` and/or `--output-certificate FILE` flags.

```shell
$ cosign sign --key key.pem --upload=false --output-signature demo.sig --output-certificate demo.crt user/demo
```

## Generate the signature payload (to sign with another tool)

The json payload is printed to stdout:

```shell
$ cosign generate user/demo
{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8"},"Type":"cosign container image signature"},"Optional":null}
```

This can be piped directly into OpenSSL.

```shell
$ cosign generate user/demo | openssl...
```

## Upload a generated signature

The signature is passed via the `--signature` flag.
It can be a file:

```shell
$ cosign attach signature --signature file.sig user/demo
Pushing signature to: user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

The base64-encoded signature:

```shell
$ cosign attach signature --signature Qr883oPOj0dj82PZ0d9mQ2lrdM0lbyLSXUkjt6ejrxtHxwe7bU6Gr27Sysgk1jagf1htO/gvkkg71oJiwWryCQ== user/demo
Pushing signature to: user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def.sig
```

Or, `-` for `stdin` for chaining from other commands:

```shell
$ cosign generate user/demo | openssl... | cosign attach signature --signature -- user/demo
Pushing signature to: user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def.sig
```

## Signature location and management

Signatures are uploaded to an OCI artifact stored with a predictable name.
This name can be located with the `cosign triangulate` command:

```shell
$ cosign triangulate user/demo
index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

They can be reviewed with `crane`:

```shell
$ crane manifest $(cosign triangulate gcr.io/user-vmtest2/demo) | jq .
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
  "config": {
    "mediaType": "application/vnd.docker.container.image.v1+json",
    "size": 342,
    "digest": "sha256:f5de0db6e714055d48b4bb3a374e9630c4923fa704d9311da6a2740cf625aaba"
  },
  "layers": [
    {
      "mediaType": "application/vnd.dev.cosign.simplesigning.v1+json",
      "size": 210,
      "digest": "sha256:1119abab63e605dcc281019bad0424744178b6f61ba57378701fe7391994c999",
      "annotations": {
        "dev.cosignproject.cosign/signature": "MEUCIG0ZmgqE3qTrHWp+HF9CrxsNH57Cck3cQI+zNNrUwSHfAiEAm+2eY/Z6ixQwjLbTraDN5ZB/P1Z5k/KwIoblry65r+s="
      }
    },
    {
      "mediaType": "application/vnd.dev.cosign.simplesigning.v1+json",
      "size": 219,
      "digest": "sha256:583246418c2afd5bfe29694793d07da37ffd552aadf8879b1d98047178b80398",
      "annotations": {
        "dev.cosignproject.cosign/signature": "MEUCIF/+szLKKA2q2+c86AXeWR7UeD5yYpW7p0waHordxNjhAiEAm5e+Hm7Jhv9JpSwHpTc6aGLSkL6/Acm/z+b8mhfGXqY="
      }
    }
  ]
}
```

Some registries support deletion too (DockerHub does not):

```shell
$ cosign clean gcr.io/user-vmtest2/demo
```