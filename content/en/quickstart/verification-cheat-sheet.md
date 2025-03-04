---
type: docs
category: Quickstart
description: Verification Cheat Sheet
title: OIDC Verification Cheat Sheet
weight: 20
---

## Identity Verification Cheat Sheet

### Verying identity from OIDC issuers

To verify a signature created with an OIDC issuer, you need to know the following:

* `certificate-identity` : the email address associated with the signer for the given OIDC issuer
* `certificate-oidc-issuer`: the url associated with the OIDC issuer

| Issuer      | `certificate-oidc-issuer`                                              |
| ----------- | ---------------------------------------------------------------------- |
| GitHub      | [https://github.com/login/oauth](https://github.com/login/oauth)       |
| GitLab      | [https://gitlab.com](https://gitlab.com)                               |
| Google      | [https://accounts.google.com](https://accounts.google.com)             |
| Microsoft   | [https://login.microsoftonline.com](https://login.microsoftonline.com) |

If you are unsure of what values to expect, search the project's README, documentation, or website.

#### Verifying a signature created by a workflow

To verify a signature created by a workflow, you still need both the `certificate-identity` and the `certificate-oidc-issuer`, but they look a little different than when the signature is manually generated.

For the case of a signature created with GitHub actions:

| Issuer| `certificate-oidc-issuer`| `certificate-identity`|
| ---- | --- | ----------- |
| GitHub Actions | [https://token.actions.githubusercontent.com](https://token.actions.githubusercontent.com) | https://github.com/USERNAME/REPOSITORY_NAME/.github/workflows/WORKFLOW_NAME@refs/heads/BRANCH_NAME |
