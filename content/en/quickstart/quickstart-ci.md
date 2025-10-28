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
- The [`cosign-installer` GitHub Action](https://github.com/marketplace/actions/cosign-installer) installs Cosign into your GitHub Action environment, making all features of Cosign available to be used within your CI System.

This quickstart will walk you through the use of the `gh-action-sigstore-python` to [sign](#signing-files-using-your-ci-system) files, which is the quickest way to integrate Sigstore into your CI system. This quickstart also includes a [walkthrough](#using-cosign-within-your-ci-system) of using basic Cosign features in your workflows.

## Using gh-action-sigstore-python to sign files within your CI System

This quickstart will show you how to integrate the `gh-action-sigstore-python` GitHub Action into your workflow to generate Sigstore Signatures. The example workflow will sign the file `to_be_signed.txt` in the project's root directory whenever a push is made to the main branch.

Additional information and optional settings can be found in the [project's README](https://github.com/sigstore/gh-action-sigstore-python?tab=readme-ov-file#gh-action-sigstore-python).

### Signing files using your CI system

To following workflow will sign the file `to_be_signed.txt` in the project's root directory whenever a push is made to the main branch. To try it out, make sure to add the file `to_be_signed.txt` to your project, or substitute the file for one in your project.

```yaml
name: signing_files
# This will trigger the workflow to run when commits are pushed to the main branch. 
# This is easy for testing purposes, but for your final workflow use whatever event or schedule 
# makes sense for your project.
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
        - uses: actions/checkout@v4
        with:
          persist-credentials: false

        # This step uses 'gh-action-sigstore-python' to sign the file designated in the inputs field.
        - uses: sigstore/gh-action-sigstore-python@v3.1.0
          with:
            inputs: to_be_signed.txt
```

When run, this workflow returns the ephemeral certificate used to sign the file, as well as the index for the transparency log entry.

### Verifying your signed files

The `gh-action-sigstore-python` GitHub Action includes an option to verify your generated signature. This is optional but a great way to understand the GitHub Action as you are integrating it into your CI for the first time. To verify the signature you just created, set the `verify` setting to true and include your expected `verify-cert-identity` and `verify-oidc-issuer` settings.

```yaml
- uses: sigstore/gh-action-sigstore-python@v3.1.0
  with:
    inputs: to_be_signed.txt
    verify: true
    verify-cert-identity: https://github.com/USERNAME/REPOSITORY_NAME/.github/workflows/WORKFLOW_NAME@refs/heads/BRANCH_NAME
    verify-oidc-issuer: https://token.actions.githubusercontent.com
```

## Using Cosign within your CI system

If you need functionality beyond simple signing of files and blobs, you can use the [`cosign-installer` GitHub Action](https://github.com/marketplace/actions/cosign-installer) to [integrate Sigstore into your CI system](#installing-cosign-on-your-ci). This quickstart covers:

- How to [sign and verify a container image](#signing-and-verifying-a-container-image) using your CI system
- How to [sign](#signing-a-blob) and [verify](#verifying-a-blob) a blob using `cosign-installer`

### Installing Cosign on your CI

The following workflow will install Cosign into your workflow environment.

```yaml
name: install-cosign-and-use
on:
  # This will trigger the workflow to run when commits are pushed to the main branch.
  # This is easy for testing purposes, but for your final workflow use whatever event 
  # or schedule makes sense for your project.
   push:
    branches: [ main ]

jobs:
  install-cosign-and-use:
    name: Install Cosign
    runs-on: ubuntu-latest
    # 'id-token' needs write permission to retrieve the OIDC token, which is required for authentication.
    permissions:
      id-token: write
    steps:
      - name: Install Cosign
        uses: sigstore/cosign-installer@v4.0.0
      - name: Check install!
        run: cosign version
```

### Signing and verifying a container image

The ability to sign and verify container images is the primary benefit of using the cosign-installer GitHub Action. The following is an example workflow that will build a container image with QEMU and Docker Buildx, push that image to the GitHub Container Registry, sign the image, and then verify it. Replace your username, repository name, workflow name, and branch name where indicated.

```yaml
name: container-signing-and-verifying
on:
  push:
    branches: [ main ]

jobs:
  build-image:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write
      id-token: write # needed for signing the images with GitHub OIDC Token

    name: build-image
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
          persist-credentials: false

      - name: Install Cosign
        uses: sigstore/cosign-installer@v4.0.0

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3.6.0

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3.11.1

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3.6.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - id: docker_meta
        uses: docker/metadata-action@5.8.0
        with:
          images: ghcr.io/USERNAME/REPOSITORY_NAME
          tags: type=sha,format=long

      - name: Build and Push container images
        uses: docker/build-push-action@v6.18.0
        id: build-and-push
        with:
          platforms: linux/amd64,linux/arm/v7,linux/arm64
          push: true
          tags: ${{ steps.docker_meta.outputs.tags }}

      - name: Sign and verify the images with GitHub OIDC Token
        env:
          DIGEST: ${{ steps.build-and-push.outputs.digest }}
          TAGS: ${{ steps.docker_meta.outputs.tags }}
        run: |
          images=""
          for tag in ${TAGS}; do
            images+="${tag}@${DIGEST} "
          done
          cosign sign --yes ${images}
          cosign verify ${images} \
          --certificate-identity=https://github.com/USERNAME/REPOSITORY_NAME/.github/workflows/WORKFLOW_NAME@refs/heads/BRANCH_NAME \
          --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```

### Signing a blob

The cosign-installer GitHub Action can also do simpler tasks, like signing a blob. To sign a blob, add these steps to your workflow:

```yaml
# This step makes sure your project is available in the workflow environment.
- name: Import project
  uses: actions/checkout@v4
# This step signs a blob (a text file in the root directory named to_be_signed.txt). The `--yes` flag agrees to Sigstore's terms of use.
- name: Sign Blob
  run: cosign sign-blob to_be_signed.txt --bundle cosign.bundle --yes
```

### Verifying a blob

To verify the signature that you just created, add the following step to your workflow.

```yaml
- name: Verify blob
  run: >
    cosign verify-blob README.md --bundle cosign.bundle
    --certificate-identity=https://github.com/USERNAME/REPOSITORY_NAME/.github/workflows/WORKFLOW_NAME@refs/heads/BRANCH_NAME
    --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```
