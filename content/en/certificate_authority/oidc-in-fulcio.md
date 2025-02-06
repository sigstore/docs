---
type: docs
category: Certificate authority
menuTitle: Using OIDC Tokens
title: OIDC Usage in Fulcio
weight: 1710
---

## Summary

Fulcio uses OIDC tokens to authenticate requests. Subject-related claims from the OIDC token are extracted and included in issued certificates.

Sigstore runs a federated OIDC identity provider, Dex. Users authenticate to their preferred identity provider and Dex creates an OIDC token with claims from the original OIDC token. Fulcio also supports OIDC tokens from additional configured issuers.

## Supported OIDC token issuers

### Email

Email-based OIDC providers use the user's email as the subject of the certificate.

* Dex (`oauth2.sigstore.dev/auth`)
    * GitHub (Note that this is the email of the user, not the GitHub username)
    * Google
    * Microsoft
* Google (`accounts.google.com`)

### Source repository

#### GitHub

GitHub supports OIDC tokens for its workflows initiated from GitHub Actions. This removes the need for persisting authentication credentials. OIDC tokens include information about the workflow and source repository.

You must include the proper permissions in your workflow to use an OIDC token.

```yaml
permissions:
    id-token: write
```

When verifying a signature generated through a workflow on GitHub, you can expect the following values:

* **certificate-oidc-issuer**: https://token.actions.githubusercontent.com
* **certificate-identity**: https://github.com/USERNAME/REPOSITORY_NAME/.github/workflows/WORKFLOW_NAME@refs/heads/BRANCH_NAME

Sigstore currently offers two different GitHub Actions ([`consign-installer`](https://github.com/marketplace/actions/cosign-installer) and [`gh-action-sigstore-installer`](https://github.com/sigstore/gh-action-sigstore-python)) to help you easily integrate Sigstore into your workflows. You can learn more about them in our [CI Quickstart]({{< relref "quickstart/quickstart-ci">}})

#### GitLab

GitLab supports OIDC tokens for its workflows initiated from GitLab CI/CD pipelines. This removes the need for persisting authentication credentials. OIDC tokens include information about the workflow and source repository.

In GitLab, you can generate the necessary tokens by simply adding the following to your CI/CD job:

```yaml
id_tokens:
    SIGSTORE_ID_TOKEN:
      aud: sigstore
```

See the [GitLab documentation](https://docs.gitlab.com/ee/ci/yaml/signing_examples.html) for full examples on signing through GitLab.

### SPIFFE

SPIFFE-based OIDC providers use a SPIFFE ID as the URI subject alternative name of the certificate, scoped to a domain.

* vcr.pub OCI registry (`allow.pub`)

### Kubernetes

Cloud-based Kubernetes instances can authenticate using OIDC tokens per cluster.

* AWS
* Azure
* Google Cloud

## OIDC token requirements with extracted claims

Certificate background: Identities for a certificate are included in the [subject alternative name (SAN)](https://en.wikipedia.org/wiki/Subject_Alternative_Name) field. Fulcio includes email addresses and URIs in the SAN field.

OIDC token: OIDC tokens are JWTs (JSON web tokens). At a minimum, all tokens must include the following claims:

* Audience (`aud`), set to "sigstore"
* Issuer (`iss`), set to one of the URIs in the Fulcio configuration
* Expiration (`exp`)
* Issued At (`iat`)

For example, `iss` could be `https://oauth2.sigstore.dev/auth` or `https://token.actions.githubusercontent.com`.

```
{
    "aud": "sigstore"
    "iss": "<uri>"
    "exp": "<timestamp>"
    "iat": "<timestamp>"
}
```

If the issuer is in a different claim than `iss`, then you can include `IssuerClaim` in the Fulcio OIDC configuration to specify the JSON path to the issuer.

### Email

In addition to the standard JWT claims, the token must include the following claims:

```
{
    "email_verified": true
    "email": "user@example.com"
}
```

`email` is extracted and included as a SAN email address.

### GitHub

The token must include the following claims:

```
{
    "job_workflow_ref": "octo-org/octo-automation/.github/workflows/oidc.yml@refs/heads/main"
    "sha": "example-sha",
    "event_name": "workflow_dispatch",
    "repository": "octo-org/octo-repo",
    "workflow": "example-workflow",
    "ref": "refs/heads/main",
}
```

`job_workflow_ref` is included as a SAN URI: `https://github.com/{job_workflow_ref}`

All other required claims are extracted and included in custom OID fields, as documented in [OID Information](https://github.com/sigstore/fulcio/blob/main/docs/oid-info.md).

### GitLab

The token must include the following claims:

```json
{
    "namespace_id": "72",
    "namespace_path": "my-group",
    "project_id": "20",
    "project_path": "my-group/my-project",
    "pipeline_id": "574",
    "pipeline_source": "push",
    "job_id": "302",
    "ref": "main",
    "ref_type": "branch",
    "runner_id": 1,
    "runner_environment": "gitlab-hosted",
    "sha": "714a629c0b401fdce83e847fc9589983fc6f46bc",
    "project_visibility": "public",
    "ci_config_ref_uri": "gitlab.com/my-group/my-project//.gitlab-ci.yml@refs/heads/main"
}
```

`ci_config_ref_uri` is included as a SAN URI: `https://{ci_config_ref_uri}`

All other required claims are extracted and included in custom OID fields, as documented in [OID Information](https://github.com/sigstore/fulcio/blob/main/docs/oid-info.md#mapping-oidc-token-claims-to-fulcio-oids).

### SPIFFE

The token must include the following claims:

```
{
    "sub": "spiffe://foo.example.com"
}
```

The configuration must include `SPIFFETrustDomain`, for example `example.com`. Tokens must conform to the following:

* The trust domain of the configuration and hostname of `sub` must match exactly.

`sub` is included as a SAN URI.

### Kubernetes

The token must include the following claims:

```
{
    "kubernetes.io": {
	    "namespace": "default",
	    "pod": {
	        "name": "oidc-test",
	        "uid": "49ad3572-b3dd-43a6-8d77-5858d3660275"
	    },
	    "serviceaccount": {
	        "name": "default",
	        "uid": "f5720c1d-e152-4356-a897-11b07aff165d"
	    }
	}
}
```

These claims are used to form the SAN URI of the certificate: `https://kubernetes.io/namespaces/{claims.kubernetes.namespace}/serviceaccounts/{claims.kubernetes.serviceAccount.name}`

### URI

The token must include the following claims:

```
{
    "sub": "https://example.com/users/1"
}
```

Additionally, the configuration must include `SubjectDomain`, for example `https://example.com`. Tokens must conform to the following:

* The issuer in the configuration must partially match the domain in the configuration. The scheme, top level domain, and second level domain must match. The user who updates the Fulcio configuration must also have control over both the issuer and domain configuration fields (Verified either manually or through an ACME-style challenge).
* The domain of the configuration and hostname of the subject of the token must match exactly.

`sub` is included as a SAN URI.
 
### Username

The token must include the following claims:

```
{
    "sub": "exampleUsername"
}
```

Additionally, the configuration must include `SubjectDomain`, for example `example.com`. Tokens must conform to the following:

* The issuer in the configuration must partially match the domain in the configuration. The top level domain and second level domain must match. The user who updates the Fulcio configuration must also have control over both the issuer and domain configuration fields (Verified either manually or through an ACME-style challenge).

`SubjectDomain` is appended to `sub` to form an email, `sub@SubjectDomain`, and included as a SAN email address.
