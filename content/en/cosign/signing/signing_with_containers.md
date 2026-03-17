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

> NOTE: You will need access to a container registry for Cosign to work with. If you're not sure what container registry to use, you can set up a local one for testing.

[google/go-containerregistry](https://github.com/google/go-containerregistry) allows you to run a container registry locally, and [ko-build/ko](https://github.com/ko-build/ko) lets you build an image:

```shell
google/go-containerregistry$ go run cmd/registry/main.go
serving on port 1338
```

```shell
sigstore/cosign$ ko build cmd/conformance/main.go
Published localhost:1338/demo/main.go-38af7bca496e2316e5b02c5d5bafd5f3@sha256:a5a6744c9d069ac7081ceccc2291995a999f02b027995cd5e8508f35e40e7dd1
$ export IMAGE=localhost:1338/demo/main.go-38af7bca496e2316e5b02c5d5bafd5f3@sha256:a5a6744c9d069ac7081ceccc2291995a999f02b027995cd5e8508f35e40e7dd1
```

## General signing format

The general signing format with the `cosign sign` command is as follows.

```shell
$ cosign sign [--key <key path>|<kms uri>] [-r] <image uri>
```

## Sign with a local key pair

This usage is a common use case that uses traditional key signing from a key pair. 

```shell
$ cosign sign --key cosign.key $IMAGE
```

If you need to generate local keys, you can do so by running `cosign generate-key-pair`. See [Signing with Self-Managed Keys]({{< relref "cosign/key_management/signing_with_self-managed_keys">}}) for more information.

## Sign a container multiple times

Multiple signatures can refer to a single container image.  In this example, the container is signed and then signed again:

```shell
$ cosign sign $IMAGE

$ cosign sign $IMAGE
```

## Attesting an image

If you have metadata you want to include along with the signature, use `cosign attest`:

```shell
$ echo '{"foo": "bar", "baz": "bat"}' > attest.predicate.json
$ cosign attest --type custom --predicate attest.predicate.json $IMAGE
```

They can be verified with the `--policy` flag as part of the `cosign verify-attestation` command.

## Add annotations to a signature

Attesting works with any JSON content. But if you just have a few key value pairs, you can use the `-a` flag to add annotations to a signature:

```shell
$ cosign sign -a foo=bar -a baz=bat $IMAGE
```

Annotations can be verified with the `-a` flag as part of the `cosign verify` command.

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

## Skip uploading signature to container registry

If for some reason you do not want to store the signature in the container registry, you can save the signed material as a Sigstore bundle:

```shell
$ cosign sign --bundle=bundle.sigstore.json --upload=false $IMAGE
```

## Upload signature to a container registry later

If you want to upload that bundle to a container registry later, we recommend you do so with [oras](https://oras.land/):

```shell
$ oras attach --artifact-type=application/vnd.dev.sigstore.bundle.v0.3+json $IMAGE bundle.sigstore.json
```

## Signature location and management

Signatures use the OCI 1.1 referrer specification. You can use `cosign tree` to find attached signatures:

```shell
$ cosign tree $IMAGE
```

Some registries support deletion too (DockerHub does not):

```shell
$ cosign clean $IMAGE
```
