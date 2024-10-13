---
type: docs
category: Python
menuTitle: Installation
title: Installation
weight: 5
---

`sigstore` requires Python 3.8 or newer, and can be installed directly via `pip`:

```console
python -m pip install sigstore
```

Optionally, to install `sigstore` and all its dependencies with [hash-checking mode](https://pip.pypa.io/en/stable/topics/secure-installs/#hash-checking-mode) enabled, run the following:

```console
python -m pip install -r https://raw.githubusercontent.com/sigstore/sigstore-python/main/install/requirements.txt
```

This installs the up-to-date [requirements file](https://github.com/sigstore/sigstore-python/blob/main/install/requirements.txt).
