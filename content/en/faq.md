---
title: "Frequently asked questions"
category: "Help"
menuTitle: "FAQs"
position: 10
---

These FAQs are technical lorem ipsum

_Looking for general FAQs? Visit the website lorem ipsum dolor sit amet_

## Seems like Rekor is centralised?

- Yes, why not? There is no need for a distributed source of transparency. There can be multiple points of transparency which only adds more sources of security guarantee, not less. An entity can post to as many Rekor’s as they want and inform users of where they post. We do encourage folks to use common public instances, but we don't seek to enforce this. We do plan to look to produce a gossip protocol, for those that desire a more decentralised model (if the demand is shown).

## How do I verify downloaded code?

Public blockchains often end up using a centralized entry point for canonicalization and authentication. Consensus algorithms can be susceptible to majority attacks, and transparency logs are more mature and capable for what we aim to build with sigstore.

## Why use a Merkle Tree / Transparency log?

- Rekors back end is [Trillian](https://github.com/google/trillian)
- Trillian is an Open source community under active development
- Trilian is Deployed by Google, CloudFlare (nimbus), Let's Encrypt for cerficate transparency, so it already is considered production grade.

## Can I get Rekor to work with my X format , framework standard?

- Yes, using pluggable types you can create your own manifest layout and send it to rekor. Head over to [plugable types](/docs/plugable_types/)
