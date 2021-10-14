---
title: "OCI Artifacts"
category: "Cosign"
position: 12
---

Push an artifact to a registry using [oras](https://github.com/deislabs/oras) (in this case, `cosign` itself!):

```shell
$ oras push us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact ./cosign
Uploading f53604826795 cosign
Pushed us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact
Digest: sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
```

Now sign it! Using `cosign` of course:

```shell
$ cosign sign --key cosign.key us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
Enter password for private key:
Pushing signature to: us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact:sha256-551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef.sig
```

Finally, verify `cosign` with `cosign` again:

```shell
$ cosign verify --key cosign.pub  us-central1-docker.pkg.dev/dlorenc-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The claims were present in the transparency log
  - The signatures were integrated into the transparency log when the certificate was valid
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.

{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef"},"Type":"cosign container image signature"},"Optional":null}
