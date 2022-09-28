---
title: "Frequently asked questions"
category: "Help"
menuTitle: "FAQs"
position: 900
---

This FAQ is intended to go as in depth as possible for anyone using sigstore. 

_[Looking for general FAQs?](https://www.sigstore.dev/how-it-works)_

## Why is Rekor centralized?

- Well, why not? There's no need for a distributed source of transparency. There can be multiple points of transparency which only adds more sources of security guarantee, not less. An entity can post to as many Rekors as they want and inform users of where they post. We do encourage folks to use common public instances, but we don't seek to enforce this. We do plan to look to produce a gossip protocol, for those that desire a more decentralised model (if the demand is shown).

## How do I verify downloaded code?

Public blockchains often end up using a centralized entry point for canonicalization and authentication. Consensus algorithms can be susceptible to majority attacks, and transparency logs are more mature and capable for what we aim to build with sigstore.

## Why use a Merkle Tree/Transparency log?

- Rekor's back end is [Trillian](https://github.com/google/trillian)
- Trillian is an open source community under active development
- Trilian is deployed by Google, CloudFlare (nimbus), Let's Encrypt for cerficate transparency, so it already is considered production grade

## Can I get Rekor to work with my X format, framework standard?

- Yes. Using pluggable types you can create your own manifest layout and send it to Rekor. Head over to [pluggable types](/rekor/pluggable-types/)
