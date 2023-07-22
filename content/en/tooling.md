---
title: "Tooling"
description: ""
position: 2
category: "About sigstore"
features:
  - Cosign (signing, verification and storage for containers and other artifacts)
  - Fulcio (root certificate authority)
  - Rekor (transparency log)
  - OpenID Connect (means of authentication)
  - policy-controller (enforcing container orchestration policy)
---

Sigstore combines several different technologies that focus on automatic key management and transparency logs. They can be used independently or as one single process, and together they create a safer chain of custody tracing software back to the source.

<list :items="features" type="info"></list>

### Cosign

Tool for signing/verifying containers (and other artifacts) that ties the rest of Sigstore together, making signatures invisible infrastructure. Includes storage in an Open Container Initiative (OCI) registry. 

### Fulcio

A free root certification authority, issuing temporary certificates to an authorized identity and publishing them in the Rekor transparency log.

### Rekor

A built-in transparency and timestamping service, Rekor records signed metadata to a ledger that can be searched, but can’t be tampered with.

### OpenID Connect

An identity layer that checks if you're who you say you are. It lets clients request and receive information about authenticated sessions and users.

### Policy Controller

An admission controller for Kubernetes for enforcing policy on
containers allowed to run.
