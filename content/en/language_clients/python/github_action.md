---
type: docs
category: Python
menuTitle: GitHub Action
title: GitHub Action
weight: 50
---

## GitHub Actions

`sigstore-python` has [an official GitHub Action](https://github.com/sigstore/gh-action-sigstore-python)!

You can install it from the [GitHub Marketplace](https://github.com/marketplace/actions/gh-action-sigstore-python), or add it to your CI manually:

```yaml
jobs:
  sigstore-python:
    steps:
      - uses: sigstore/gh-action-sigstore-python@v0.2.0
        with:
          inputs: foo.txt
```

See the [action documentation](https://github.com/sigstore/gh-action-sigstore-python/blob/main/README.md) for more details and usage examples.
