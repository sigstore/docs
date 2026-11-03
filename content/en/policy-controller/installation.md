---
type: docs
category: Kubernetes Policy Controller
menuTitle: Installation
title: Installation
weight: 905
---

The [`policy-controller`](https://github.com/sigstore/policy-controller) project
provides an admission controller for Kubernetes that can validate container image
signatures and attestations. The recommended way to install it is with the
official [Helm chart](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller).

## Prerequisites

- A Kubernetes cluster and [`kubectl`](https://kubernetes.io/docs/tasks/tools/) configured to access it. The [policy-controller support policy](https://github.com/sigstore/policy-controller#support-policy) lists the Kubernetes versions each release line runs on; current releases are tested in CI against Kubernetes 1.33 and 1.34.
- [Helm](https://helm.sh/docs/intro/install/) v3

## Install with Helm

Add the Sigstore Helm repository and install the chart:

```shell
helm repo add sigstore https://sigstore.github.io/helm-charts
helm repo update
kubectl create namespace cosign-system
helm install policy-controller -n cosign-system sigstore/policy-controller
```

This deploys the `policy-controller` admission webhook into the `cosign-system`
namespace. The chart installs the `ClusterImagePolicy` and `TrustRoot` Custom Resource Definitions (CRDs) automatically (`installCRDs: true`). For the full list of configurable values, see the
[chart README](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller).

## Verify the installation

Confirm the webhook pods are running:

```shell
kubectl get pods -n cosign-system
```

## Enabling policy enforcement

The `policy-controller` admission controller only validates resources in
namespaces that have chosen to opt-in. Label the namespaces you want protected:

```shell
kubectl label namespace my-namespace policy.sigstore.dev/include=true
```

See the
[Configure policy-controller admission controller for namespaces](/policy-controller/overview/#configure-policy-controller-admission-controller-for-namespaces)
instructions for more details.

The webhook validates that container images have been signed, and resolves image
tags to digests to ensure the image being run is not different from when it was
admitted.

## Unmatched images

Images that do not match any `ClusterImagePolicy` are **denied** by default. Edit the `config-policy-controller` ConfigMap to change this:

```shell
kubectl patch configmap config-policy-controller -n cosign-system \
  --type merge \
  -p '{"data":{"no-match-policy":"warn"}}'
```

Valid values: `deny` (default), `warn`, `allow`. The chart's `webhook.configData` value sets the same ConfigMap entries at install time.

## Using a private Sigstore instance (custom TUF root)

If you run a private instance of Sigstore components, you can specify your own
`TUF` root by mounting your TUF `root.json` file into the container (for example
by mounting a Secret) and then pointing to it with the `--tuf-root` argument, as
well as using the `--tuf-mirror` argument to point to where the TUF mirror is.
There is an optional Secret `tuf-root` that you can create with key `root`
containing the `root.json` file, which gets mounted as `/var/run/tuf/root.json`.

With the Helm chart, create the Secret and mount it yourself. Create a Secret with your root:

```shell
kubectl create secret generic tuf-root -n cosign-system \
  --from-file=root=./root.json
```

Mount the Secret into the webhook container via your Helm values file:

```yaml
webhook:
  volumes:
    - name: tuf-root
      secret:
        secretName: tuf-root
  volumeMounts:
    - name: tuf-root
      mountPath: /var/run/tuf
      readOnly: true
```

Then point the webhook at the mounted root:

```shell
helm upgrade policy-controller -n cosign-system sigstore/policy-controller \
  -f your-values.yaml \
  --set webhook.extraArgs.tuf-root=/var/run/tuf/root \
  --set webhook.extraArgs.tuf-mirror=https://tuf.example.com
```

To disable TUF entirely (for air-gapped environments or when using only `sigstoreKeys`-based `TrustRoot` resources):

```shell
helm upgrade policy-controller -n cosign-system sigstore/policy-controller \
  --set webhook.extraArgs.disable-tuf=true
```

## Tuning the resync period

The `policy-controller` resyncs `ClusterImagePolicies` by default every 10 hours.
Customize the resync period by using the `--policy-resync-period` argument and
defining a duration for the `policy-webhook` deployment:

```shell
helm upgrade policy-controller -n cosign-system sigstore/policy-controller \
  --set webhook.extraArgs.policy-resync-period=2h
```

See the
[Golang time package's ParseDuration](https://pkg.go.dev/time#example-ParseDuration)
for example duration string formats. The `TrustRoot` resync period defaults to 24 hours and is controlled by `--trustroot-resync-period`.

See the [Configuring policy-controller ClusterImagePolicy](/policy-controller/overview/#configuring-policy-controller-clusterimagepolicy)
instructions for more details on configuration.

## Test a policy without a cluster

The `policy-tester` tool validates a `ClusterImagePolicy` against an image locally without a running cluster. Clone the repository and build it:

```shell
git clone https://github.com/sigstore/policy-controller
cd policy-controller
make policy-tester
./policy-tester --policy=my-policy.yaml --image=ghcr.io/example/app:v1.0.0
```

## Next steps

- [Configuring policy-controller ClusterImagePolicy](/policy-controller/overview/#configuring-policy-controller-clusterimagepolicy)
- [Overview](/policy-controller/overview/)
