---
title: "Signing Other Types"
category: "Signing"
position: 127
---

Cosign can sign anything in a registry. Most of our examples show signing a single image, but you could also sign a multi-platform `Index`, or any other type of artifact. This includes Helm Charts, Tekton Pipelines, and anything else currently using OCI registries for distribution. This also means new artifact types can be uploaded to a registry and signed.

## SBOMs (Software Bill Of Materials)

SBOMs can also be stored in an OCI registry, using this [specification](https://github.com/sigstore/cosign/blob/main/specs/SBOM_SPEC.md).

Cosign can attach these using the `cosign attach sbom` command. In the following example, we'll be generating an SBOM for our sample container image by using the [syft](https://github.com/anchore/syft) tool created by Anchore community, then we'll be storing it in an OCI registry, once we store it, then we'll be signing the image tag that includes the SBOM itself, and verifying it.

```shell
$ crane copy alpine:latest gcr.io/$(gcloud config get-value project)/alpine:latest

$ syft packages gcr.io/$(gcloud config get-value project)/alpine:latest -o spdx > latest.spdx

$ cosign attach sbom --sbom latest.spdx gcr.io/$(gcloud config get-value project)/alpine:latest # get the digest from the output
```

Note that, attaching SBOMs this way does not sign them. If you want to sign the SBOM, you can use the following command:

```shell
$ cosign sign --key cosign.key gcr.io/$(gcloud config get-value project)/alpine:sha256-e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a.sbom

$ cosign verify --key cosign.pub gcr.io/$(gcloud config get-value project)/alpine:sha256-e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a.sbom
```

Or you can include the SBOM in an [in-toto](https://in-toto.io) attestation, as illustrated in the following fragment:

```
{
  // Standard attestation fields:
  "_type": "https://in-toto.io/Statement/v0.1",
  "subject": [{ ... }],

  // Predicate:
  "predicateType": "https://spdx.dev/Document",
  "predicate": {
    "SPDXID" : "SPDXRef-DOCUMENT",
    "spdxVersion" : "SPDX-2.2",
    ...
  }
}
```

The following command signs and attaches the attestation to the image:

```shell
$ cosign attest -predicate myattestations -key cosign.key gcr.io/$(gcloud config get-value project)/alpine:latest
```

## Tekton Bundles

[Tekton](https://tekton.dev) Bundles can be uploaded and managed within an OCI registry.
The specification is [here](https://tekton.dev/docs/pipelines/tekton-bundle-contracts/).
This means they can also be signed and verified with `cosign`.

Tekton Bundles can currently be uploaded with the [tkn cli](https://github.com/tektoncd/cli), but we may add this support to
`cosign` in the future.

```shell
$ tkn bundle push us.gcr.io/user-vmtest2/pipeline:latest -f task-output-image.yaml
Creating Tekton Bundle:
        - Added TaskRun:  to image

Pushed Tekton Bundle to us.gcr.io/user-vmtest2/pipeline@sha256:124e1fdee94fe5c5f902bc94da2d6e2fea243934c74e76c2368acdc8d3ac7155
$ cosign sign --key cosign.key us.gcr.io/user-vmtest2/pipeline:latest
Enter password for private key:
tlog entry created with index: 5086
Pushing signature to: us.gcr.io/user-vmtest2/demo:sha256-124e1fdee94fe5c5f902bc94da2d6e2fea243934c74e76c2368acdc8d3ac7155.sig
```

## WASM

Web Assembly Modules can also be stored in an OCI registry, using this [specification](https://github.com/solo-io/wasm/tree/master/spec).

Cosign can upload these using the `cosign upload wasm` command:

```shell
$ cosign upload wasm -f hello.wasm us.gcr.io/user-vmtest2/wasm
$ cosign sign --key cosign.key us.gcr.io/user-vmtest2/wasm
Enter password for private key:
tlog entry created with index: 5198
Pushing signature to: us.gcr.io/user-vmtest2/wasm:sha256-9e7a511fb3130ee4641baf1adc0400bed674d4afc3f1b81bb581c3c8f613f812.sig
```

## OCI artifacts

Push an artifact to a registry using [ORAS](https://oras.land/cli) (in this case, `cosign` itself):

```shell
$ oras push us-central1-docker.pkg.dev/user-vmtest2/test/artifact ./cosign
Uploading f53604826795 cosign
Pushed us-central1-docker.pkg.dev/user-vmtest2/test/artifact
Digest: sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
```

Now sign it using `cosign`:

```shell
$ cosign sign --key cosign.key us-central1-docker.pkg.dev/user-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
Enter password for private key:
Pushing signature to: us-central1-docker.pkg.dev/user-vmtest2/test/artifact:sha256-551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef.sig
```

Finally, verify with `cosign` again:

```shell
$ cosign verify --key cosign.pub  us-central1-docker.pkg.dev/user-vmtest2/test/artifact@sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The claims were present in the transparency log
  - The signatures were integrated into the transparency log when the certificate was valid
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.

{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"sha256:551e6cce7ed2e5c914998f931b277bc879e675b74843e6f29bc17f3b5f692bef"},"Type":"cosign container image signature"},"Optional":null}
```

## Tag signing

Cosign signatures protect the digests of objects stored in a registry.
The optional `annotations` support (via the `-a` flag to `cosign sign`) can be used to add extra
data to the payload that is signed and protected by the signature.
One use-case for this might be to sign a tag->digest mapping.

If you would like to attest that a specific tag (or set of tags) should point at a digest, you can
run something like:

```shell
$ TAG=sign-me
$ DGST=$(crane digest user/demo:$TAG)
$ cosign sign --key cosign.key -a tag=$TAG user/demo@$DGST
Enter password for private key:
Pushing signature to: user/demo:sha256-97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36.sig
```

Then you can verify that the tag->digest mapping is also covered in the signature, using the `-a` flag to `cosign verify`.
This example verifies that the digest `$TAG` points to (`sha256:97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36`)
has been signed, **and also** that the `$TAG`:

```shell
$ cosign verify --key cosign.pub -a tag=$TAG user/demo:$TAG | jq .
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
    "tag": "sign-me"
  }
}
```

Timestamps could also be added here, to implement TUF-style freeze-attack prevention.

## Base image and layer signing

Again, Cosign can sign anything in a registry.
You could use `cosign` to sign an image that is intended to be used as a base image,
and include that provenance metadata in resulting derived images.
This could be used to enforce that an image was built from an authorized base image.

Rough Idea:
* OCI manifests have an ordered list of `layer` `Descriptors`, which can contain annotations.
  See [here](https://github.com/opencontainers/image-spec/blob/master/manifest.md) for the
  specification.
* A base image is an ordered list of layers to which other layers are appended, as well as an
  initial configuration object that is mutated.
  * A derived image is free to completely delete/destroy/recreate the config from its base image,
    so signing the config would provided limited value.
* We can sign the full set of ordered base layers, and attach that signature as an annotation to
  the **last** layer in the resulting child image.

This example manifest represents an image that has been built from a base image with two
layers.
One additional layer is added, forming the final image.

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "size": 7023,
    "digest": "sha256:b5b2b2c507a0944348e0303114d8d93aaaa081732b86451d9bce1f432a537bc7"
  },
  "layers": [
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "size": 32654,
      "digest": "sha256:9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee8f0"
    },
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "size": 16724,
      "digest": "sha256:3c3a4604a545cdc127456d94e421cd355bca5b528f4a9c1905b15da2eb4a4c6b",
      "annotations": {
        "dev.cosign.signature.baseimage": "Ejy6ipGJjUzMDoQFePWixqPBYF0iSnIvpMWps3mlcYNSEcRRZelL7GzimKXaMjxfhy5bshNGvDT5QoUJ0tqUAg=="
      }
    },
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "size": 73109,
      "digest": "sha256:ec4b8955958665577945c89419d1af06b5f7636b4ac3da7f12184802ad867736"
    }
  ],
}
```

Note that this could be applied recursively, for multiple intermediate base images.

## Countersigning

Cosign signatures (and their protected payloads) are stored as artifacts in a registry.
These signature objects can also be signed, resulting in a new, "counter-signature" artifact.
This "counter-signature" protects the signature (or set of signatures) **and** the referenced artifact, which allows
it to act as an attestation to the **signature(s) themselves**.

Before we sign the signature artifact, we first give it a memorable name so we can find it later.

```shell
$ cosign sign --key cosign.key -a sig=original user/demo
Enter password for private key:
Pushing signature to: user/demo:sha256-97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36.sig
$ cosign verify --key cosign.pub user/demo | jq .
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

Now give that signature a memorable name, then sign that:

```shell
$ crane tag $(cosign triangulate user/demo) mysignature
2021/02/15 20:22:55 user/demo:mysignature: digest: sha256:71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e size: 556
$ cosign sign --key cosign.key -a sig=counter user/demo:mysignature
Enter password for private key:
Pushing signature to: user/demo:sha256-71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e.sig
$ cosign verify --key cosign.pub user/demo:mysignature
{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e"},"Type":"cosign container image signature"},"Optional":{"sig":"counter"}}
```

Finally, check the original signature:

```shell
$ crane manifest user/demo@sha256:71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "size": 233,
    "digest": "sha256:3b25a088710d03f39be26629d22eb68cd277a01673b9cb461c4c24fbf8c81c89"
  },
  "layers": [
    {
      "mediaType": "application/vnd.oci.descriptor.v1+json",
      "size": 217,
      "digest": "sha256:0e79a356609f038089088ec46fd95f4649d04de989487220b1a0adbcc63fadae",
      "annotations": {
        "dev.sigstore.cosign/signature": "5uNZKEP9rm8zxAL0VVX7McMmyArzLqtxMTNPjPO2ns+5GJpBeXg+i9ILU+WjmGAKBCqiexTxzLC1/nkOzD4cDA=="
      }
    }
  ]
}
```
