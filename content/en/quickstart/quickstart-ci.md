---
type: docs
category: Quickstart
description: Integrate Sigstore into your CI system
title: Sigstore CI Quickstart
weight: 10
---

Join us on our [Slack channel](https://sigstore.slack.com/). (Need an [invite](https://links.sigstore.dev/slack-invite)?)

## Sigstore CI quickstart

Sigstore provides two GitHub Actions that make it easy to integrate signing and verifying into your CI system. 

- The [`gh-action-sigstore-python` GitHub Action](https://github.com/sigstore/gh-action-sigstore-python) provides the easiest way to generate Sigstore signatures within your CI system. It uses the Sigstore Python language client ([`sigstore-python`](https://github.com/sigstore/sigstore-python)), but can be used to generate Sigstore signatures regardless of your project's language. 
- The [`consign-installer` GitHub Action](https://github.com/marketplace/actions/cosign-installer) installs cosign into your GitHub Action environment, making all features of Cosign available to be used within your CI System. 

This quickstart will walk you through the use of the `gh-action-sigstore-python` to [sign](#signing-files-using-your-ci-system) files, which is the quickest way to integrate Sigstore into your CI system. This quickstart also includes a [walkthrough](#using-cosign-within-your-ci-system) of using basic Cosign features in your workflows. 

## Using `gh-action-sigstore-python` to sign files within your CI System

This quickstart will show you how to integrate the `gh-action-sigstore-python` GitHub Action into your workflow to generate Sigstore Signatures. The example workflow will sign the file `to_be_signed.txt` in the project's root directory whenever a push is made to the main branch. 

Additional information and optional settings can be found in the [project's README](https://github.com/sigstore/gh-action-sigstore-python?tab=readme-ov-file#gh-action-sigstore-python).

### Signing files using your CI system

To following workflow will sign the file `to_be_signed.txt` in the project's root directory whenever a push is made to the main branch. To try it out, make sure to add the file `to_be_signed.txt` to your project, or substitute the file for one in your project. 

```
name: signing_files
# This will trigger the workflow to run when commits are pushed to the main branch. This is easy for testing purposes, but for your final workflow use whatever event or schedule makes sense for your project.
on:
    push:
        branches: [ main ]
jobs:
  signing_files:
    runs-on: ubuntu-latest
    # 'id-token' needs write permission to retrieve the OIDC token, which is required for authentication.
    permissions:
      id-token: write
    steps:
        # This step ensures that your project is available in the workflow environment.
        - uses: actions/checkout@v3
        # This step uses 'gh-action-sigstore-python' to sign the file designated in the inputs field. 
        - uses: sigstore/gh-action-sigstore-python@v3.0.0
          with:
            inputs: to_be_signed.txt
```
When run, this workflow returns the ephemeral certificate used to sign the file, as well as the index for the transparency log entry.

### Verifying your signed files

The `gh-action-sigstore-python` GitHub Action includes an option to verify your generated signature. This is optional but a great way to understand the GitHub Action as you are integrating it into your CI for the first time. To verify the signature you just created, set the `verify` setting to true and include your expected `verify-cert-identity` and `verify-oidc-issuer` settings. 

```
        - uses: sigstore/gh-action-sigstore-python@v3.0.0
          with:
            inputs: to_be_signed.txt
            verify: true
            verify-cert-identity: https://github.com/USERNAME/REPOSITORY_NAME/.github/workflows/WORKFLOW_NAME@refs/heads/BRANCH_NAME
            verify-oidc-issuer: https://token.actions.githubusercontent.com
```

## Using Cosign within your CI system

If you need functionality beyond simple signing of files and blobs, you can use the [`consign-installer` GitHub Action](https://github.com/marketplace/actions/cosign-installer) to integrate Sigstore into your CI system. 

### Installing Cosign on your CI

The following workflow will install Cosign into your workflow environment. 

```
name: install-and-check-cosign
on:
  # This will trigger the workflow to run when commits are pushed to the main branch. This is easy for testing purposes, but for your final workflow use whatever event or schedule makes sense for your project.
   push:
    branches: [ main ]
# No special permissions are required to install cosign, but depending on what you want to do with it, you may need to add permissions.
permissions: read-all

jobs:
  install-and-check-cosign:
    name: Install Cosign
    runs-on: ubuntu-latest
    steps:
      - name: Install Cosign
        uses: sigstore/cosign-installer@v3.7.0
      - name: Check install!
        run: cosign version
```

### Signing a Blob

Now that we've installed Cosign and checked the installation, let's use Cosign to sign a blob. Add these steps to your workflow:

```
      - name: Import project
        uses: actions/checkout@v3
      - name: Sign Blob
        run: cosign sign-blob README.md --bundle cosign.bundle --yes
```

### Verifying a Blob
### Signing a container
### Verifying a container




