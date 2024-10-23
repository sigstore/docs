---
type: docs
category: Python
menuTitle: Verifying
title: Verifying
weight: 20
---
### Generic identities

This is the most common verification done with `sigstore`, and therefore
the one you probably want: you can use it to verify that a signature was
produced by a particular identity (like `hamilcar@example.com`), as attested
to by a particular OIDC provider (like `https://github.com/login/oauth`).

<!-- @begin-sigstore-verify-identity-help@ -->
```console
usage: sigstore verify identity [-h] [-v] [--certificate FILE]
                                [--signature FILE] [--bundle FILE] [--offline]
                                --cert-identity IDENTITY --cert-oidc-issuer
                                URL
                                FILE [FILE ...]

optional arguments:
  -h, --help            show this help message and exit
  -v, --verbose         run with additional debug logging; supply multiple
                        times to increase verbosity (default: 0)

Verification inputs:
  --certificate FILE, --cert FILE
                        The PEM-encoded certificate to verify against; not
                        used with multiple inputs (default: None)
  --signature FILE      The signature to verify against; not used with
                        multiple inputs (default: None)
  --bundle FILE         The Sigstore bundle to verify with; not used with
                        multiple inputs (default: None)
  FILE                  The file to verify

Verification options:
  --offline             Perform offline verification; requires a Sigstore
                        bundle (default: False)
  --cert-identity IDENTITY
                        The identity to check for in the certificate's Subject
                        Alternative Name (default: None)
  --cert-oidc-issuer URL
                        The OIDC issuer URL to check for in the certificate's
                        OIDC issuer extension (default: None)
```
<!-- @end-sigstore-verify-identity-help@ -->

### Signatures from GitHub Actions

If your signatures are coming from GitHub Actions (e.g., a workflow
that uses its [ambient credentials](../signing#signing-with-ambient-credentials)),
then you can use the `sigstore verify github` subcommand to verify
claims more precisely than `sigstore verify identity` allows:

<!-- @begin-sigstore-verify-github-help@ -->
```console
usage: sigstore verify github [-h] [-v] [--certificate FILE]
                              [--signature FILE] [--bundle FILE] [--offline]
                              [--cert-identity IDENTITY] [--trigger EVENT]
                              [--sha SHA] [--name NAME] [--repository REPO]
                              [--ref REF]
                              FILE [FILE ...]

optional arguments:
  -h, --help            show this help message and exit
  -v, --verbose         run with additional debug logging; supply multiple
                        times to increase verbosity (default: 0)

Verification inputs:
  --certificate FILE, --cert FILE
                        The PEM-encoded certificate to verify against; not
                        used with multiple inputs (default: None)
  --signature FILE      The signature to verify against; not used with
                        multiple inputs (default: None)
  --bundle FILE         The Sigstore bundle to verify with; not used with
                        multiple inputs (default: None)
  FILE                  The file to verify

Verification options:
  --offline             Perform offline verification; requires a Sigstore
                        bundle (default: False)
  --cert-identity IDENTITY
                        The identity to check for in the certificate's Subject
                        Alternative Name (default: None)
  --trigger EVENT       The GitHub Actions event name that triggered the
                        workflow (default: None)
  --sha SHA             The `git` commit SHA that the workflow run was invoked
                        with (default: None)
  --name NAME           The name of the workflow that was triggered (default:
                        None)
  --repository REPO     The repository slug that the workflow was triggered
                        under (default: None)
  --ref REF             The `git` ref that the workflow was invoked with
                        (default: None)
```
<!-- @end-sigstore-verify-github-help@ -->

## Advanced verification use cases

### Verifying against a signature and certificate

By default, `sigstore verify identity` will attempt to find a `<filename>.sigstore` in the
same directory as the file being verified:

```console
# looks for foo.txt.sigstore
python -m sigstore verify identity foo.txt \
    --cert-identity 'hamilcar@example.com' \
    --cert-oidc-issuer 'https://github.com/login/oauth'
```

Multiple files can be verified at once:

```console
# looks for {foo,bar}.txt.sigstore
python -m sigstore verify identity foo.txt bar.txt \
    --cert-identity 'hamilcar@example.com' \
    --cert-oidc-issuer 'https://github.com/login/oauth'
```

### Verifying signatures from GitHub Actions

`sigstore verify github` can be used to verify claims specific to signatures coming from GitHub
Actions. `sigstore-python` signs releases via GitHub Actions, so the examples below are working
examples of how you can verify a given `sigstore-python` release.

When using `sigstore verify github`, you must pass `--cert-identity` or `--repository`, or both.
Unlike `sigstore verify identity`, `--cert-oidc-issuer` is **not** required (since it's
inferred to be GitHub Actions).

Verifying with `--cert-identity`:

```console
python -m sigstore verify github sigstore-0.10.0-py3-none-any.whl \
    --bundle sigstore-0.10.0-py3-none-any.whl.bundle \
    --cert-identity https://github.com/sigstore/sigstore-python/.github/workflows/release.yml@refs/tags/v0.10.0
```

Verifying with `--repository`:

```console
python -m sigstore verify github sigstore-0.10.0-py3-none-any.whl \
    --bundle sigstore-0.10.0-py3-none-any.whl.bundle \
    --repository sigstore/sigstore-python
```

Additional GitHub Actions specific claims can be verified like so:

```console
python -m sigstore verify github sigstore-0.10.0-py3-none-any.whl \
    --bundle sigstore-0.10.0-py3-none-any.whl.bundle \
    --cert-identity https://github.com/sigstore/sigstore-python/.github/workflows/release.yml@refs/tags/v0.10.0 \
    --trigger release \
    --sha 66581529803929c3ccc45334632ccd90f06e0de4 \
    --name Release \
    --repository sigstore/sigstore-python \
    --ref refs/tags/v0.10.0
```
