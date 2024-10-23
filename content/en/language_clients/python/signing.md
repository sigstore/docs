---
type: docs
category: Python
menuTitle: Signing
title: Signing
weight: 10
---

<!-- @begin-sigstore-sign-help@ -->
```console
usage: sigstore sign [-h] [-v] [--identity-token TOKEN] [--oidc-client-id ID]
                     [--oidc-client-secret SECRET]
                     [--oidc-disable-ambient-providers] [--oidc-issuer URL]
                     [--oauth-force-oob] [--no-default-files]
                     [--signature FILE] [--certificate FILE] [--bundle FILE]
                     [--output-directory DIR] [--overwrite]
                     FILE [FILE ...]

positional arguments:
  FILE                  The file to sign

optional arguments:
  -h, --help            show this help message and exit
  -v, --verbose         run with additional debug logging; supply multiple
                        times to increase verbosity (default: 0)

OpenID Connect options:
  --identity-token TOKEN
                        the OIDC identity token to use (default: None)
  --oidc-client-id ID   The custom OpenID Connect client ID to use during
                        OAuth2 (default: sigstore)
  --oidc-client-secret SECRET
                        The custom OpenID Connect client secret to use during
                        OAuth2 (default: None)
  --oidc-disable-ambient-providers
                        Disable ambient OpenID Connect credential detection
                        (e.g. on GitHub Actions) (default: False)
  --oidc-issuer URL     The OpenID Connect issuer to use (conflicts with
                        --staging) (default: https://oauth2.sigstore.dev/auth)
  --oauth-force-oob     Force an out-of-band OAuth flow and do not
                        automatically start the default web browser (default:
                        False)

Output options:
  --no-default-files    Don't emit the default output files
                        ({input}.sigstore.json) (default: False)
  --signature FILE, --output-signature FILE
                        Write a single signature to the given file; does not
                        work with multiple input files (default: None)
  --certificate FILE, --output-certificate FILE
                        Write a single certificate to the given file; does not
                        work with multiple input files (default: None)
  --bundle FILE         Write a single Sigstore bundle to the given file; does
                        not work with multiple input files (default: None)
  --output-directory DIR
                        Write default outputs to the given directory
                        (conflicts with --signature, --certificate, --bundle)
                        (default: None)
  --overwrite           Overwrite preexisting signature and certificate
                        outputs, if present (default: False)
```
<!-- @end-sigstore-sign-help@ -->

## Advanced signing use cases

### Signing with ambient credentials

For environments that support OpenID Connect, natively `sigstore` supports ambient credential
detection. This includes many popular CI platforms and cloud providers. See the full list of
supported environments [here](https://github.com/di/id#supported-environments).

Sign a single file (`foo.txt`) using an ambient OpenID Connect credential,
saving the bundle to `foo.txt.sigstore`:

```console
python -m sigstore sign foo.txt
```

### Signing with an email identity

`sigstore` can use an OAuth2 + OpenID flow to establish an email identity,
allowing you to request signing certificates that attest to control over
that email.

Sign a single file (`foo.txt`) using the OAuth2 flow, saving the
bundle to `foo.txt.sigstore`:

```console
python -m sigstore sign foo.txt
```

By default, `sigstore` attempts to do
[ambient credential detection](#signing-with-ambient-credentials), which may preempt
the OAuth2 flow. To force the OAuth2 flow, you can explicitly disable ambient detection:

```console
python -m sigstore sign --oidc-disable-ambient-providers foo.txt
```

### Signing with an explicit identity token

If you can't use an ambient credential or the OAuth2 flow, you can pass a pre-created
identity token directly into `sigstore sign`:

```console
python -m sigstore sign --identity-token YOUR-LONG-JWT-HERE foo.txt
```

Note that passing a custom identity token does not circumvent Fulcio's requirements,
namely the Fulcio's supported identity providers and the claims expected within the token.
