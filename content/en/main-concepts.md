---
title: "Main concepts"
description: ""
position: 2
category: "About sigstore"
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

## How it works

Using Fulcio, sigstore requests a certificate from our root Certificate Authority (CA). This checks you are who you say you are using OpenID Connect, which looks at your email address to prove you’re the author. Fulcio grants a time-stamped certificate, a way to say you’re signed in and that it’s you.

You don’t have to do anything with keys yourself, and sigstore never obtains your private key. The public key that Cosign creates gets bound to your certificate, and the signing details get stored in sigstore’s trust root, the deeper layer of keys and trustees and what we use to check authenticity.

Your certificate then comes back to sigstore, where sigstore exchanges keys, asserts your identity and signs everything off. The signature contains the hash itself, public key, signature content and the time stamp. This all gets uploaded to a Rekor transparency log, so anyone can check that what you’ve put out there went through all the checks needed to be authentic.
