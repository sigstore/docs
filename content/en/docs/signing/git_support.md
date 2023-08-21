---
category: Signing
title: Git Support
weight: 133
---

This page contains detailed instructions on how to configure Cosign to work with hosted Git providers. Right
now Cosign supports GitHub and GitLab, and we are hoping to support more in the future!

On this page, we'll be talking about specifically generating public/private key pairs and storing them directly
on GitHub and GitLab variables. The hidden gem behind this approach is that the key goes directly to GitHub
or GitLab without being copied into your browser or terminal or stored on disk.

## Basic Usage

We defined a URI for each hosted Git provider we support, such as for GitLab a URI is `gitlab://`, and for GitHub,
it is `github://`.

### Key Generation and Management

To generate keys using a Git provider, you can use the `cosign generate-key-pair` command as the last
argument `github://` or `gitlab://`. For example:

```shell
$ cosign generate-key-pair <some provider>://<owner>/<project>
```

One little note here, if you prefer to use GitLab as a provider, you can specify the `ID` of the project instead of
its name and owner, for example:

```shell
cosign generate-key-pair gitlab://<project_id>
```

The public key can be retrieved with:

```shell
$ cosign public-key --key gitlab://<owner>/<project>
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEXc+DQU8Pb7Xo2RWCjFG/f6qbdABN
jnVtSyKZxNzBfNMLLtVxdu8q+AigrGCS2KPmejda9bICTcHQCRUrD5OLGQ==
-----END PUBLIC KEY-----
```

or you can use the `ID` of the project instead:

```shell
$ cosign public-key --key gitlab://<project_id>
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEXc+DQU8Pb7Xo2RWCjFG/f6qbdABN
jnVtSyKZxNzBfNMLLtVxdu8q+AigrGCS2KPmejda9bICTcHQCRUrD5OLGQ==
-----END PUBLIC KEY-----
```

### Signing and Verification

To sign and verify using a key managed by a Git provider, you can pass a provider-specific URI to the `--key` command:

```shell
$ cosign sign --key <some provider>://<owner>/<project> gcr.io/user-vmtest2/demo
Pushing signature to: gcr.io/user-vmtest2/demo:sha256-410a07f17151ffffb513f942a01748dfdb921de915ea6427d61d60b0357c1dcd.cosign

$ cosign verify --key gitlab://<owner>/<project> gcr.io/user-vmtest2/demo

Verification for gcr.io/user-vmtest2/demo --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.

[{"critical":{"identity":{"docker-reference":"gcr.io/user-vmtest2/demo"},"image":{"docker-manifest-digest":"sha256:410a07f17151ffffb513f942a01748dfdb921de915ea6427d61d60b0357c1dcd"},"type":"cosign container image signature"},"optional":null}]
```

You might notice that in the verification part we used `gitlab://` instead of `<some provider>` because initially this
feature is only available to GitLab. GitHub does not support it to fetch the secret variables.

You can also export the public key and verify it against that file:

```shell
$ cosign public-key --key gitlab://<owner>/<project> > gitlab.pub
$ cosign verify --key gitlab.pub gcr.io/user-vmtest2/demo
```