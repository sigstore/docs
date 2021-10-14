---
title: "In-Toto signing"
category: "Cosign"
position: 9
---

#### In-Toto Attestations

Cosign also has built-in support for [in-toto](https://in-toto.io) attestations.
The specification for these is defined [here](https://github.com/in-toto/attestation).

You can create and sign one from a local predicate file using the following commands:

```shell
$ cosign attest --predicate <file> --key cosign.pub <image>
```

All of the standard key management systems are supported.
Payloads are signed using the DSSE signing spec, defined [here](https://github.com/secure-systems-lab/dsse).

To verify:

```shell
$ cosign verify-attestation --key cosign.pub <image>
```
