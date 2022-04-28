---
title: "Kubernetes"
category: "Cosign"
position: 102
---

## Kubernetes Secrets

Cosign can use keys stored in Kubernetes Secrets to so sign and verify signatures.
In order to generate a secret you have to pass `cosign generate-key-pair` a
`k8s://[NAMESPACE]/[NAME]` URI specifying the namespace and secret name:

```
cosign generate-key-pair k8s://default/testsecret
Enter password for private key: ****
Enter again: ****
Successfully created secret testsecret in namespace default
Public key written to cosign.pub
```

After generating the key pair, cosign will store it in a Kubernetes secret using your current context.
The secret will contain the private and public keys, as well as the password to decrypt the private key.

The secret has the following structure:

```
apiVersion: v1
kind: Secret
metadata:
  name: testsecret
  namespace: default
type: Opaque
data:
  cosign.key: LS0tLS1CRUdJTiBFTkNSWVBURUQgQ09TSUdOIFBSSVZBVEUgS0VZLS0tLS[...]==
  cosign.password: YWJjMTIz
  cosign.pub: LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQo[...]==
```

When verifying an image signature using `cosign verify`, the key will be automatically decrypted using the password stored in the kubernetes secret under the `cosign.password` field.


## Cosigned Admission Controller

The `cosigned` admission controller can be used to enforce policy on a Kubernetes cluster based on verifiable supply-chain metadata from `cosign`.

`cosigned` also resolves the image tags to ensure the image being ran is not different from when it was admitted.

