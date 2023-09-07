---
type: docs
category: About Sigstore
menuTitle: Documentation Locations
title: Documentation Locations
weight: 33
---

This document describes where to house new Sigstore documentation based on topic and intended audience.  

The location for Sigstore repositories and associated documentation is at [http://github.com/sigstore](http://github.com/sigstore).  Documentation for Sigstore falls under two main categories:

- **Documentation for Sigstore users**: those who want to sign or verify artifacts or create integrations with using tooling.   
- **Documentation for Sigstore**: those who are changing the modules (Cosign, Rekor, etc.) of Sigstore, adding support for new languages, or implementing new features for the Sigstore suite of tooling. 

Documentation for users is on the website [https://docs.sigstore.dev](https://docs.sigstore.dev) and the website [https://sigstore.dev](https://sigstore.dev). Sigstore.dev contains a marketing-type first look into what Sigstore is and how it works, while docs.sigstore.dev contains instructions on how to use the software.

Documentation for developers is housed within the GitHub repository for each module and contains the information to help developers understand how the software itself works and what to do to add new features and build.

## User Documentation

User documentation is in two github repositories:

- [https://github.com/sigstore/docs](https://github.com/sigstore/docs): This repository contains the information for docs.sigstore.dev
- [https://github.com/sigstore/sigstore-website](https://github.com/sigstore/sigstore-website): This repository contains the information for sigstore.dev


The documentation for both websites are in the Github repository under the **content** folder.

### Sigstore Docs

The documentation stored in docs.sigstore.dev is further broken down into various main topics:

- **About**: Overview and general information about the Sigstore product.
- **Signing**: Information about various ways to sign artifacts.
- **Verifying**: Information about how to verify a signed artifact.
- **Key Management**: If a user decides to implement their own key management system instead of using the preferred Sigstore -managed keys, this section provides information about how to manage keys for use with Sigstore.
- **Policy Controller**: Kubernetes policy controller information.
- **System Configuration**: Information on installing and deploying Sigstore.
- **Certificate Authority**: Information on Fulcio, the Sigstore certificate authority.
- **Transparency Log**: Information about Rekkor, the Sigstore logging software.


## Developer Documentation

Developer documentation is with the repositories for the software. This documentation describes the internal workings of the various pieces of software that make up Sigstore.  The repositories are broken down as follows:

- **Helm-charts**: Helm charts for the sigstore project.
- **Policy-controller**: The Kubernetes policy controller software.
- **Cosign**: Signing and verifying software. 
- **Sigstore**: Common go library shared across Sigstore services and clients.
- **Sigstore-python**: A code signing tool for Python packages.  
- **Sigstore-maven-plugin**: A Maven plugin that can be used to use the “keyless” signing paradigm supported by Sigstore.  In early stages at this time.
- **Community**: A general Sigstore community repository.
- **Sigstore-website**: The codebase for sigstore.dev.
- **Cosign-installer**: Cosign Github action.
- **Sigstore-js**: Code signing for npm packages.

Each of the above repositories has at least a readme.md file.  Most have a doc or content folder to contain documentation.
