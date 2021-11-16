---
title: "WASM signing"
category: "Cosign"
position: 109
---

#### WASM

Web Assembly Modules can also be stored in an OCI registry, using this [specification](https://github.com/solo-io/wasm/tree/master/spec).

Cosign can upload these using the `cosign upload wasm` command:

```shell
$ cosign upload wasm -f hello.wasm us.gcr.io/dlorenc-vmtest2/wasm
$ cosign sign --key cosign.key us.gcr.io/dlorenc-vmtest2/wasm
Enter password for private key:
tlog entry created with index: 5198
Pushing signature to: us.gcr.io/dlorenc-vmtest2/wasm:sha256-9e7a511fb3130ee4641baf1adc0400bed674d4afc3f1b81bb581c3c8f613f812.sig
```
