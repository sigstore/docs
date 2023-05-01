---
title: "Timestamps"
category: "Cosign"
position: 113
---

> Note: This document is a work in progress.

Signature timestamps are checked in the [Rekor](https://github.com/sigstore/rekor) transparency log. Rekor's `IntegratedTime` is signed as part of its `signedEntryTimestamp`. Cosign verifies the signature against the timestamp and checks that the signature was created while the certificate was valid.
