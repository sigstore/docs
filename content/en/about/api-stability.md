---
type: docs
category: About sigstore
description: API stability levels and deprecation policy
title: API Stability and Deprecation Policy
weight: 60
---

This document covers API stability and the deprecation policy for Sigstore APIs and client libraries.

## What does this cover?

The deprecation policy encompasses:
* The client API for Fulcio
* The client API for Rekor
* Features provided by [cosign](https://github.com/sigstore/cosign)
* The [sigstore/sigstore](https://github.com/sigstore/sigstore) client library
* The [cosign/pkg/oci](https://github.com/sigstore/cosign/tree/main/pkg/oci) client library

## What are the different API stability levels?

There are three levels of stability and support:

* Experimental
    * Features may be shipped with bugs
    * Feature is not yet recommended for production use
* Beta
    * Features will be available for the next few releases
* Generally Available
    * The feature will be available and supported 

## What is the deprecation policy at each level?

**Experimental**: Features can be changed or deprecated without notice

**Beta**: Backwards incompatible changes require at least 2 months notice

**Generally Available**: Deprecating features requires at least 6 months notice

_Note: These guidelines will be followed on a best-effort basis.
Since Sigstore is a security project, maintainers reserve the right to break things faster if necessary to address a security issue._

A list of features and associated levels will be available in each repository under FEATURES.md.
A deprecation table will be available in each repository under DEPRECATIONS.md.
