---
title: "Rekor"
description: "The Rekor overview"
category: "Transparency Log"
menuTitle: "Overview"
position: 800
---

![Rekor Overview](/sigstore_rekor-horizontal-color.svg)

Rekor aims to provide an immutable, tamper-resistant ledger of metadata generated within a software project’s supply chain.

It enables software maintainers and build systems to record signed metadata to an immutable record. Other parties can then query this metadata, enabling them to make informed decisions on trust and non-repudiation of an object’s lifecycle.

The Rekor project provides a restful API-based server for validation, and a transparency log for storage. A CLI application is available to make and verify entries, query the log for inclusion proof, integrity verification of the log or retrieval of entries (either by a public key or an artifact).

Rekor fulfils the signature transparency role of sigstore’s software signing infrastructure. It can also be run on its own, and it’s designed to be extendable to working with different manifest schemas and PKI tooling.

## Usage and installation

You can download and setup the Rekor Server and Rekor CLI by following the instructions on the [Installation](/rekor/installation/) page.

A public instance of Rekor can be found at [rekor.sigstore.dev](https://rekor.sigstore.dev). The public instance offers an SLO
of 99.5% availability and is monitored by an oncall team.

## Auditing the Public Instance

Rekor is built on top of a [verifiable data structure](https://transparency.dev/verifiable-data-structures/). Auditors
can monitor the log for consistency, meaning that the log remains append-only and entries are never mutated or removed.
Verifiers can also monitor the log for their identities.
Learn more about transparency logs [here](https://transparency.dev/), and about binary transparency [here](https://binary.transparency.dev/).

There are few options for auditing and monitoring the Rekor log. We've built a monitor that runs on GitHub Actions,
[Rekor monitor](https://github.com/sigstore/rekor-monitor). Follow the instructions to set up a new repository and
use the [provided reusable workflow](https://github.com/sigstore/rekor-monitor/blob/main/.github/workflows/reusable_monitoring.yml)
to audit the log. You can also monitor the log for specified identities, though
this feature is a work in progress and supports a limited set of identities and entry types.

You can also run [omniwitness](https://github.com/google/trillian-examples/tree/master/witness/golang/omniwitness) to
audit the log, built by the team who created Trillian, which provides Rekor's verifiable log.
