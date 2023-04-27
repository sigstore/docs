---
title: "Cosign"
menuTitle: "Timestamps"
description: ""
category: "Cosign"
position: 126
---

Signature timestamps are checked in the [rekor](https://github.com/sigstore/rekor) transparency log. Rekor's `IntegratedTime` is signed as part of its `signedEntryTimestamp`. Cosign verifies the signature over the timestamp and checks that the signature was created while the certificate was valid.
