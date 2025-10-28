---
type: docs
category: Signing
title: Signing Containers
weight: 125
---

You can use Cosign to sign containers with ephemeral keys by authenticating with an OIDC (OpenID Connect) protocol supported by Sigstore. Currently, you can authenticate with Google, GitHub, or Microsoft. For more information, read the [Key management overview]({{< relref "cosign/key_management/overview">}}). 

The format for keyless signing of a container is as follows.

```
$ cosign sign $IMAGE
```

> NOTE: You will need access to a container registry for Cosign to work with. [ttl.sh](https://ttl.sh/) offers free, short-lived (ie: hours), anonymous container image hosting if you just want to try these commands out.

To create a test image to sign using [ttl.sh](https://ttl.sh), run the following commands:

```
$ IMAGE_NAME=$(uuidgen)
$ IMAGE=ttl.sh/$IMAGE_NAME:1h
$ cosign copy alpine $IMAGE
```

## General signing format

The general signing format with the `cosign sign` command is as follows.

```shell
$ cosign sign [--key <key path>|<kms uri>] [--payload <path>] [-a key=value] [--upload=true|false] [-f] [-r] <image uri>
```

## Sign with a local key pair

This usage is a common use case that uses traditional key signing from a key pair. 

```shell
$ cosign sign --key cosign.key $IMAGE
```

If you need to generate local keys, you can do so by running `cosign generate-key-pair`. See [Signing with Self-Managed Keys]({{< relref "cosign/key_management/signing_with_self-managed_keys">}}) for more information.

## Sign a container multiple times

Multiple signatures can be "attached" to a single container image.  In this example, the container is signed and then signed again:

```shell
$ cosign sign $IMAGE

$ cosign sign $IMAGE
```

## Add annotations with a signature

The `-a` flag can be used to add annotations to the generated, signed payload.

This flag can be repeated:

```shell
$ cosign sign -a foo=bar $IMAGE
```

These values are included in the signed payload under the `Optional` section.

```json
"Optional":{"baz":"bat","foo":"bar"}
```

They can be verified with the `-a` flag as part of the `cosign verify` command.

## Sign and attach a certificate and certificate chain

You can sign a container and attach an existing certificate and certificate chain to an image. Note that you cannot currently generate a certificate chain but can use an existing chain. 

```shell
$ cosign sign --certificate cosign.crt --certificate-chain chain.crt $IMAGE
```

## Sign with a key pair stored elsewhere

Cosign can use environment variables and KMS (Key Management Service) APIs, in addition to fixed keys.
When referring to a key managed by a KMS provider, `cosign` takes a [go-cloud](https://gocloud.dev) style URI to refer to the specific provider. The URI path syntax is provider specific.

```shell
$ cosign sign --key <some provider>://<some key> $IMAGE
```

Read more about this in our [key management overview]({{< relref "cosign/key_management/overview">}}).

### Key stored in an environment variable

```shell
$ cosign sign --key env://[ENV_VAR] $IMAGE
```

### Key stored in Azure Key Vault

```shell
$ cosign sign --key azurekms://[VAULT_NAME][VAULT_URI]/[KEY] $IMAGE
```

### Key stored in AWS KMS

```shell
$ cosign sign --key awskms://[ENDPOINT]/[ID/ALIAS/ARN] $IMAGE
```

### Key stored in Google Cloud KMS

```shell
$ cosign sign --key gcpkms://projects/[PROJECT]/locations/global/keyRings/[KEYRING]/cryptoKeys/[KEY]/versions/[VERSION] $IMAGE
```

### Key stored in Hashicorp Vault

```shell
$ cosign sign --key hashivault://[KEY] $IMAGE
```

### Key stored in a Kubernetes secret

```shell
$ cosign sign --key k8s://[NAMESPACE]/[KEY] $IMAGE
```

## Sign and upload a generated payload (in another format, from another tool)

The payload must be specified as a path to a file.

```shell
$ cosign sign --payload README.md $IMAGE
Using payload from: README.md
```

You can also sign with another tool.
Cosign uses standard PKIX cryptographic formats, here's a full example with `openssl`:

```shell
# Generate a keypair
$ openssl ecparam -name prime256v1 -genkey -noout -out openssl.key
$ openssl ec -in openssl.key -pubout -out openssl.pub
# Generate the payload to be signed
$ cosign generate $IMAGE > payload.json
# Sign it and convert to base64
$ openssl dgst -sha256 -sign openssl.key -out payload.sig payload.json
$ cat payload.sig | base64 > payloadbase64.sig
# Upload the signature
$ cosign attach signature --payload payload.json --signature payloadbase64.sig $IMAGE

# Verify! Need to pass `--insecure-ignore-tlog` because attaching a signature
# doesn't upload it to the transparency log.
$ cosign verify --key openssl.pub --insecure-ignore-tlog $IMAGE

Verification for us.gcr.io/user/demo --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.
{"critical":{"identity":{"docker-reference":"us.gcr.io/user/demo"},"image":{"docker-manifest-digest":"sha256:124e1fdee94fe5c5f902bc94da2d6e2fea243934c74e76c2368acdc8d3ac7155"},"type":"cosign container image signature"},"optional":null}
```

## Sign but skip upload (to store somewhere else)

The upload is skipped by using the `--upload=false` flag (default true). To capture the output use the `--output-signature FILE` and/or `--output-certificate FILE` flags.

```shell
$ cosign sign --upload=false --output-signature demo.sig --output-certificate demo.crt $IMAGE
```

## Generate the Signature Payload with Cosign (to sign with another tool)

You can also use other tools for signing - not just `cosign`. This section will provide examples of how to sign with tools other than `cosign`.

### GCP KMS with `gcloud`

To sign with `gcloud kms`, first use `cosign generate` to generate the payload and dump it into a JSON file:

```shell
$ cosign generate us-central1-docker.pkg.dev/user/test/taskrun > payload.json
```

Sign the payload with `gcloud kms`:

```shell
$ gcloud kms asymmetric-sign \
      --digest-algorithm=sha256 \
      --input-file=payload.json \
      --signature-file=gcpkms.sig \
      --key=foo \
      --keyring=foo \
      --version=1 \
      --location=us-central
```

Base64 encode the signature into a temporary variable and use it to upload with `cosign`:

```shell
$ BASE64_SIGNATURE=$(cat gcpkms.sig | base64)
$ cosign attach signature --payload payload.json --signature $BASE64_SIGNATURE us-central1-docker.pkg.dev/user/test/taskrun
```

Now (on another machine) use `cosign` to download signature bundle and dump into a JSON file:

```shell
$ cosign download signature us-central1-docker.pkg.dev/user/test/taskrun > signatures.json
```

Extract a payload and signature value and dump into their own respective files:

```shell
$ cat signatures.json | tail -1 | jq -r .Payload | base64 -d > payload
$ cat signatures.json | tail -1 | jq -r .Base64Signature | base64 -d > signature
```

Download (on the same machine as the previous step) the public key:

```shell
$ gcloud kms keys versions get-public-key 1 --key=foo --keyring=foo --location=us-central1 > pubkey.pem
```

Finally, verify the signature with `openssl`:

```shell
$ openssl dgst -sha256 -verify pubkey.pem -signature gcpkms.sig payload
```

### AWS KMS with `aws`

To use a AWS KMS CMK (Custom Master Key) for signing and verification, first create the CMK (just need to do this once) using the `aws` CLI (Version 2):

```shell
$ export AWS_CMK_ID=$(aws kms create-key --customer-master-key-spec RSA_4096 \
                                   --key-usage SIGN_VERIFY \
                                   --description "Cosign Signature Key Pair" \
                                   --query KeyMetadata.KeyId --output text)
```

Use `cosign` to generate the payload:

```shell
$ cosign generate docker.io/davivcgarcia/hello-world:latest > payload.json
```

Sign the payload with the AWS KMS CMK we created above:

```shell
$ aws kms sign --key-id $AWS_CMK_ID \
              --message file://payload.json \
              --message-type RAW \
              --signing-algorithm RSASSA_PKCS1_V1_5_SHA_256 \
              --output text \
              --query Signature > payload.sig
```

Upload the signature with `cosign`:

```shell
$ cosign attach signature docker.io/davivcgarcia/hello-world:latest --signature $(< payload.sig) --payload payload.json
```

Now (on another machine) use cosign to download signature bundle and dump into a JSON file:

```shell
$ cosign download signature docker.io/davivcgarcia/hello-world:latest > signatures.json
```

Extract the payload and signature value and dump into their own respective files:

```shell
$ cat signatures.json | tail -1 | jq -r .Base64Signature | base64 -d > remote_payload.sig
$ cat signatures.json | tail -1 | jq -r .Payload | base64 -d > remote_payload.json
```

Verify with AWS KMS using the CMK key we created in the first step:

```shell
$ aws kms verify --key-id $AWS_CMK_ID \
               --message file://remote_payload.json \
               --message-type RAW \
               --signing-algorithm RSASSA_PKCS1_V1_5_SHA_256 \
               --signature fileb://remote_payload.sig \
               --output text \
               --query SignatureValid
```

## Upload a generated signature

The signature is passed via the `--signature` flag. It can be a file:

```shell
$ cosign attach signature --signature file.sig $IMAGE
```

Or, `-` for `stdin` for chaining from other commands:

```shell
$ cosign generate $IMAGE | openssl... | cosign attach signature --signature - $IMAGE
Pushing signature to: user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def.sig
```

## Signature location and management

Signatures are uploaded to an OCI artifact stored with a predictable name.
This name can be located with the `cosign triangulate` command:

```shell
$ cosign triangulate $IMAGE
index.docker.io/user/demo:sha256-87ef60f558bad79beea6425a3b28989f01dd417164150ab3baab98dcbf04def8.sig
```

They can be reviewed with `crane`:

```shell
$ crane manifest $(cosign triangulate $IMAGE) | jq .
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
$ cosign clean $IMAGE
```
