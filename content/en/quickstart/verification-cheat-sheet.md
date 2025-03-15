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

* `certificate-identity` : Valid values include email address, DNS names, IP addresses, and URIs
* `certificate-oidc-issuer`: the url associated with the OIDC issuer

| Issuer      | `certificate-oidc-issuer`         |
| ----------- | --------------------------------- |
| GitHub      | https://github.com/login/oauth    |
| GitLab      | https://gitlab.com                |
| Google      | https://accounts.google.com       |
| Microsoft   | https://login.microsoftonline.com |

If you are unsure of what values to expect, search the project's README, documentation, or website.

#### Verifying a signature created by a workflow

To verify a signature created by a workflow, you still need both the `certificate-identity` and the `certificate-oidc-issuer`, but they look a little different than when the signature is manually generated.

For the case of a signature created with GitHub actions:

| Issuer | `certificate-oidc-issuer`| `certificate-identity`|
| ---- | --- | ----------- |
| [Buildkite](https://buildkite.com/resources/blog/securing-your-software-supply-chain-signed-git-commits-with-oidc-and-sigstore/) | https://agent.buildkite.com | https://buildkite.com/ORGANIZATION/APP_ID|
| [Codefresh](https://codefresh.io/blog/securing-containers-oidc/) | https://oidc.codefresh.io | https://g.codefresh.io/ACCOUNT_NAME/PROJECT_NAME/PIPELINE_NAME:ACCOUNT_ID/PIPELINE_IDPIPELINE_ID|
| GitHub Actions | https://token.actions.githubusercontent.com | https://github.com/USERNAME/REPOSITORY_NAME/.github/workflows/WORKFLOW_NAME@refs/heads/BRANCH_NAME |
| [GitLab CI](https://docs.gitlab.com/ci/yaml/signing_examples/) | https://gitlab.com | https://gitlab.com/PROJECT_PATH//CI_CONFIG_PATH@REF_PATH |

