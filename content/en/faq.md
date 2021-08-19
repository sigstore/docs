---
title: "Frequently Asked Questions"
date: 2020-12-07T17:09:20Z
draft: false
section: single
type: page
---

### Seems like Rekor is centralised?
* Yes, why not? There is no need for a distributed source of transparency. There can be multiple points of transparency which only adds more sources of security guarantee, not less. An entity can post to as many Rekor’s as they want and inform users of where they post. We do encourage folks to use common public instances, but we don't seek to enforce this. We do plan to look to produce a gossip protocol, for those that desire a more decentralised model (if the demand is shown).

### Why not use a blockchain?
* Public blockchains often end up using a centralized entry point for canonicalisation, auth etc
* Consensus alg’s can be susceptible to 51% attack (Crash / Byzantine Fault Tolerant)
* We are far from anti-blockchain, but feel its not the most best fit for Rekors needs at present

### Why use a Merkle Tree / Transparency log?
* Rekors back end is [Trillian](https://github.com/google/trillian)
* Trillian is an Open source community under active development
* Trilian is Deployed by Google, CloudFlare (nimbus), Let's Encrypt for cerficate transparency, so it already is considered production grade.

### Can I get Rekor to work with my X format , framework standard?
* Yes, using pluggable types you can create your own manifest layout and send it to rekor. Head over to [plugable types](/docs/plugable_types/)

