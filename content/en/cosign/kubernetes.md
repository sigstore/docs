---
title: "Kubernetes"
category: "Cosign"
position: 102
---

## Kubernetes Secrets

Cosign can use keys stored in Kubernetes Secrets to sign and verify signatures.
In order to generate a secret, pass a `k8s://[NAMESPACE]/[NAME]` URI specifying the namespace and secret name to `cosign generate-key-pair` as follows.

```
cosign generate-key-pair k8s://default/testsecret
Enter password for private key: ****
Enter again: ****
Successfully created secret testsecret in namespace default
Public key written to cosign.pub
```

After generating the key pair, Cosign will store it in a Kubernetes secret using your current context.
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

When verifying an image signature using `cosign verify`, the key will be automatically decrypted using the password stored in the Kubernetes secret under the `cosign.password` field.
