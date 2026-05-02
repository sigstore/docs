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

3. TUF is recommended because it makes it easy to distribute up-to-date key material to clients. However, if you aren't using TUF, you can manually assemble trusted key material into a trusted root file with `cosign trusted-root create ...`. You can then supply that trusted root file to `cosign verify` commands with `--trusted-root`. See the [signing configuration and trusted root](#signing-configuration-and-trusted-root) section below for the complete workflow.

4. As a last resort, you may also use the following environment variables to configure custom keys out of band.

| Env Variable      | Description |
| ---------- | ------------------- |
| SIGSTORE_REKOR_PUBLIC_KEY     | This specifies an out of band PEM-encoded public key to use for a custom Rekor.       |
| SIGSTORE_ROOT_FILE   | This specifies an out of band PEM-encoded X.509 certificate for a custom Fulcio root certificate.        |
| SIGSTORE_CT_LOG_PUBLIC_KEY_FILE   | This specifies an out of band PEM-encoded or DER formatted public key for a custom CT log.        |

## Signing configuration and trusted root

For cosign v3, you can provide your self-hosted service endpoints and
trust material as configuration files instead of environment variables
or CLI flags.

### Create a signing configuration

The signing configuration specifies where cosign sends signing requests.

```shell
cosign signing-config create \
    --fulcio="url=https://fulcio.internal:5555,api-version=1,start-time=2024-01-01T00:00:00Z,operator=my-org" \
    --rekor="url=https://rekor.internal:3000,api-version=1,start-time=2024-01-01T00:00:00Z,operator=my-org" \
    --rekor-config="ANY" \
    --oidc-provider="url=https://idp.internal,api-version=1,start-time=2024-01-01T00:00:00Z,operator=my-org" \
    --out signing-config.json
```

Each service flag takes a comma-separated list of key-value pairs.
Required keys: `url`, `api-version`, `start-time`, `operator`.
Optional: `end-time`.

The `--rekor-config` flag is required when `--rekor` is specified.
Values: `ANY`, `ALL`, or `EXACT:<count>`.
The `--tsa-config` flag is required when `--tsa` is specified.

When you specify only your own services, the output contains only those
endpoints. To include the public Sigstore defaults alongside your
services, add `--with-default-services`.

### Create a trusted root

The trusted root provides verification material for your services.

> **Note:** The `trusted-root create` command accepts different keys
> than `signing-config create`. Use `certificate-chain` for Fulcio
> and `public-key` for Rekor and CT log entries.

```shell
cosign trusted-root create \
    --fulcio="url=https://fulcio.internal:5555,certificate-chain=/path/to/fulcio-root.pem,start-time=2024-01-01T00:00:00Z" \
    --rekor="url=https://rekor.internal:3000,public-key=/path/to/rekor-pub.pem,start-time=2024-01-01T00:00:00Z" \
    --ctfe="url=https://ctfe.internal:6962,public-key=/path/to/ctfe-pub.pem,start-time=2024-01-01T00:00:00Z" \
    --out trusted-root.json
```

| Flag | Required keys | Optional keys |
|------|--------------|---------------|
| `--fulcio` | `url`, `certificate-chain` | `start-time`, `end-time` |
| `--rekor` | `url`, `public-key`, `start-time` | `end-time`, `origin` |
| `--ctfe` | `url`, `public-key`, `start-time` | `end-time`, `origin` |
| `--tsa` | `url`, `certificate-chain` | `start-time`, `end-time` |

### Sign with configuration files

```shell
cosign sign-blob \
    --signing-config=signing-config.json \
    --trusted-root=trusted-root.json \
    --oidc-client-id=my-client-id \
    --identity-token=$ID_TOKEN \
    --bundle=artifact.bundle \
    artifact.txt
```

The `--oidc-client-id` must match the client ID configured in your
Fulcio OIDC issuer. This flag is not yet part of the signing
configuration format.

For container images, use `cosign sign` with the same flags.
For attestations, use `cosign attest` or `cosign attest-blob`.

Both configuration files are static. Generate them once and distribute
to signing and verification hosts.

### Verify with a trusted root

```shell
cosign verify-blob \
    --trusted-root=trusted-root.json \
    --bundle=artifact.bundle \
    --certificate-oidc-issuer=https://idp.internal \
    --certificate-identity=https://expected-identity \
    artifact.txt
```

### Use URL flags with cosign v3

To use `--fulcio-url` and `--rekor-url` flags with cosign v3, disable
automatic signing configuration resolution:

```shell
cosign sign-blob \
    --use-signing-config=false \
    --fulcio-url=https://fulcio.internal:5555 \
    --rekor-url=https://rekor.internal:3000 \
    ...
```

The `--use-signing-config` and `--signing-config` flags are mutually
exclusive.
