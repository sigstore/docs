---
title: "Release log"
category: "Cosign"
position: 124
---

## `Cosign` is 1.0!

This means the core feature set of `cosign` is considered ready for production use.
This core set includes:

### Key Management

* fixed, text-based keys generated using `cosign generate-key-pair`
* cloud KMS-based keys generated using `cosign generate-key-pair -kms`
* keys generated on hardware tokens using the PIV interface using `cosign piv-tool`
* Kubernetes-secret based keys generated using `cosign generate-key-pair k8s://namespace/secretName`

### Artifact Types

* OCI and Docker Images
* Other artifacts that can be stored in a container registry, including:
  * Tekton Bundles
  * Helm Charts
  * WASM modules
  * (probably anything else, feel free to add things to this list)
* Text files and other binary blobs, using `cosign sign-blob`

### What ** is not ** production ready?

While parts of `cosign` are stable, we are continuing to experiment and add new features.
The following feature set is not considered stable yet, but we are committed to stabilizing it over time!

#### Anything under the `COSIGN_EXPERIMENTAL` environment variable

* Integration with the `Rekor` transparency log
* Keyless signatures using the `Fulcio` CA
