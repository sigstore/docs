---
title: "Sample Policies"
category: "Kubernetes Policy Controller"
menuTitle: "Sample Policies"
position: 910
---

Sample policies for use with policy-controller live in the [examples directory](https://github.com/sigstore/policy-controller/tree/main/examples) of the project. 

## Images have a signed SPDX SBOM attestation from a custom key

This sample policy asserts that all images must have a signed SPDX SBOM (spdxjson) attestation using a custom key.

```
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: custom-key-attestation-sbom-spdxjson
spec:
  images:
  - glob: "**"
  authorities:
  - name: custom-key
    key:
      data: |
        -----BEGIN PUBLIC KEY-----
        MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOc6HkISHzVdUbtUsdjYtPuyPYBeg
        4FCemyVurIM4KEORQk4OAu8ZNwxvGSoY3eAabYaFIPPQ8ROAjrbdPwNdJw==
        -----END PUBLIC KEY-----
    attestations:
    - name: must-have-spdxjson
      predicateType: https://spdx.dev/Document
      policy:
        type: cue
        data: |
          predicateType: "https://spdx.dev/Document"
```

To use this policy, set the `POLICY` and `IMAGE` environment variables appropriately, pointing to the sample policy and the image you would like to test. 

```
POLICY="policies/custom-key-attestation-sbom-spdxjson.yaml"
```

Use the tool of your choice to generate an [SPDX](https://spdx.dev/) SBOM.

For example purposes, you can use [`sboms/example.spdx.json`](https://github.com/sigstore/policy-controller/blob/main/examples/sboms/example.spdx.json).

Then attach the SBOM to your image using [`cosign attest`](https://github.com/sigstore/cosign/blob/main/doc/cosign_attest.md) with the flag `--type 'https://spdx.dev/Document'`, and signing it with a private key (for example, one located in a `keys` directory as in `keys/cosign.key`). You can review this in our [examples directory](https://github.com/sigstore/policy-controller/tree/main/examples).

```
export COSIGN_PASSWORD=""

cosign attest --yes --type https://spdx.dev/Document \
  --predicate sboms/example.spdx.json \
  --key keys/cosign.key \
  "${IMAGE}"
```

Review the full YAML file at [policies/custom-key-attestation-sbom-spdxjson.yaml](https://github.com/sigstore/policy-controller/blob/main/examples/policies/custom-key-attestation-sbom-spdxjson.yaml)

## Images have a "keyless" signed SPDX SBOM attestation against the public Fulcio root

This sample policy asserts that all images must have a "keyless" signed SPDX SBOM (spdxjson) attestation against the public Fulcio root.

```
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: keyless-attestation-sbom-spdxjson
spec:
  images:
  - glob: "**"
  authorities:
  - name: keyless
    keyless:
      url: "https://fulcio.sigstore.dev"
    attestations:
    - name: must-have-spdxjson
      predicateType: https://spdx.dev/Document
      policy:
        type: cue
        data: |
          predicateType: "https://spdx.dev/Document"
```

To use this policy, set the `POLICY` and `IMAGE` environment variables, pointing to the sample policy and the image you would like to test. 

```
POLICY="policies/keyless-attestation-sbom-spdxjson.yaml"
```

Use the tool of your choice to generate an [SPDX](https://spdx.dev/) SBOM.

For example purposes, you can use [`sboms/example.spdx.json`](https://github.com/sigstore/policy-controller/blob/main/examples/sboms/example.spdx.json).

Then attach the SBOM to your image using [`cosign attest`](https://github.com/sigstore/cosign/blob/main/doc/cosign_attest.md) along with the flag `--type 'https://spdx.dev/Document'`, signing keylessly against the public Fulcio root:

```
export COSIGN_EXPERIMENTAL=1

cosign attest --yes --type https://spdx.dev/Document \
  --predicate sboms/example.spdx.json \
  "${IMAGE}"
```

Review the full YAML file at [policies/keyless-attestation-sbom-spdxjson.yaml](https://github.com/sigstore/policy-controller/blob/main/examples/policies/keyless-attestation-sbom-spdxjson.yaml)

## Images have been signed by a specific AWS KMS key

This sample policy asserts that images have been signed by a specific AWS KMS key.

```
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-is-signed-by-aws-kms-key
spec:
  images:
  # All images
  - glob: "**"
  authorities:
  - name: aws-kms
    key:
      # NB: the policy controller must have kms.DescribeKey, kms.GetPublicKey
      # and kms.Verify IAM permissions on the relevant key.
      kms: awskms:///arn:aws:kms:<< region >>:<< account id >>:key/<< key id >>
```

Set the `POLICY` and `IMAGE` environment variables, pointing to the sample policy and the image you would like to test. 

```
POLICY="policies/signed-by-aws-kms.yaml"
```

Create an AWS KMS key — or use an existing one — to sign your container images. Note the ARN (key ID or Amazon Resource Name) of the key.

```sh
$ aws kms create-key \
  --description "Container signing key" \
  --key-spec ECC_NIST_P256 \
  --key-usage SIGN_VERIFY
{
    "KeyMetadata": {
        "AWSAccountId": "...."
        "Arn": "arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab",
        ....
    }
}
```

Next, sign your container using the KMS key and Cosign.

```
cosign sign --key "awskms:///<< arn of kms key >>" "${IMAGE}"
```
