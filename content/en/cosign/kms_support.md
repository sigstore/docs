---
title: "KMS Support"
category: "Cosign"
position: 119
---

This page contains detailed instructions on how to configure `cosign` to work with KMS providers.
Right now `cosign` supports Hashicorp Vault, AWS KMS, and GCP KMS, and we are hoping to support more in the future!


## Providers

This section contains the provider-specific documentation.


### AWS

AWS KMS keys can be used in `cosign` for signing and verification.
The URI format for AWS KMS is:

`awskms://$ENDPOINT/$KEYID`

where ENDPOINT and KEYID are replaced with the correct values.

The ENDPOINT value is left blank in most scenarios, but can be set for testing with KMS-compatible servers such as [localstack](https://localstack.cloud/).
If omitting a custom endpoint, it is mandatory to prefix the URI with `awskms:///` (with three slashes).

If a custom endpoint is used, you may disable TLS verification by setting an environment variable: `AWS_TLS_INSECURE_SKIP_VERIFY=1`.

AWS credentials are provided using standard configuration as [described in AWS docs](https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials).

The KEYID value must conform to any [AWS KMS key identifier](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id)
format as described in the linked document (Key ARN, Key ID, Alias ARN, or Alias ID).

Note that key creation is not supported by cosign if using the Key ARN or Key ID formats, so it is recommended to use [Key Aliases](https://docs.aws.amazon.com/kms/latest/developerguide/kms-alias.html)
for most situations.

The following URIs are valid:

- Key ID: `awskms:///1234abcd-12ab-34cd-56ef-1234567890ab`
- Key ID with endpoint: `awskms://localhost:4566/1234abcd-12ab-34cd-56ef-1234567890ab`
- Key ARN: `awskms:///arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`
- Key ARN with endpoint: `awskms://localhost:4566/arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`
- Alias name: `awskms:///alias/ExampleAlias`
- Alias name with endpoint: `awskms://localhost:4566/alias/ExampleAlias`
- Alias ARN: `awskms:///arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias`
- Alias ARN with endpoint: `awskms://localhost:4566/arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias`

### GCP

GCP KMS keys can be used in `cosign` for signing and verification.
The URI format for GCP KMS is:

`gcpkms://projects/$PROJECT/locations/$LOCATION/keyRings/$KEYRING/cryptoKeys/$KEY/versions/$KEY_VERSION`

where PROJECT, LOCATION, KEYRING, KEY and KEY_VERSION are replaced with the correct values.

Cosign automatically uses GCP Application Default Credentials for authentication.
See the GCP [API documentation](https://cloud.google.com/docs/authentication/production) for information on how to authenticate in different environments.

The user must have the following IAM roles:
* Safer KMS Viewer Role
* Cloud KMS CryptoKey Signer/Verifier (`roles/cloudkms.signerVerifier`)

### Azure Key Vault

Azure Key Vault keys can be used in `cosign` for signing and verification.

The URI format for Azure Key Vault is:
`azurekms://[VAULT_NAME][VAULT_URI]/[KEY]`

where VAULT_NAME, VAULT_URI, and KEY are replaced with the correct values.

The following environment variables must be set to let cosign authenticate to Azure Key Vault. (see this [reference](https://devblogs.microsoft.com/azure-sdk/authentication-and-the-azure-sdk/#environment-variables) for more details about Azure SDK Authentication)
- AZURE_TENANT_ID
- AZURE_CLIENT_ID
- AZURE_CLIENT_SECRET

To create a key using `cosign generate-key-pair --kms azurekms://[VAULT_NAME][VAULT_URI]/[KEY]` you will need a user which has permissions to create keys in Key Vault. For example `Key Vault Crypto Officer` role.

To sign images using `cosign sign --key azurekms://[VAULT_NAME][VAULT_URI]/[KEY] [IMAGE]` you will need a user which has permissions to the sign action such as the `Key Vault Crypto User` role.

### Hashicorp Vault

Hashicorp Vault keys can be used in `cosign` for signing and verification.
The URI format for Hashicorp Vault KMS is:

`hashivault://$keyname`

This provider requires that the standard Vault environment variables (VAULT_ADDR, VAULT_TOKEN) are set correctly.
This provider also requires that the `transit` secret engine is enabled.

#### Local Setup

For a local setup, you can run Vault yourself or use the `docker-compose` file from [sigstore/sigstore](https://github.com/sigstore/sigstore/blob/main/test/e2e/docker-compose.yml) as an example.

After running it:

```shell
$ export VAULT_ADDR=http://localhost:8200
$ export VAULT_TOKEN=testtoken
$ vault secrets enable transit
```

If you enabled `transit` secret engine at different path with the use of `-path` flag (i.e., `$ vault secrets enable -path="someotherpath" transit`), you can use `TRANSIT_SECRET_ENGINE_PATH` environment variable to specify this path while generating a key pair like the following:

```shell
$ TRANSIT_SECRET_ENGINE_PATH="someotherpath" cosign generate-key-pair --kms hashivault://testkey
```
