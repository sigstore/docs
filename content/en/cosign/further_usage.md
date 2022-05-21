---
title: "Further Usage"
category: "Cosign"
position: 105
---

## Signing Git Commits - Three Ways!

You thought Git signatures were always GPG?

Think again!

### Easy Mode

Sign the commits and store the signatures and public keys somewhere else.

```
$ ./cosign sign-blob --key cosign.key <(git rev-parse HEAD)
Using payload from: /dev/fd/63
Enter password for private key:
MEUCIQDLtTbCRCW+o7Gt3WKR4b2UqT947L8JtYzQJk+R8PItxgIgXoYQg1YXw8xDmGWun6wIG2t+/J0HJs9SbscnSLMNWsM=
$ git rev-parse HEAD
455d1988360dcfdcf0fa17b0736fbbc33b4924c0
$ ./cosign verify-blob --key cosign.pub --signature MEUCIQDLtTbCRCW+o7Gt3WKR4b2UqT947L8JtYzQJk+R8PItxgIgXoYQg1YXw8xDmGWun6wIG2t+/J0HJs9SbscnSLMNWsM= <(git rev-parse HEAD)
Verified OK
```

### Medium Mode

Store the signature in the repo as notes, store the public key somewhere else.

```
$ ./cosign sign-blob --key cosign.key <(git rev-parse HEAD)
Using payload from: /dev/fd/63
Enter password for private key:
MEQCIHXN31pDrZBxs+m/HrcFruavv++oMc+pBZKgl7Hps9jjAiA9QE5uzpFNC5SGpdr4TJuCwh47C24Hwt4yHICae0J1bw==
$ git notes add -m "MEQCIHXN31pDrZBxs+m/HrcFruavv++oMc+pBZKgl7Hps9jjAiA9QE5uzpFNC5SGpdr4TJuCwh47C24Hwt4yHICae0J1bw==" HEAD
$ ./cosign verify-blob --key cosign.pub --signature <(git notes show HEAD) <(git rev-parse HEAD)
Verified OK
```


### Hard Mode

Store the signature in the Transparency Log, and store the public key somewhere else.

```
$ COSIGN_EXPERIMENTAL=1 ./cosign sign-blob --key cosign.key <(git rev-parse HEAD)
Using payload from: /dev/fd/63
Enter password for private key:
MEYCIQDWX6RjU0Z2ynd1CdiAwo/JaC2Z5+vdx8H5spuDNu/r5wIhAPnP+87+knFEwbE8FgeXCrgkjWal3aBsNR3IVaBDT2XU
tlog entry created with index: 1224
```

Now find it from the log:

```
$ uuid=$(rekor-cli search --artifact <(git rev-parse HEAD) | tail -n 1)
$ sig=$(rekor-cli get --uuid=$uuid --format=json | jq -r .Body.RekordObj.signature.content)
$ cosign verify-blob --key cosign.pub --signature <(echo $sig) <(git rev-parse HEAD)
Verified OK
```

### Level 11

Store the signature in the Transparency Log and don't store the keys anywhere.

### Other Types

`cosign` can sign anything in a registry.
These examples show signing a single image, but you could also sign a multi-platform `Index`,
or any other type of artifact.
This includes Helm Charts, Tekton Pipelines, and anything else currently using OCI registries
for distribution.

This also means new artifact types can be uploaded to a registry and signed.
One interesting type to store and sign would be TUF repositories.
I haven't tried yet, but I'm fairly certain TUF could be implemented on top of this.

### Tag Signing

`cosign` signatures protect the digests of objects stored in a registry.
The optional `annotations` support (via the `-a` flag to `cosign sign`) can be used to add extra
data to the payload that is signed and protected by the signature.
One use-case for this might be to sign a tag->digest mapping.

If you would like to attest that a specific tag (or set of tags) should point at a digest, you can
run something like:

```shell
$ TAG=sign-me
$ DGST=$(crane digest dlorenc/demo:$TAG)
$ cosign sign --key cosign.key -a tag=$TAG dlorenc/demo@$DGST
Enter password for private key:
Pushing signature to: dlorenc/demo:sha256-97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36.sig
```

Then you can verify that the tag->digest mapping is also covered in the signature, using the `-a` flag to `cosign verify`.
This example verifies that the digest `$TAG` points to (`sha256:97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36`)
has been signed, **and also** that the `$TAG`:

```shell
$ cosign verify --key cosign.pub -a tag=$TAG dlorenc/demo:$TAG | jq .
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

### Base Image/Layer Signing

Again, `cosign` can sign anything in a registry.
You could use `cosign` to sign an image that is intended to be used as a base image,
and inlcude that provenance metadata in resulting derived images.
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

### Counter-Signing

Cosign signatures (and their protected payloads) are stored as artifacts in a registry.
These signature objects can also be signed, resulting in a new, "counter-signature" artifact.
This "counter-signature" protects the signature (or set of signatures) **and** the referenced artifact, which allows
it to act as an attestation to the **signature(s) themselves**.

Before we sign the signature artifact, we first give it a memorable name so we can find it later.

```shell
$ cosign sign --key cosign.key -a sig=original dlorenc/demo
Enter password for private key:
Pushing signature to: dlorenc/demo:sha256-97fc222cee7991b5b061d4d4afdb5f3428fcb0c9054e1690313786befa1e4e36.sig
$ cosign verify --key cosign.pub dlorenc/demo | jq .
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
$ crane tag $(cosign triangulate dlorenc/demo) mysignature
2021/02/15 20:22:55 dlorenc/demo:mysignature: digest: sha256:71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e size: 556
$ cosign sign --key cosign.key -a sig=counter dlorenc/demo:mysignature
Enter password for private key:
Pushing signature to: dlorenc/demo:sha256-71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e.sig
$ cosign verify --key cosign.pub dlorenc/demo:mysignature
{"Critical":{"Identity":{"docker-reference":""},"Image":{"Docker-manifest-digest":"71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e"},"Type":"cosign container image signature"},"Optional":{"sig":"counter"}}
```

Finally, check the original signature:

```shell
$ crane manifest dlorenc/demo@sha256:71f70e5d29bde87f988740665257c35b1c6f52dafa20fab4ba16b3b1f4c6ba0e
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
