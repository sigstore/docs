---
title: "Rekor"
description: "The Rekor overview"
category: "Rekor"
menuTitle: "Overview"
position: 301
---

<img src="/rekor_overview_v1.jpg" class="light-img" width="1280" height="640" alt=""/>

Rekor aims to provide an immutable, tamper-resistant ledger of metadata generated within a software project’s supply chain.

It enables software maintainers and build systems to record signed metadata to an immutable record. Other parties can then query this metadata, enabling them to make informed decisions on trust and non-repudiation of an object’s lifecycle.

The Rekor project provides a restful API-based server for validation, and a transparency log for storage. A CLI application is available to make and verify entries, query the log for inclusion proof, integrity verification of the log or retrieval of entries (either by a public key or an artifact).

Rekor fulfils the signature transparency role of sigstore’s software signing infrastructure. It can also be run on its own, and it’s designed to be extendable to working with different manifest schemas and PKI tooling.

## Usage and installation

You can download and setup the Rekor Server and Rekor CLI by following the instructions on the [Installation](https://docs.sigstore.dev/rekor/installation/) page.