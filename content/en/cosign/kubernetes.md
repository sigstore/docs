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

See the [installation instructions](installation#cosigned) for more information on usage and configuration.

**This component is still actively under development!**

Today, `cosigned` can automatically validate signatures on container images.
Enforcement is configured on a per-namespace basis, and multiple keys are supported.

We're actively working on more features here, including support for Attestations.
