---
title: "Working with blobs"
category: "Cosign"
position: 106
---

### Blobs

You can publish an artifact with `cosign upload blob`:

```shell
$ echo "my first artifact" > artifact
$ cosign upload blob -f artifact gcr.io/dlorenc-vmtest2/artifact
Uploading file from [artifact] to [gcr.io/dlorenc-vmtest2/artifact:latest] with media type [text/plain; charset=utf-8]
File is available directly at [us.gcr.io/v2/dlorenc-vmtest2/readme/blobs/sha256:b57400c0ad852a7c2f6f7da4a1f94547692c61f3e921a49ba3a41805ae8e1e99]
us.gcr.io/dlorenc-vmtest2/readme@sha256:4aa3054270f7a70b4528f2064ee90961788e1e1518703592ae4463de3b889dec
```

Your users can download it from the "direct" url with standard tools like curl or wget:

```shell
$ curl -L gcr.io/v2/dlorenc-vmtest2/artifact/blobs/sha256:97f16c28f6478f3c02d7fff4c7f3c2a30041b72eb6852ca85b919fd85534ed4b > artifact
```

The digest is baked right into the URL, so they can check that as well:

```shell
curl -L gcr.io/v2/dlorenc-vmtest2/artifact/blobs/sha256:97f16c28f6478f3c02d7fff4c7f3c2a30041b72eb6852ca85b919fd85534ed4b | shasum -a 256
97f16c28f6478f3c02d7fff4c7f3c2a30041b72eb6852ca85b919fd85534ed4b  -
```

You can sign it with the normal `cosign sign` command and flags:

```shell
cosign sign --key cosign.key gcr.io/dlorenc-vmtest2/artifact
Enter password for private key:
Pushing signature to: gcr.io/dlorenc-vmtest2/artifact:sha256-3f612a4520b2c245d620d0cca029f1173f6bea76819dde8543f5b799ea3c696c.sig
```
#### sget

We also include the `sget` command for safer, automatic verification of signatures and integration with our binary transparency log, Rekor.

To install `sget`, if you have Go 1.16+, you can directly run:

    $ go install github.com/sigstore/cosign/cmd/sget@latest

and the resulting binary will be placed at `$GOPATH/bin/sget` (or `$GOBIN/sget`, if set).

Just like `curl`, `sget` can be used to fetch artifacts by digest using the OCI URL.
Digest verification is automatic:

```shell
$ sget us.gcr.io/dlorenc-vmtest2/readme@sha256:4aa3054270f7a70b4528f2064ee90961788e1e1518703592ae4463de3b889dec > artifact
```

You can also use `sget` to fetch contents by tag.
Fetching contents without verifying them is dangerous, so we require the artifact be signed in this case:

```shell
$ sget gcr.io/dlorenc-vmtest2/artifact
error: public key must be specified when fetching by tag, you must fetch by digest or supply a public key

$ sget --key cosign.pub us.gcr.io/dlorenc-vmtest2/readme > foo

Verification for us.gcr.io/dlorenc-vmtest2/readme --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.
```

The signature, claims and transparency log proofs are all verified automatically by sget as part of the download.

`curl | bash` isn't a great idea, but `sget | bash` is less-bad.
