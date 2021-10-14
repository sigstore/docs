---
title: "Signature Specification"
category: "Cosign"
position: 15
---

`cosign` is inspired by tools like [minisign](https://jedisct1.github.io/minisign/) and
[signify](https://www.openbsd.org/papers/bsdcan-signify.html).

Generated private keys are stored in PEM format.
The keys encrypted under a password using scrypt as a KDF and nacl/secretbox for encryption.

They have a PEM header of `ENCRYPTED COSIGN PRIVATE KEY`:

```
-----BEGIN ENCRYPTED COSIGN PRIVATE KEY-----
...
-----END ENCRYPTED COSIGN PRIVATE KEY-----
```

Public keys are stored on disk in PEM-encoded standard PKIX format with a header of `PUBLIC KEY`.
```
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAELigCnlLNKgOglRTx1D7JhI7eRw99
QolE9Jo4QUxnbMy5nUuBL+UZF9qqfm/Dg1BNeHRThHzWh2ki9vAEgWEDOw==
-----END PUBLIC KEY-----
```

# Storage Specification

`cosign` stores signatures in an OCI registry, and uses a naming convention (tag based
on the sha256 of what we're signing) for locating the signature index.

<p align="center">
  <img src="/images/signatures.dot.svg" />
</p>

`reg.example.com/ubuntu@sha256:703218c0465075f4425e58fac086e09e1de5c340b12976ab9eb8ad26615c3715`
has signatures located at `reg.example.com/ubuntu:sha256-703218c0465075f4425e58fac086e09e1de5c340b12976ab9eb8ad26615c3715.sig`

Roughly (ignoring ports in the hostname): `s/:/-/g` and `s/@/:/g` to find the signature index.

Alternative implementations could use transparency logs, local filesystem, a separate repository
registry, an explicit reference to a signature index, a new registry API, grafeas, etc.

### Signing subjects

`cosign` only works for artifacts stored as "manifests" in the registry today.
The proposed mechanism is flexible enough to support signing arbitrary things.
