---
type: docs
category: Python
menuTitle: Python Client Overview
title: Python Client Overview
weight: 1
---

[`sigstore`](https://pypi.org/project/sigstore/) is a Python tool for generating and verifying Sigstore signatures. You can use it to sign and verify Python package distributions, or anything else!

## Features

* Support for keyless signature generation and verification with [Sigstore](https://www.sigstore.dev/)
* Support for signing with ["ambient" OpenID Connect identities ](https://github.com/sigstore/sigstore-python#signing-with-ambient-credentials)
* A comprehensive [CLI](https://github.com/sigstore/sigstore-python#usage) and corresponding [importable Python API](https://sigstore.github.io/sigstore-python)

## Usage 

For Python API usage, see our [documentation](https://sigstore.github.io/sigstore-python/).

You can run `sigstore` as a standalone program, or via `python -m`:

```console
sigstore --help
python -m sigstore --help
```

Top-level:

<!-- @begin-sigstore-help@ -->
```
usage: sigstore [-h] [-v] [-V] [--staging | --trust-config FILE] COMMAND ...

a tool for signing and verifying Python package distributions

positional arguments:
  COMMAND              the operation to perform
    sign               sign one or more inputs
    verify             verify one or more inputs
    get-identity-token
                       retrieve and return a Sigstore-compatible OpenID
                       Connect token
    plumbing           developer-only plumbing operations

optional arguments:
  -h, --help           show this help message and exit
  -v, --verbose        run with additional debug logging; supply multiple
                       times to increase verbosity (default: 0)
  -V, --version        show program's version number and exit
  --staging            Use sigstore's staging instances, instead of the
                       default production instances (default: False)
  --trust-config FILE  The client trust configuration to use (default: None)
```
<!-- @end-sigstore-help@ -->

## Licensing

`sigstore` is licensed under the Apache 2.0 License.

## Community

`sigstore-python` is developed as part of the [Sigstore](https://sigstore.dev) project.

We also use a [Slack channel](https://sigstore.slack.com)! Click [here](https://join.slack.com/t/sigstore/shared_invite/zt-mhs55zh0-XmY3bcfWn4XEyMqUUutbUQ) for the invite link.

## Contributing

See [the contributing docs](https://github.com/sigstore/.github/blob/main/CONTRIBUTING.md) for details.

## Code of Conduct

Everyone interacting with this project is expected to follow the [sigstore Code of Conduct](https://github.com/sigstore/.github/blob/main/CODE_OF_CONDUCT.md).

## Security

Should you discover any security issues, please refer to sigstore's [security process](https://github.com/sigstore/.github/blob/main/SECURITY.md).

### SLSA Provenance
This project emits a SLSA provenance on its release! This enables you to verify the integrity of the downloaded artifacts and ensured that the binary's code really comes from this source code.

To do so, please follow the instructions [here](https://github.com/slsa-framework/slsa-github-generator#verification-of-provenance).