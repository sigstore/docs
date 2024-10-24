---
type: docs
category: JavaScript
menuTitle: JavaScript Client Overview
title: JavaScript Client Overview
weight: 1
---

[sigstore-js](https://github.com/sigstore/sigstore-js) is a collection of javascript libraries for interacting with sigstore. 

## Libraries

### Global package

* [`sigstore`](./packages/client) - Client library implementing Sigstore signing/verification workflows.

## Scoped packages
* [`@sigstore/bundle`](./packages/bundle) - TypeScript types and utility functions for working with Sigstore bundles.
* [`@sigstore/cli`](./packages/cli) - Command line interface for signing/verifying artifacts with Sigstore.
* [`@sigstore/sign`](./packages/sign) - Library for generating Sigstore signatures.
* [`@sigstore/tuf`](./packages/tuf) - Library for interacting with the Sigstore TUF repository.
* [`@sigstore/rekor-types`](./packages/rekor-types) - TypeScript types for the Sigstore Rekor REST API.
* [`@sigstore/mock`](./packages/mock) - Mocking library for Sigstore services.
