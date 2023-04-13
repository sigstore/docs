---
title: "Policy Controller"
category: "Policy Controller"
menuTitle: "Overview"
position: 140
---

# Admission Controller

The `policy-controller` admission controller can be used to enforce policy on a Kubernetes cluster based on verifiable supply-chain metadata from `cosign`.

`policy-controller` also resolves the image tags to ensure the image being ran is not different from when it was admitted.
The validation results are stored in a resource annotation with key `policy.sigstore.dev/policy-controller-results`.

See the [installation instructions](/policy-controller/installation/) for more information.

**This component is still actively under development!**

Today, `policy-controller` can automatically validate signatures and
attestations on container images as well as apply policies (using cue or rego )
against attestations. Enforcement is configured on a per-namespace basis, and
multiple policies are supported.

We're actively working on more features here.

## Configure policy-controller admission controller for namespaces

The `policy-controller` admission controller will by default only validate
resources in namespaces that have chosen to opt-in. This can be done by adding
the label `policy.sigstore.dev/include: "true"` to the namespace resource.

```shell
kubectl label namespace my-secure-namespace policy.sigstore.dev/include=true
```

You can however customize this behaviour to be opt-out by changing the
`matchExpressions` in the
[ValidatingWebhookConfiguration](https://github.com/sigstore/policy-controller/blob/main/config/500-webhook-configuration.yaml#L23-L26) and
[MutatingWebhookConfiguration](https://github.com/sigstore/policy-controller/blob/main/config/500-webhook-configuration.yaml#L44-L47)

For example changing both of them to this:
```
    - key: policy.sigstore.dev/exclude
      operator: DoesNotExist
```

would mean that any namespace that does not have a label
`policy.sigstore.dev/exclude` would be enforced. After making the change as
above, you can then exclude namespaces like this:

```shell
kubectl label namespace my-excluded-namespace policy.sigstore.dev/exclude=true
```

*Note* If you change the behaviour to opt-out, it might cause some grief in
system namespaces, so be mindful. Also, consider looking at changing the default
behaviour of when an image is not matched below and while rolling things out,
consider changing the `no-match-policy` to `warn`.

## Admission of images

An image is admitted after it has been validated against all `ClusterImagePolicy` that matched the digest of the image
and that there was at least one passing `authority` in each of the matched `ClusterImagePolicy`.
So each `ClusterImagePolicy` that matches is `AND` for admission, and within each `ClusterImagePolicy` authorities
are `OR`.

Review [Configuring Image Pattern](#configuring-image-patterns) for more information.

An example of an allowed admission would be:
1. If the image matched against `policy1` and `policy3`
1. A valid signature or attestation was obtained for `policy1` with at least one of the `policy1` authorities
1. A valid signature or attestation was obtained for `policy3` with at least one of the `policy3` authorities
1. The image is admitted

An example of a denied admission would be:
1. If the image matched against `policy1` and `policy2`
1. A valid signature or attestation was obtained for `policy1` with at least one of the `policy1` authorities
1. No valid signature or attestation was obtained for `policy2` with at least one of the `policy2` authorities
1. The image is not admitted

In addition to that, the policy controller offers a configurable behavior defining whether to allow, deny or warn whenever an image does not match a policy. This behavior can be configured using the `config-policy-controller` ConfigMap created under the release namespace (by default `cosign-system`), and by adding an entry with the property `no-match-policy` and its value `warn|allow|deny`.
By default, any image that does not match a policy is rejected whenever `no-match-policy` is not configured in the ConfigMap.

## Configuring policy-controller `ClusterImagePolicy`

`policy-controller` supports validation against multiple `ClusterImagePolicy` Kubernetes resources.

A policy is enforced when an image pattern for the policy is matched against the image being deployed.

Detailed field descriptions for the [ClusterImagePolicy CRD](https://github.com/sigstore/policy-controller/blob/main/docs/api-types/index-v1alpha1.md#clusterimagepolicy).

### Configuring image patterns

The `ClusterImagePolicy` specifies `spec.images` which specifies a list of `glob` matching patterns.
These matching patterns will be matched against the image digest of PodSpec resources attempting to be deployed.
Note that we use Duck typing here, so when we say PodSpec, we enforce these against
higher level resources that result in pods, for example, Deployment, StatefulSet, etc. by default.
You can configure these with `MatchResource` (see more below). Reason for this
default is that if we only enforce at the Pod level, the user may be confused
when their `Deployment` is accepted, yet later on the `Pod`s are unable to start
due to policies blocking them.

Glob uses golang [filepath](https://pkg.go.dev/path/filepath#Match) semantics for
matching the images against. Additionally you can specify a more traditional
`**` to match any number of characters. Furthermore to make it easier to specify
 images, there are few defaults when an image is matched, namely:
 * If there is no host in the glob pattern `index.docker.io` is used for the host. This allows users to specify commonly found images from Docker simply as `myproject/nginx` instead of `index.docker.io/myproject/nginx`
 * If the image is specified without multiple path elements (so not separated by `/`), then `library` is defaulted. For example specifying `busybox` will result in library/busybox. And combined with above, will result in match being made against `index.docker.io/library/busybox`.

A sample of a `ClusterImagePolicy` which matches against all images using glob:

```yaml
apiVersion: policy.sigstore.dev/v1beta1
kind: ClusterImagePolicy
metadata:
  name: image-policy
spec:
  images:
  - glob: "**"
```

### Authorities

When a policy is selected to be evaluated against the matched image, the
authorities will be used to validate signatures and attestations.
If at least one authority is satisfied and a signature or attestation is
validated, the policy is validated.

### Configuring `key` authorities

Authorities can be `key` specifications, for example:

```yaml
spec:
  authorities:
    - key:
        hashAlgorithm: sha256
        data: |
          -----BEGIN PUBLIC KEY-----
          ...
          -----END PUBLIC KEY-----
    - key:
        secretRef:
          name: secretName
    - key:
        kms: KMSPATH
```

Each `key` authority can contain these properties:
- `key.data`: specifies the plain text string of the public key
- `key.hashAlgorithm` (optional): specifies the signature digest for the key, e.g. `sha512`, `sha256`, `sha384` or `sha224`. If no value is provided the hash algorithm is set by default to `sha256`.
- `key.secretRef.name`: specifies the secret location name in the same namespace where `policy-controller` is installed. <br/> The first key value will be used in the secret.
- `key.kms`: specifies the location for the public key. Supported formats include:
  - `azurekms://[VAULT_NAME][VAULT_URI]/[KEY]`
  - `awskms://[ENDPOINT]/{ARN}` where `ARN` can be either key ARN or alias ARN.
  - `gcpkms://projects/[PROJECT]/locations/global/keyRings/[KEYRING]/cryptoKeys/[KEY]`
  - `hashivault://[KEY]`

### Configuring `keyless` authorities

Authorities can be `keyless` specifications. For example:

```yaml
spec:
  authorities:
    - keyless:
        url: https://fulcio.example.com
        ca-cert:
          data: Certificate Data
    - keyless:
        url: https://fulcio.example.com
        ca-cert:
          secretRef:
            name: secretName
    - keyless:
        identities:
          - issuer: https://accounts.google.com
            subject: foo@example.com
          - issuer: https://token.actions.githubusercontent.com
            subjectRegExp: https://github.com/mycompany/*/.github/workflows/*@*

```

Each `keyless` authority can contain these properties:
- `keyless.url`: specifies the Fulcio url
- `keyless.ca-cert`: specifies `ca-cert` information for the `keyless` authority
  - `secretRef.name`: specifies the secret location name in the same namespace where `policy-controller` is installed. <br/>The first key value will be used in the secret for the `ca-cert`.
  - `data`: specifies the inline certificate data
- `keyless.identities`: Identities must contain an array of `issuer` and the `subject` matching the certificate used to sign. There are
variant fields `issuerRegExp` and `subjectRegExp` which support
regular expressions.
  - `issuer`: specifies the issuer certificate was issued by. Regex patterns are supported through the `issuerRegExp` key.
  - `subject`: specifies the subject certificate was issued to. Regex patterns are supported through the `subjectRegExp` key.

### Configuring `static` authorities

Authorities can be `static` specifications. These are used for example when
there are images that may not have any signatures or attestations (sidecar is
one example of these). For these you can configure a `static` authority and you
can define an action to take. Currently we support `pass` and `fail`, and when
a `static` authority is evaluated, no signatures or attestations are checked,
but instead the `action` specified defines whether the policy is validated or
rejected.

You can also use a generic catch-all CIP that matches all images. For example, if
you want to allow all unsigned images through, but have certain images that must
have signatures/attestations, you can then for those images create other CIP
that is more restrictive, and since the CIP are all anded together they will
then be required to meet all the CIP requirements.

A sample authority that allows all images from a particular registry could be
defined like so:

```yaml
spec:
  images:
    - glob: "gcr.io/vaikas/**"
  authorities:
    - static:
        action: pass
```

### Configuring remote signature location

If signatures are located in a different repository, it can be specified along with the `key` or `keyless` definition.
When no `source` is specified for the key, the expectation is that the signature is colocated with the image.

**Note:** By default, credentials used for the remote source repository are the ones provided in the PodSpec providing resource under `imagePullSecrets`.

To define a `source`, under the corresponding `authorities` node, `source` can be specified.

A sample of source specification for `key` and `keyless`:

```yaml
spec:
  authorities:
    - key:
        data: |
          -----BEGIN PUBLIC KEY-----
          ...
          -----END PUBLIC KEY-----
      source:
        - oci: registry.example.com/project/signature-location
    - keyless:
        url: https://fulcio.example.com
      source:
        - oci: registry.example.com/project/signature-location
```

### Configure `SignaturePullSecrets`

If the signatures/attestations are in a different repo or they use different
`imagePullSecrets`, you can configure `source` to point to a `secret` which must live
in the namespace where the pods are getting deployed.

```yaml
spec:
  authorities:
    - key:
        data: |
          -----BEGIN PUBLIC KEY-----
          ...
          -----END PUBLIC KEY-----
      source:
        - oci: registry.example.com/project/signature-location
    - keyless:
        url: https://fulcio.example.com
      source:
        - oci: registry.example.com/project/signature-location
          signaturePullSecrets:
          - name: mysecret
```

**Note:** The secret has to be in the format `type: dockerconfigjson`.

### Configuring Certificate Transparency Log

CTLog specifies the URL to a certificate transparency log that holds signature
and public key information.

When `ctlog` key is not specified, the public rekor instance will be used.

```yaml
spec:
  authorities:
    - keyless:
        url: https://fulcio.example.com
      ctlog:
        url: https://rekor.example.com
```

### Configuring Timestamp Authorities

You can verify images against a Timestamp Authority Service looking for RFC-3161
timestamp tokens in your image.

Timestamp authorities specifies the reference to a [TrustRoot CR](https://github.com/sigstore/policy-controller/blob/main/docs/api-types/index-v1alpha1.md#trustroot) where a timestamp service has been defined.

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: TrustRoot
metadata:
  name: my-tsa-keys
spec:
  sigstoreKeys:
    certificateAuthorities: []
    timestampAuthorities:
    - subject:
        organization: example.dev
        commonName: example-tsa
      uri: https://tsa.example.dev
      certChain: |-
        CERTIFICATE_CHAIN_IN_BASE64
```

You can define a list of trusted timestamp authorities setting its `uri`, certificate chain in base64 format and its `subject`.

Whenever you use a ClusterImagePolicy with a `rfc3161timestamp`, you must also specify a `key` or `keyless` block.
You can find more information about these fields in [here](https://github.com/sigstore/policy-controller/blob/main/docs/api-types/index-v1alpha1.md#certificateauthority).

```yaml
spec:
  authorities:
    - keyless:
        url: https://fulcio.sigstore.dev
        identities:
          - issuer: 'https://issuer/'
            subject: 'foo@example.dev'
      rfc3161timestamp:
        trustRootRef: my-tsa-keys
```

### Configuring verification against different Sigstore instances.

By default policy-controller trusts Public Good Instance of Sigstore. You can
add (or replace) this by specifying a different [Trust Root](#support-for-multiple-or-custom-sigstore-instances).
For example, to use your custom installation of Sigstore (Fulcio/Rekor), you
would first create a [Trust Root CR](#support-for-multiple-or-custom-sigstore-instances)
and then refer to it in your `keyless` section. For example, if your `TrustRoot`
CR pointing to your custom Sigstore installation is `my-sigstore`, you would
refer to it in the CIP `trustRootRef`. This example shows both custom Fulcio,
and Rekor pointing to your custom Sigstore.

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy-keyless-with-trustroot-remote-with-attestations
spec:
  images:
  - glob: "**demo**"
  authorities:
  - name: attestation
    keyless:
      url: http://fulcio.fulcio-system.svc
      trustRootRef: my-sigstore
      identities:
      - issuerRegExp: .*kubernetes.default.*
        subjectRegExp: .*kubernetes.io/namespaces/default/serviceaccounts/default
    ctlog:
      url: http://rekor.rekor-system.svc
      trustRootRef: my-sigstore
    attestations:
    - name: custom-match-predicate
      predicateType: custom
      policy:
        type: cue
        data: |
          predicateType: "cosign.sigstore.dev/attestation/v1"
          predicate: Data: "foobar e2e test"
```

### Configuring policy that validates attestations

Just like with `cosign` CLI you can verify attestations (using `verify-attestation`),
you can configure policies to validate that a particular attestation was signed by
a trusted authority as well as that the attestation passes the policy you
define. You do this by using `attestations` array within an `authorities`
section. For example, to configure that a `custom` predicate has to exist and is
attested by the specified `issuer` and `subject`, and the actual `Data` section
of the predicate matches the string `foobar e2e test`:

```yaml
apiVersion: policy.sigstore.dev/v1beta1
kind: ClusterImagePolicy
metadata:
  name: image-policy-keyless-with-attestations
spec:
  images:
  - glob: registry.local:5000/policy-controller/demo*
  authorities:
  - name: verify custom attestation
    keyless:
      url: http://fulcio.fulcio-system.svc
      identities:
      - issuerRegExp: .*kubernetes.default.*
        subjectRegExp: .*kubernetes.io/namespaces/default/serviceaccounts/default
    ctlog:
      url: http://rekor.rekor-system.svc
    attestations:
    - name: custom-match-predicate
      predicateType: https://cosign.sigstore.dev/attestation/v1
      policy:
        type: cue
        data: |
          predicateType: "https://cosign.sigstore.dev/attestation/v1"
          predicate: "foobar e2e test"
```

`policy` is optional and if left out, only the existence of the attestation is
verified. We also support `rego` in policy evaluations, and a rego alternative
for the above would look like this:

```yaml
apiVersion: policy.sigstore.dev/v1beta1
kind: ClusterImagePolicy
metadata:
  name: image-policy-keyless-with-attestations
spec:
  images:
  - glob: registry.local:5000/policy-controller/demo*
  authorities:
  - name: verify custom attestation
    keyless:
      url: http://fulcio.fulcio-system.svc
      identities:
      - issuerRegExp: .*kubernetes.default.*
        subjectRegExp: .*kubernetes.io/namespaces/default/serviceaccounts/default
    ctlog:
      url: http://rekor.rekor-system.svc
    attestations:
    - name: custom-match-predicate
      predicateType: https://cosign.sigstore.dev/attestation/v1
      policy:
        type: rego
        data: |
          package sigstore
          default isCompliant = false
          isCompliant {
            input.predicateType == "https://cosign.sigstore.dev/attestation/v1"
            input.predicate == "foobar e2e test"
          }
```

### Configuring policy at the `ClusterImagePolicy` level.

As discussed earlier, by specifying multiple `ClusterImagePolicy` creates an `AND`
clause so that each `ClusterImagePolicy` must be satisfied for an admission, and
having multiple `authorities` creates an `OR` clause so that any matching `authority`
is considered a success, sometimes you may want more flexibility, for example, if you
wanted to specify that at least 2 out of N signatures match, and for those you
can create a single `ClusterImagePolicy` but craft a `policy` that then gets applied
after a `ClusterImagePolicy` has been validated and at least one of the
authorities matches.

You can also utilize the CIP level policy to fetch additional information about
the specific Kubernetes resource being created that will then be available
for the CIP level policy, for example:

 * Apply policies against ObjectMetadata (things like labels, annotations for
   example)
 * Spec which has details about the resource being created. For example
   Pod.Spec, which has details like which serviceAccount the Pod is being run as
   and so forth.
 * [OCI Image Configuration](https://github.com/opencontainers/image-spec/blob/main/config.md)
   which contains root filesystem changes and the corresponding execution
   parameters for use within a container runtime.

Here is a slightly more complex policy that shows how one could craft more
complex policies at the CIP level that then validates that the more specific
authority policies are as expected. It requires there to be two attestations
`custom` and `vuln` and also two signatures, one signed with a `key` and one
with `keyless` signature.


```yaml
apiVersion: policy.sigstore.dev/v1beta1
kind: ClusterImagePolicy
metadata:
  name: image-policy-requires-two-signatures-two-attestations
spec:
  images:
  - glob: registry.local:5000/policy-controller/demo*
  authorities:
  - name: keylessatt
    keyless:
      url: http://fulcio.fulcio-system.svc
      identities:
      - issuerRegExp: .*kubernetes.default.*
        subjectRegExp: .*kubernetes.io/namespaces/default/serviceaccounts/default
    ctlog:
      url: http://rekor.rekor-system.svc
    attestations:
    - predicateType: https://cosign.sigstore.dev/attestation/v1
      name: customkeyless
      policy:
        type: cue
        data: |
          import "time"
          before: time.Parse(time.RFC3339, "2049-10-09T17:10:27Z")
          predicateType: "https://cosign.sigstore.dev/attestation/v1"
          predicate: {
            foo: "foobar e2e test"
            Timestamp: <before
          }
    - predicateType: https://cosign.sigstore.dev/attestation/vuln/v1
      name: vulnkeyless
      policy:
        type: cue
        data: |
          import "time"
          before: time.Parse(time.RFC3339, "2022-04-15T17:10:27Z")
          after: time.Parse(time.RFC3339, "2022-03-09T17:10:27Z")
          predicateType: "https://cosign.sigstore.dev/attestation/vuln/v1"
          predicate: {
            invocation: {
              uri: "invocation.example.com/cosign-testing"
            }
            scanner: {
              uri: "fakescanner.example.com/cosign-testing"
            }
            metadata: {
              scanStartedOn: <before
              scanStartedOn: >after
              scanFinishedOn: <before
              scanFinishedOn: >after
            }
          }
  - name: keyatt
    key:
      data: |
        -----BEGIN PUBLIC KEY-----
        MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOz9FcbJM/oOkC26Wfo9paG2tYGBL
        usDLHze93DzgLaAPDsyJrygpVnL9M6SOyfyXEsjpBTUu6uFZqHua8hwAlA==
        -----END PUBLIC KEY-----
    ctlog:
      url: http://rekor.rekor-system.svc
    attestations:
    - name: custom-match-predicate
      predicateType: https://cosign.sigstore.dev/attestation/v1
      policy:
        type: cue
        data: |
          predicateType: "https://cosign.sigstore.dev/attestation/v1"
          predicate: "foobar key e2e test"
  - name: keylesssignature
    keyless:
      url: http://fulcio.fulcio-system.svc
    ctlog:
      url: http://rekor.rekor-system.svc
  - name: keysignature
    key:
      data: |
        -----BEGIN PUBLIC KEY-----
        MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOz9FcbJM/oOkC26Wfo9paG2tYGBL
        usDLHze93DzgLaAPDsyJrygpVnL9M6SOyfyXEsjpBTUu6uFZqHua8hwAlA==
        -----END PUBLIC KEY-----
    ctlog:
      url: http://rekor.rekor-system.svc
  policy:
    type: cue
    data: |
      package sigstore
      import "struct"
      import "list"
      authorityMatches: {
        keyatt: {
          attestations: struct.MaxFields(1) & struct.MinFields(1)
        },
        keysignature: {
          signatures: list.MaxItems(1) & list.MinItems(1)
        },
        if (len(authorityMatches.keylessatt.attestations) < 2) {
          keylessattMinAttestations: 2
          keylessattMinAttestations: "Error"
        },
        keylesssignature: {
          signatures: list.MaxItems(1) & list.MinItems(1)
        }
      }
```

### Including OCI Image Configuration for CIP level policies

In order to include the OCI Image Configuration, you have to explicitly
configure the CIP.Spec.Policy to have `fetchConfigFile` set to `true`. For
example, to configure a check that the container image is being run as a user
`65532` on `linux/amd64` arch, you would configure your CIP like this:

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy-config-file
spec:
  images:
  - glob: "ghcr.io/sigstore/timestamp-server**"
  authorities:
  - static:
      action: pass
  policy:
    fetchConfigFile: true
    type: "cue"
    data: |
      config: "linux/amd64": config: User: "65532"
```

### Including ObjectMeta for CIP level policies

In order to include the ObjectMeta, you have to explicitly configure the
CIP.Spec.Policy to have `includeObjectMeta` set to `true`. For example, to
configure a check that the resource contains a label `foo=bar`, you would
configure your CIP like this:

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy-objectmeta
spec:
  images:
  - glob: "ghcr.io/sigstore/timestamp-server**"
  authorities:
  - static:
      action: pass
  policy:
    includeObjectMeta: true
    type: "cue"
    data: |
      metadata: "labels": "foo": "bar"
```

### Including TypeMeta for CIP level policies

In order to include the TypeMeta, you have to explicitly configure the
CIP.Spec.Policy to have `includeTypeMeta` set to `true`. For example, to
configure a check that the resource is a Pod, you would configure your CIP like
this:

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy-typemeta
spec:
  images:
  - glob: "ghcr.io/sigstore/timestamp-server**"
  authorities:
  - static:
      action: pass
  policy:
    includeTypeMeta: true
    type: "cue"
    data: |
      typemeta:
        kind: "Pod"
```

### Including Spec for CIP level policies

In order to include the objects Spec, you have to explicitly configure the
CIP.Spec.Policy to have `includeSpec` set to `true`. For example, to configure a
check that the pod runs as serviceAccount `default`, you would configure your
CIP like this:

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-spec
spec:
  images:
  - glob: "ghcr.io/sigstore/timestamp-server**"
  authorities:
  - static:
      action: pass
  policy:
    includeSpec: true
    type: "cue"
    data: |
      spec: "serviceAccount": "default"
```

*NOTE* For Spec, you may want to use MatchResource to restrict which resources
you want to apply the CIP to since the Spec will be different between say a
`Deployment` and a `Pod`.

### Using ConfigMapRef to specify policies

Including longer cue/rego policies inlined into CIP can be a bit unwieldy, so
you can decouple defining the policy from using it, and therefore making reuse
easier. For this there's a `configMapRef` field in the policy (same field exists
whether you define this at the attestation level, or at the CIP level). For this
you would create a `ConfigMap` and you would add the policy as a key in that
`ConfigMap` and then in the Policy.configMapRef specify the `ConfigMap` name and
key where the policy comes in from. This is very similar to how we specify
`SecretRef` for including PublicKeys for example.

#### Create the file containing your policy

```shell
cat <<EOF > /tmp/mypolicy.cue
config: "linux/amd64": config: User: "65532"
config: "linux/arm/v7": config: User: "65532"
EOF
```

#### Create a ConfigMap from the policy:

```shell
kubectl create -n cosign-system configmap policy-config --from-file=policy=/tmp/mypolicy.cue
```

#### Use the ConfigMap from your policy

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy-config-file
spec:
  images:
  - glob: "ghcr.io/sigstore/timestamp-server**"
  authorities:
  - static:
      action: pass
  policy:
    fetchConfigFile: true
    type: "cue"
    configMapRef:
      name: policy-config
      key: policy
```

### Using Remote (URL + SHA256) to specify policies

Another way to reference policies without embedding them into the CIP is by
providing a URL where to fetch the policy from. In order to ensure that the
policy has not been tampered with, you must also provide a SHA256 checksum which
will then be computed against the retrieved policy to make sure it is what you
expect it to be. Note that the URLs must be HTTPS. Here's an example of how
to specify that a CIP policy should be fetched from the URL.

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy-url
spec:
  images:
  - glob: "ghcr.io/sigstore/timestamp-server**"
  authorities:
  - static:
      action: pass
  policy:
    fetchConfigFile: true
    type: "cue"
    remote:
      url: "https://gist.githubusercontent.com/hectorj2f/af0d32d4be4bf2710cff76c397a14751/raw/d4dd87fffdf9624a21e62b8719e3ce8d61334ab9/policy-controller-test-fail-cue"
      sha256sum: 291534e501184200a3933969277403acf50582fbe73509571a5b73017e49a957
```

*NOTE:* URLs are not automatically refreshed. They are fetched whenever a CIP
changes (to simulate this you can update a label for example), or whatever the
reconcile frequency is (by default 10 hours, but configurable).


### Controlling warn vs. enforce behaviour

When creating a `ClusterImagePolicy` by default when a policy fails to meet
the requirements, it will not be admitted. However, sometimes folks want to
allow these through, but warn the user about the fact that this operation did
not meet the criteria. For this you can use a `mode` configuration option for
a specific policy. When set to `warn`, it will not block the admission, but
instead will allow it through and emit a warning.

For example:
```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: ClusterImagePolicy
metadata:
  name: image-policy-keyless-warn
spec:
  mode: warn
  images:
  - glob: registry.local:5000/policy-controller/demo*
  authorities:
  - keyless:
      url: http://fulcio.fulcio-system.svc
    ctlog:
      url: http://rekor.rekor-system.svc
```
 By specifying the `spec.mode` as `warn`, even if an image is found to be not
 compliant, it will be allowed through, but a warning is issued to the caller
 informing them that this is not a compliant image.

### Policies matching specific resource types and labels

The `ClusterImagePolicy` supports a new field that defines which type of core resources a policy will enforce against the defined authorities for a given glob pattern.

The following is an example of a `ClusterImagePolicy` that defines a list of resource types to enforce a policy for `pods` and `cronjobs`:

```yaml
apiVersion: cosigned.sigstore.dev/v1beta1
kind: ClusterImagePolicy
metadata:
  name: image-policy
spec:
  match:
  - resource: jobs
    group: batch
    version: v1
  - resource: pods
    version: v1
  images:
  - glob: *
  authorities:
  - keyless:
      url: https://fulcio.mattmoor.dev/
      identities:
      - issuer: https://container.googleapis.com/v1/projects/myco-prod/locations/*/clusters/*
        subject: https://k8s.io/namespaces/*/serviceaccounts/*

    tlog:
      url: https://rekor.mattmoor.dev
```

Besides the selection of specific types, the resources could also be selected using labels to filter them from other resources of the same type. In the next example, a `ClusterImagePolicy` enforce this policy on `cronjobs` with the label `prod=x-cluster1`:

```yaml
apiVersion: cosigned.sigstore.dev/v1beta1
kind: ClusterImagePolicy
metadata:
  name: image-cronjob-policy
spec:
  match:
      - resource: cronjobs
        group: batch
        version: v1
        selector:
          matchLabels:
            prod: x-cluster1
  images:
  - glob: *
  authorities:
  - keyless:
      url: https://fulcio.mattmoor.dev/
      identities:
      - issuer: https://container.googleapis.com/v1/projects/myco-prod/locations/*/clusters/*
        subject: https://k8s.io/namespaces/*/serviceaccounts/*

    tlog:
      url: https://rekor.mattmoor.dev
```

This feature only supports the selection of the following resource types: `pods, statefulsets, daemonsets, cronjobs, jobs, deployments and replicasets`.

## Support for multiple or custom Sigstore instances

By default policy-controller trusts the Public Good Instance of Sigstore and
can be used to validate against it. Sometimes however, if you are using a
private instance of Sigstore, you need to configure policy-controller to verify
against the Trusted Roots for that instance. This can also be used to implement
running in an airgapped by configuring the TUF roots that get installed Out Of
Band (OOB), or lastly if you want to just provide the necessary keys and
certificates necessary for verification. Using TrustRoots is also necessary if
you are using TimeStamp Authority for verification.

TrustRoots can be specified as TUF Roots, serialized TUF repository (for
air-gap scenarios), as well as serialized keys/certificates (if there's not TUF
root, and can also be used for air-gap scenarios) for bring your own keys/certs.

You can learn more about [TUF](https://github.com/theupdateframework/) and
[why](https://blog.sigstore.dev/sigstore-bring-your-own-stuf-with-tuf-40febfd2badd/)/[
 how](https://github.com/sigstore/root-signing) Sigstore uses it.

Detailed field descriptions for the [TrustRoot CRD](https://github.com/sigstore/policy-controller/blob/main/docs/api-types/index-v1alpha1.md#trustroot).

### Configuring TrustRoot for custom TUF Root

You configure a TrustRoot to point to a custom TUF root by providing an initial
root.json as well as the mirror where to fetch updates. An example of this
would be:

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: TrustRoot
metadata:
  name: my-remote
spec:
  remote:
    mirror: TUF_MIRROR
    root: |-
      ROOT_JSON
```

where `TUF_MIRROR` is the URL to the TUF mirror, and `ROOT_JSON` is the base64
encoded `root.json` file from the TUF. Policy-controller will keep TUF
up-to-date automatically. This is the recommended way to ensure keys/certs are
rotated automatically as they are updated by TUF.

### Configuring TrustRoot for custom TUF repository

If you have a TUF set up, but are unable to access the mirror (air-gap for
example), you can provide the serialized repository. In this mode however, you
have to manually rotate the keys/certificates.

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: TrustRoot
metadata:
  name: my-repository-serialized
spec:
  repository:
    root: |-
      ROOT_JSON
    mirrorFS: |-
      REPOSITORY
```

where `ROOT_JSON` is same as above, the base64 encoded `root.json` file from the
TUF. `REPOSITORY` is a tarred, gzipped, and base64 encoded remote repository. So
you would have to get tar the repository, gzip it and then base64 encode it.

### Configuring TrustRoot for 'bring your own keys'

If you do not have TUF set up, you can still establish trust by bringing the
keys and certificates in OOB. Here you have to explicitly configure each
key/cert:

```yaml
apiVersion: policy.sigstore.dev/v1alpha1
kind: TrustRoot
metadata:
  name: my-sigstore-keys
spec:
  sigstoreKeys:
    certificateAuthorities:
    - subject:
        organization: fulcio-organization
        commonName: fulcio-common-name
      uri: https://fulcio.fulcio-system.svc
      certChain: |-
        FULCIO_CERT_CHAIN
    ctLogs:
    - baseURL: https://ctfe.example.com
      hashAlgorithm: sha-256
      publicKey: |-
        CTFE_PUBLIC_KEY
    tLogs:
    - baseURL: https://rekor.rekor-system.svc
      hashAlgorithm: sha-256
      publicKey: |-
        REKOR_PUBLIC_KEY
    timestampAuthorities:
    - subject:
        organization: tsa-organization
        commonName: tsa-common-name
      uri: https://tsa.example.com
      certChain: |-
        TSA_CERT_CHAIN
```

#### certificateAuthorities

`certificateAuthorities` specifies the trust for the signing certificates, which
is Fulcio in Sigstore case. `FULCIO_CERT_CHAIN` is the base64 encoded
certificates including the root for Fulcio that matches `fulcio-organization`
and `commonName` in the certificate for the specified `url`.

#### ctLogs

`ctLogs` specifies the Certificate Transparency Log (CTLog) trust. This is used
to validate entries received from `certificateAuthorities` that certificates
created for signing purposes were properly recorded in the Certificate
Transparency Log for auditing.
`baseURL` is the base URL to the log conforming to
[RFC6962](https://datatracker.ietf.org/doc/html/rfc6962), for example,
[Trillian](https://github.com/google/trillian) in the case of Public Good
Instance of Sigstore. `hashAlgorithm` specifies the hash algorithm used and
`publicKey` is the base64 encoded Public Key of the CTLog.

#### tLogs

`tLogs` specifies the Transparency Log (TLog) trust, which is Rekor in Sigstore
case. `REKOR_PUBLIC_KEY` base64 encoded Public Key of the TLog. `baseURL` is the
base URL for the service providing the TLog, and again the `hashAlgorithm` is
the hash algorithm used.

#### timestampAuthorities

`timestampAuthorities` specifies the trust to an
[RFC3161](https://datatracker.ietf.org/doc/html/rfc3161) Time-Stamp Authority.
`uri` specifies the URL to the Timestamp Service. `TSA_CERT_CHAIN` is the base64
encoded certificates with Leaf, Intermediates, and Root for the Time-Stamp
Authority that matches `tsa-organization` and `commonName`.

**NOTE** the `ctLogs` and `tLogs` naming is currently inconsistent between CIP
and TrustRoot. We will fix this in a newer API version, but can't do it without
reving the API version due to backwards compatibility. In CIP the ctLog refers
to Rekor, which in TrustRoot was correctly named `tLog`. Whereas in TrustRoot
the `ctLog` correctly refers to the `Certificate Transparency Log`.
