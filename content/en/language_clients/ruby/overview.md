---
type: docs
category: Ruby
title: Ruby Client Overview
weight: 5
---
[`sigstore`](https://rubygems.org/gems/sigstore) is a pure-ruby implementation of Sigstore signature verification.

The project repository can be found [here](https://github.com/sigstore/sigstore-ruby#sigstore).

## Features

- Pure Ruby implementation of `sigstore verify` command from the [Cosign](../../cosign/verify) project
- `gem` subcommand
- TUF client implementation

## Installation

`sigstore` requires Ruby version 3.1.0 or greater. 

Add sigstore to your Gemfile:

```console
gem 'sigstore', '~> 0.1.1'
```

Install sigstore:

```console
gem install sigstore
```

## Example

```console
gem sigstore_cosign_verify_bundle --bundle a.txt.sigstore \
    --certificate-identity https://github.com/sigstore-conformance/extremely-dangerous-public-oidc-beacon/.github/workflows/extremely-dangerous-oidc-beacon.yml@refs/heads/main \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com \
    a.txt
```
