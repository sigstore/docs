---
type: docs
category: JavaScript
title: JavaScript Client Overview
weight: 5
---

[sigstore-js](https://github.com/sigstore/sigstore-js) is a collection of [javascript libraries](#additional-packages) for interacting with Sigstore.

The main package,[`sigstore`](https://www.npmjs.com/package/sigstore), is a JavaScript library for generating and verifying Sigstore signatures. One of the intended uses is to sign and verify npm packages but it can be used to sign and verify any file.

Full project documentation can be found in the [sigstore-js](https://github.com/sigstore/sigstore-js#sigstore-js---) project README and in each [package README](https://github.com/sigstore/sigstore-js/tree/main/packages).

## Features

- Support for signing using an OpenID Connect identity
- Support for publishing signatures to a [Rekor](../../logging/overview/) instance
- Support for verifying Sigstore bundles

## Installation

[`sigstore`](https://www.npmjs.com/package/sigstore) requires Node.js version >= 18.17.0.

To install `sigstore` run the following command:

```console
npm install sigstore
```

## Example

 To use `sigstore`, import the following into your project using the following:

 ```console
 const { sign, verify } = require('sigstore');
 ```

 ```console
 import { sign, verify } from 'sigstore';
 ```

### Signing example

 ```console
 const bundle = await sign(Buffer.from('hello world'));
```

 There are a number of optional arguments that can be used with the sign function. Additional information is available in the [project repository](https://github.com/sigstore/sigstore-js/tree/main/packages/client#signpayload-options).

 The sign function will return a JSON-encoded Sigstore bundle which includes the signature and the necessary verification material.

### Verifying example

The following function will verify the previously signed message:

```console
verify(bundle, Buffer.from('hello world'), { certificateIssuer: 'https://token.actions.githubusercontent.com/' });
```

More information on optional arguments can be found in the [project documentation](https://github.com/sigstore/sigstore-js/tree/main/packages/client#verifybundle-payload-options)

## Additional Packages

The [sigstore-js](https://github.com/sigstore/sigstore-js) project includes additional functionality through its scoped packages.

- [`@sigstore/bundle`](https://www.npmjs.com/package/@sigstore/bundle) - TypeScript types and utility functions for working with Sigstore bundles.
- [`@sigstore/cli`](https://www.npmjs.com/package/@sigstore/cli) - Command line interface for signing/verifying artifacts with Sigstore.
- [`@sigstore/sign`](https://www.npmjs.com/package/@sigstore/sign) - Library for generating Sigstore signatures.
- [`@sigstore/tuf`](https://www.npmjs.com/package/@sigstore/tuf) - Library for interacting with the Sigstore TUF repository.
- [`@sigstore/rekor-types`](https://www.npmjs.com/package/@sigstore/rekor-types) - TypeScript types for the Sigstore Rekor REST API.
- [`@sigstore/mock`](https://www.npmjs.com/package/@sigstore/mock) - Mocking library for Sigstore services.