See the [installation instructions](installation#cosigned) for more information.

**This component is still actively under development!**

Today, `cosigned` can automatically validate signatures on container images.
Enforcement is configured on a per-namespace basis, and multiple keys are supported.

We're actively working on more features here, including support for Attestations.

### Enable Cosigned Admission Controller for Namespaces

The `cosigned` admission controller will only validate resources in namespaces
that have chosen to opt-in. This can be done by adding the label
`cosigned.sigstore.dev/include: "true"` to the namespace resource.

```bash
kubectl label namespace my-secure-namespace cosigned.sigstore.dev/include=true
```

### Admission of Images

An image is admitted after it has been validated against all `ClusterImagePolicy` that matched the digest of the image
and that there was at least one valid signature obtained from the authorities provided in each of the matched `ClusterImagePolicy`.

See the [Configuring Image Pattern](#configuring-image-patterns) for more information.

If no policy is matched against the image digest, the [deprecated cosigned validation behavior](#deprecated-cosigned-validation-behavior) will occur.

An example of an allowed admission would be:
1. If the image matched against `policy1` and `policy3`
1. A valid signature was obtained for `policy1` with at least one of the `policy1` authorities
1. A valid signature was obtained for `policy3` with at least one of the `policy3` authorities
1. The image is admitted

An example of a denied admission would be:
1. If the image matched against `policy1` and `policy2`
1. A valid signature was obtained for `policy1` with at least one of the `policy1` authorities
1. No valid signature was obtained for `policy2` with at least one of the `policy2` authorities
1. The image is not admitted

An example of no policy matched:
1. If the image does not match against any policy
1. Fallback to [deprecated cosigned validation behavior](#deprecated-cosigned-validation-behavior)
1. Validation will be attempted against the secret defined under `cosign.secretKeyRef.name` during helm installation.
  1. If a valid signature is obtained, image is admitted
  1. If no valid signature is obtained, image is denied

### Configuring Cosigned ClusterImagePolicy

`cosigned` supports validation against multiple `ClusterImagePolicy` kubernetes resources.

A policy is enforced when an image pattern for the policy is matched against the image being deployed.

#### Configuring Image Patterns

The `ClusterImagePolicy` specifies `spec.images` which specifies a list of `glob` and/or `regex` matching patterns.
These matching patterns will be matched against the image digest of PodSpec resources attempting to be deployed.

**Note:** `glob` currently only supports a single trailing wildcard `*` character.


A sample of a `ClusterImagePolicy` which matches against all images:
```yaml
apiVersion: cosigned.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy
spec:
  images:
  - glob: "*"
  - regex: ".*"
```

#### Configuring `key` Authorities

When a policy is selected to be evaluated against the matched image, the authorities will be used to validate signatures.
If at least one authority is satisfied and a signature is validated, the policy is validated.

**Note:** Currently, only ECDSA public keys are supported.

Authorities can be `key` specifications, for example:

```yaml
spec:
  authorities:
    - key:
        data: |
          -----BEGIN PUBLIC KEY-----
          ...
          -----END PUBLIC KEY-----
    - key:
        secretRef:
          name: secretName
    - key:
        kms: KMSPATH
```

Each `key` authority can contain these properties:
- `key.data`: specifies the plain text string of the public key
- `key.secretRef.name`: specifies the secret location name in the same namespace where `cosigned` is installed. <br/> The first key value will be used in the secret.
- `key.kms`: specifies the location for the public key. Supported formats include:
  - `azurekms://[VAULT_NAME][VAULT_URI]/[KEY]`
  - `awskms://[ENDPOINT]/[ID/ALIAS/ARN]`
  - `gcpkms://projects/[PROJECT]/locations/global/keyRings/[KEYRING]/cryptoKeys/[KEY]`
  - `hashivault://[KEY]`

#### Configuring `keyless` Authorities

When a policy is selected to be evaluated against the matched image, the authorities will be used to validate signatures.
If at least one authority is satisfied and a signature is validated, the policy is validated.


Authorities can be `keyless` specifications. For example:

```yaml
spec:
  authorities:
    - keyless:
        url: https://fulcio.example.com
        ca-cert:
          data: Certificate Data
    - keyless:
        url: https://fulcio.example.com
        ca-cert:
          secretRef:
            name: secretName
    - keyless:
        identities:
          - issuer: https://accounts.google.com
            subject: *@example.com
          - issuer: https://token.actions.githubusercontent.com
            subject: https://github.com/mycompany/*/.github/workflows/*@*

```

Each `keyless` authority can contain these properties:
- `keyless.url`: specifies the Fulcio url
- `keyless.ca-cert`: specifies `ca-cert` information for the `keyless` authority
  - `secretRef.name`: specifies the secret location name in the same namespace where `cosigned` is installed. <br/>The first key value will be used in the secret for the `ca-cert`.
  - `data`: specifies the inline certificate data
- `keyless.identities`: Identity may contain an array of `issuer` and/or the `subject` found in the transparency log. Either field supports a pattern glob.
  - `issuer`: specifies the issuer found in the transparency log. Pattern glob are supported.
  - `subject`: specifies the subject found in the transparency log. Pattern glob are supported.

#### Configuring Remote Signature Location

If signatures are located in a different repository, it can be specified along with the `key` or `keyless` definition.
When no `source` is specified for the key, the expectation is that the signature is colocated with the image.

**Note:** Currently, credentials used for the remote source repository are the ones provided in the PodSpec providing resource under `imagePullSecrets`.
Support for specifying credentials within the `ClusterImagePolicy` key is in development and consideration.

To define a `source`, under the corresponding `authorities` node, `source` can be specified.

A sample of source specification for `key` and `keyless`:

```yaml
spec:
  authorities:
    - key:
        data: |
          -----BEGIN PUBLIC KEY-----
          ...
          -----END PUBLIC KEY-----
      source:
        - oci: registry.example.com/project/signature-location
    - keyless:
        url: https://fulcio.example.com
      source:
        - oci: registry.example.com/project/signature-location
```

#### Configuring Transparency Log

TLog specifies the URL to a transparency log that holds signature and public key information.

When `tlog` key is not specified, the public rekor instance will be used.

```yaml
spec:
  authorities:
    - keyless:
        url: https://fulcio.example.com
      tlog:
        url: https://rekor.example.com
```

### Deprecated Cosigned Validation Behavior

**Note:** This behavior is being deprecated in favor of using `ClusterImagePolicy` resources.

During the admission validation, if no `ClusterImagePolicy` is matched, the deprecated behavior will occur.
Image digests will be validated against the public key secret defined by `cosign.secretKeyRef.name` during installation.

When installing `cosigned` through helm, `cosign.secretKeyRef.name` can be specified.
```bash
helm install cosigned -n cosign-system sigstore/cosigned --devel --set cosign.secretKeyRef.name=mysecret
```

The secret specified should contain the key `cosign.pub` and the public key data content.

Where `cosign.pub` is a file containing the public key, the kubernetes secret can be created with:
```bash
kubectl create secret generic mysecret -n cosign-system --from-file=cosign.pub=./cosign.pub
```

If the public key is able to validate a signature for the image digest, the admission controller will admit the image.
If the public key is not able to validate a signature for the image digest, the admission controller will deny the image.
