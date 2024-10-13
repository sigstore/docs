---
type: docs
category: Python
menuTitle: Python Client Overview
title: Python Client Overview
weight: 1
---

[`sigstore`](https://pypi.org/project/sigstore/) is a Python tool for generating and verifying Sigstore signatures. You can use it to sign and verify Python package distributions, or anything else!

## Features

* Supports keyless signature generation and verification
* Supports signing with ["ambient" OpenID Connect identities ](../signing#signing-with-ambient-credentials)
* A comprehensive [CLI](#usage) and corresponding [importable Python API](https://sigstore.github.io/sigstore-python)
* An official [GitHub Action](../github_action)

## Usage 

For Python API usage, see our [API documentation](https://sigstore.github.io/sigstore-python/).

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

### SLSA Provenance
This project emits a SLSA provenance on its release! This enables you to verify the integrity of the downloaded artifacts and ensured that the binary's code really comes from this source code.

To do so, please follow the instructions [here](https://github.com/slsa-framework/slsa-github-generator#verification-of-provenance).