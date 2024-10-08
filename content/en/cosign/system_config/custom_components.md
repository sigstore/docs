---
type: docs
category: System configuration
title: Configuring Cosign with Custom Components
weight: 955
---

This page contains instructions on how to configure Cosign to work with alternative components for Rekor, Fulcio, or the CT Log. 

Verifying keyless signatures require verifying signatures from Rekor, material (SCTs) from the CT log, and certificates that chain up to Fulcio. The public keys and root certificates for these components are distributed through [TUF](https://theupdateframework.io/) repositories. By default, Cosign uses a TUF client that has an initial trust in an embedded root and then fetches updated verification material from our public-good-instance TUF repository created on the [root-signing](https://github.com/sigstore/root-signing) GitHub repository. 

There are several options to configure Cosign to verify against custom components:

1. Use [scaffolding](https://github.com/sigstore/scaffolding) to create a custom Sigstore stack. This provides a TUF root distributing verification material for the custom components, and pre-configured Cosign with the trust root.

2. Create a TUF repository yourself, using [go-tuf](https://github.com/theupdateframework/go-tuf) or [python-tuf](https://github.com/theupdateframework/python-tuf)'s repository writers. Instructions for how to configure this root is in this [blog post](https://blog.sigstore.dev/sigstore-bring-your-own-stuf-with-tuf-40febfd2badd). This [script](https://gist.github.com/asraa/947f1a38afd03af57c7b71d893c36af0) can be used to create a TUF repository from the custom Fulcio, Rekor, and CT log verification material.

3. TUF is recommended because it makes it easy to distribute up-to-date key material to clients. However, if you aren't using TUF, you can manually assemble trusted key material into a trusted root file with `cosign trusted-root create ...`. You can then supply that trusted root file to `cosign verify` commands with `--trusted-root`.

4. As a last resort, you may also use the following environment variables to configure custom keys out of band.

| Env Variable      | Description |
| ---------- | ------------------- |
| SIGSTORE_REKOR_PUBLIC_KEY     | This specifies an out of band PEM-encoded public key to use for a custom Rekor.       |
| SIGSTORE_ROOT_FILE   | This specifies an out of band PEM-encoded X.509 certificate for a custom Fulcio root certificate.        |
| SIGSTORE_CT_LOG_PUBLIC_KEY_FILE   | This specifies an out of band PEM-encoded or DER formatted public key for a custom CT log.        |
