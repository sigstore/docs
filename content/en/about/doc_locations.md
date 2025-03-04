---
type: docs
category: About Sigstore
menuTitle: Documentation Locations
title: Documentation Locations
weight: 100
---

This document describes where to house new Sigstore documentation based on topic and intended audience.

The location for Sigstore repositories and associated documentation is at [http://github.com/sigstore](http://github.com/sigstore).  Documentation for Sigstore falls under two main categories:

- **Documentation for Sigstore users**: those who want to sign or verify artifacts or create integrations with using tooling.
- **Documentation for Sigstore Developers**: those who are changing the modules (Cosign, Rekor, etc.) of Sigstore, adding support for new languages, or implementing new features for the Sigstore suite of tooling.

Documentation for users is on the website [https://docs.sigstore.dev](https://docs.sigstore.dev) and the website [https://sigstore.dev](https://sigstore.dev). Sigstore.dev contains a marketing-type first look into what Sigstore is and how it works, while docs.sigstore.dev contains instructions on how to use the software.

Documentation for developers is housed within the GitHub repository for each module and contains the information to help developers understand how the software itself works and what to do to add new features and build.

## User Documentation

User documentation is in two github repositories:

- [https://github.com/sigstore/docs](https://github.com/sigstore/docs): This repository contains the information for docs.sigstore.dev
- [https://github.com/sigstore/sigstore-website](https://github.com/sigstore/sigstore-website): This repository contains the information for sigstore.dev

The documentation for both websites are in the Github repository under the **content** folder.

### Sigstore Docs

The documentation stored in docs.sigstore.dev is further broken down into various main topics:

- [**About**](../../about/overview): Overview and general information about the Sigstore product.
- [**Quickstart**](../../quickstart/quickstart-cosign): A step by step guides to basic Sigstore features.
- [**Signing**](../../cosign/signing/overview): Information about how to sign artifacts.
- [**Verifying**](../../cosign/verifying/verify): Information about how to verify a signed artifact.
- [**Key Management**](../../cosign/key_management/overview): If a user decides to implement their own key management system instead of using the preferred Sigstore -managed keys, this section provides information about how to manage keys for use with Sigstore.
- [**Policy Controller**](../../policy-controller/overview): Kubernetes policy controller information.
- [**System Configuration**](../../cosign/system_config/installation): Information on installing and deploying Sigstore.
- [**Certificate Authority**](../../certificate_authority/overview): Information on Fulcio, the Sigstore certificate authority.
- [**Transparency Log**](../../logging/overview): Information about Rekkor, the Sigstore logging software.
- [**Language Clients**](../../language_clients/language_client_overview): Information on Sigstore language clients.

## Developer Documentation

Developer documentation is with the repositories for the software. This documentation describes the internal workings of the various pieces of software that make up Sigstore.  The repositories are broken down as follows:

- [**Helm-charts**](https://github.com/sigstore/helm-charts): Helm charts for the sigstore project.
- [**Policy-controller**](https://github.com/sigstore/policy-controller): The Kubernetes policy controller software.
- [**Cosign**](https://github.com/sigstore/cosign): Signing and verifying software.
- [**Sigstore**](https://github.com/sigstore/sigstore): Common go library shared across Sigstore services and clients.
- [**Sigstore-python**](https://github.com/sigstore/sigstore-python): A code signing tool for Python packages.
- [**Sigstore-java**](https://github.com/sigstore/sigstore-java): A code signing library for Java. Also includes Gradle and Maven plugins for build tool integration.
- [**Sigstore-js**](https://github.com/sigstore/sigstore-js): Code signing for npm packages.
- [**Sigstore-go**](https://github.com/sigstore/sigstore-go): Go library for Sigstore signing and verification.
- [**Sigstore-ruby**](https://github.com/sigstore/sigstore-ruby): Pure-Ruby implementation of Sigstore verification.
- [**Sigstore-rs**](https://github.com/sigstore/sigstore-rs): An experimental Rust crate for Sigstore.
- [**Community**](https://github.com/sigstore/community): A general Sigstore community repository.
- [**Sigstore-website**](https://github.com/sigstore/sigstore-website): The codebase for sigstore.dev.
- [**Cosign-installer**](https://github.com/sigstore/cosign-installer): Cosign Github action.

Each of the above repositories has at least a readme.md file.  Most have a doc or content folder to contain documentation.
