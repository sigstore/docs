# Sigstore docs

This repo contains the Sigstore documentation, which is hosted at [docs.sigstore.dev](https://docs.sigstore.dev/).

If you are looking for the frontend development of the [Sigstore website](https://www.sigstore.dev/), please visit the [sigstore-wesbite](https://github.com/sigstore/sigstore-website) repo. 

## Contributing

We welcome contributions on the docs site!

### Pull Request Process

1. Please first discuss the change you wish to make via an [issue](https://github.com/sigstore/docs/issues).
2. Fork the `docs` repository to your own GitHub account and clone it locally.
3. Hack on your changes.
4. Write a meaningful commit message (and sign your commit). Review the [commit message guidelines](https://github.com/sigstore/sigstore-website/blob/main/CONTRIBUTORS.md#commit-message-guidelines).
5. Ensure that CI passes, if it fails, fix the failures. If you are making many commits into one PR, please [squash your commits](https://github.com/sigstore/sigstore-website/blob/main/CONTRIBUTORS.md#squash-commits).
6. Every pull request requires a review from the core sigstore-website team before merging.

## Setup

Install dependencies:

```bash
yarn install
```

## Development

```bash
yarn dev
```
**Note:** If the error "digital envelope routines::unsupported" appears and the build fails, correct this by enabling the legacy OpenSSL provider.

On Unix-like, enter the command:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

## Static Generation

This will create the `dist/` directory for publishing to static hosting:

```bash
yarn generate
```

To preview the static generated app, run `yarn start`

For detailed explanation on how things work, checkout [nuxt/content](https://content.nuxtjs.org) and their official [GitHub repo](https://github.com/nuxt/content).
