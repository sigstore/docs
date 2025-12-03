---
type: docs
category: Language Clients
title: Python
weight: 40
---

[`sigstore`](https://pypi.org/project/sigstore/) is a Python tool for generating and verifying Sigstore signatures. You can use it to sign and verify Python package distributions, or anything else!

Full project documentation can be found in the [sigstore-python](https://github.com/sigstore/sigstore-python#sigstore-python) project README and our [API documentation](https://sigstore.github.io/sigstore-python).

## Features

* Support for keyless signature generation and verification with Sigstore
* Support for signing with ["ambient" OpenID Connect identities](https://github.com/sigstore/sigstore-python#signing-with-ambient-credentials)
* A comprehensive [CLI](https://github.com/sigstore/sigstore-python#usage) and corresponding [importable Python API](https://sigstore.github.io/sigstore-python)
* An official [GitHub Action](https://github.com/sigstore/gh-action-sigstore-python). See [Sigstore CI Quickstart]({{< relref "quickstart/quickstart-ci">}}) for more information on using the action in a CI system.


## Installation

### Language client Installation

`sigstore` requires Python 3.9 or newer, and can be installed directly via `pip`:

```console
python -m pip install sigstore
```

Optionally, you can install `sigstore` and all its dependencies with [hash-checking mode](https://pip.pypa.io/en/stable/topics/secure-installs/#hash-checking-mode) enabled. Learn more about it in the [project documentation](https://github.com/sigstore/sigstore-python#installation).

## Example

### Signing example

For this example, we will sign a a file named `foo.txt`. [`sigstore`](https://pypi.org/project/sigstore/) will use OpenID Connect (OIDC) to verify your email address.

Use the following command to sign `foo.txt`:

```console
sigstore sign foo.txt
```

This will produce `foo.txt.sigstore.json` for subsequent verification.

### Verifying example

To verify the signature on `foo.txt` run the following command:

```console
sigstore verify identity foo.txt \
--cert-identity 'my_email@example.com' \
--cert-oidc-issuer 'oidc_issuer_URL'
```

### Additional use cases

Additional use cases can be found in the [sigstore-python](https://github.com/sigstore/sigstore-python#usage) project README.
