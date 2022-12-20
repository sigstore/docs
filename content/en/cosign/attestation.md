---
title: "In-Toto Attestations"
category: "Cosign"
position: 112
---

Cosign also has built-in support for [in-toto](https://in-toto.io) attestations. The specification for these is
defined [here](https://github.com/in-toto/attestation).

You can create and sign one from a local predicate file using the following commands:

```shell
$ cosign attest --predicate <file> --key cosign.key <image>
```

All of the standard key management systems are supported. Payloads are signed using the DSSE signing spec,
defined [here](https://github.com/secure-systems-lab/dsse).

To verify:

```shell
$ cosign verify-attestation --key cosign.pub <image>
```

## Validate In-Toto Attestations

`cosign` has support of validating In-toto Attestations against `CUE` and `Rego` policies.

Let's start with giving a brief introduction to `CUE` and `Rego` who might not be familiar with these.

* [CUE](https://cuelang.org) is an open-source data validation language and inference engine with its roots in logic
  programming.

* [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/) was inspired by Datalog, and supports structured
  document models such as JSON.

> If you want to learn more about the development of this feature, you can reach out to it from [here](https://github.com/sigstore/cosign/pull/641).

Next, I think the most important question that we need to answer is that why do we need this kind of validation. I'll
quote a sentence for this from the blog post written by [Dan Lorenc](https://twitter.com/lorenc_dan). You can reach out
the blog post from [here](https://dlorenc.medium.com/policy-and-attestations-89650fd6f4fa).

> A more important consideration (and relevant back to our vulnerability discussion) is that systems that verify attestations must be carefully designed to work correctly if an attacker can delete or hide any specific attestation or set of attestations. Signatures can guarantee a file has not been tampered with, but they can’t guarantee the file arrives at all. To be safe, your systems should be designed to fail closed rather than open.]

Quick note here, we'll be validating the predicate portion of the attestation. So, please do not forget to write your
validations against predicate portion of the attestation.

Let's give a try by following the links above:

* Check out the documentation of
  the [verify-attestation](https://github.com/sigstore/cosign/blob/main/doc/cosign_verify-attestation.md) command.

### [Cosign Custom Predicate](/cosign/specifications/#in-toto-attestation-predicate) type and CUE policy

```shell
$ cosign attest --key cosign.key --predicate foo gcr.io/rekor-testing/distroless
Enter password for private key: Using payload from: foo
Pushing attestation to: gcr.io/rekor-testing/distroless:sha256-3ab2f3293a30dde12fc49f10b308dee56f9e25f3c587bc011614339f8fbfe24e.att

$ cosign verify-attestation --key cosign.pub gcr.io/rekor-testing/distroless | jq -r .payload | base64 -D | jq .

Verification for gcr.io/rekor-testing/distroless --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "cosign.sigstore.dev/attestation/v1",
  "subject": [
    {
      "name": "gcr.io/rekor-testing/distroless",
      "digest": {
        "sha256": "3ab2f3293a30dde12fc49f10b308dee56f9e25f3c587bc011614339f8fbfe24e"
      }
    }
  ],
  "predicate": {
    "Data": "foo\n",
    "Timestamp": "2021-10-10T17:10:27Z"
  }
}

$ cat policy.cue
import "time"

before: time.Parse(time.RFC3339, "2021-10-09T17:10:27Z")

// The predicateType field must match this string
predicateType: "cosign.sigstore.dev/attestation/v1"

// The predicate must match the following constraints.
predicate: {
    Timestamp: <before
}

$ cosign verify-attestation --policy policy.cue --key cosign.pub gcr.io/rekor-testing/distroless

will be validating against CUE policies: [policy.cue]
{"Data":"foo\n","Timestamp":"2021-10-10T17:45:20Z"} {
 before:    "2021-10-09T17:10:27Z"
 Data:      "bar"
 Timestamp: >"2021-10-09T17:10:27Z"
}
There are 1 number of errors occurred during the validation:
- Data: conflicting values "foo\n" and "bar"
Error: 1 validation errors occurred
```

### [Cosign Custom Predicate](/cosign/specifications/#in-toto-attestation-predicate) type and Rego policy

```shell
$ cosign attest --key cosign.key -predicate foo gcr.io/rekor-testing/distroless
Enter password for private key: Using payload from: foo
Pushing attestation to: gcr.io/rekor-testing/distroless:sha256-3ab2f3293a30dde12fc49f10b308dee56f9e25f3c587bc011614339f8fbfe24e.att

$ cosign verify-attestation --key cosign.pub gcr.io/rekor-testing/distroless | jq -r .payload | base64 -D | jq .

Verification for gcr.io/rekor-testing/distroless --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - The signatures were verified against the specified public key
  - Any certificates were verified against the Fulcio roots.
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "cosign.sigstore.dev/attestation/v1",
  "subject": [
    {
      "name": "gcr.io/rekor-testing/distroless",
      "digest": {
        "sha256": "3ab2f3293a30dde12fc49f10b308dee56f9e25f3c587bc011614339f8fbfe24e"
      }
    }
  ],
  "predicate": {
    "Data": "foo\n",
    "Timestamp": "2021-10-10T17:10:27Z"
  }
}

$ cat policy.rego
package signature

allow[msg] {
 input.Data != "foo\n"
 msg := sprintf("unexpected data: %v", [input.Data])
}

allow[msg] {
 before = time.parse_rfc3339_ns("2021-11-10T17:10:27Z")
 actual = time.parse_rfc3339_ns(input.Timestamp)
 actual != before
 msg := sprintf("unexpected time: %v", [input.Timestamp])
}

$ cosign verify-attestation --policy policy.rego --key cosign.pub gcr.io/rekor-testing/distroless

will be validating against Rego policies: [policy.rego]
There are 2 number of errors occurred during the validation:
- unexpected time: 2021-10-11T17:16:08Z
- unexpected data: foo
Error: 2 validation errors occurred
```
