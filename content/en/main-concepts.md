---
title: 'Main concepts'
description: ''
position: 2
category: 'About sigstore'
features:
  - Cosign (Container signing, verification and storage)
  - Fulcio (Our root CA)
  - Rekor (Our transparency log)
  - OpenID Connect (Our means of authentication)
---

We’ve combined a few technologies that can be used independently or as one single process.

<list :items="features" type="info"></list>


### Cosign

For container signing, verification and storage in an Open Container Initiative (OCI) registry, making signatures invisible infrastructure.

### Fulcio

A free root certification authority, issuing temporary certificates to an authorized identity and publishing them in the Rekor transparency log.

### Rekor

A built in transparency and timestamping service, Rekor records signed metadata to a ledger that can be searched, but can’t be tampered with.

### OpenID Connect

An identity layer that checks if you're who you say you are. It lets clients request and receive information about authenticated sessions and users.
