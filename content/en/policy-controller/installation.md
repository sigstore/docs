---
type: docs
category: Kubernetes Policy Controller
menuTitle: Installation
title: Installation
weight: 905
---

The [`policy-controller`](https://github.com/sigstore/policy-controller) is a Kubernetes admission controller that enforces image signing policies at deploy time. Install it on your cluster via a [Helm chart](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller).

## Prerequisites

- Kubernetes cluster — policy-controller `> 0.10.x` supports Kubernetes 1.27, 1.28, and 1.29; starting with v0.12.0, supported versions are Kubernetes 1.29, 1.30, 1.31, and 1.32. See the [policy-controller support matrix](https://github.com/sigstore/policy-controller#support-policy).
- [Helm](https://helm.sh/docs/intro/install/) 3.x
- `kubectl` configured to access your cluster

## Install with Helm

Add the Sigstore Helm repository and install the chart into the `cosign-system` namespace:

```bash
helm repo add sigstore https://sigstore.github.io/helm-charts
helm repo update
kubectl create namespace cosign-system
helm install policy-controller -n cosign-system sigstore/policy-controller
```

The chart installs the `ClusterImagePolicy` and `TrustRoot` Custom Resource Definitions (CRDs) automatically.

## Enable Policy Enforcement for Namespaces

The admission controller validates resources only in namespaces that have opted in. Label the namespaces you want protected:

```bash
kubectl label namespace my-namespace policy.sigstore.dev/include=true
```

See [Enable policy-controller Admission Controller for Namespaces](/policy-controller/overview/#enable-policy-controller-admission-controller-for-namespaces).

## Configure Image Validation Behavior

### Unmatched images

Images that do not match any `ClusterImagePolicy` are **denied** by default. Edit the `config-policy-controller` ConfigMap to change this:

```bash
kubectl patch configmap config-policy-controller -n cosign-system \
  --type merge \
  -p '{"data":{"no-match-policy":"warn"}}'
```

Valid values: `deny` (default), `warn`, `allow`.

### Policy resync period

The controller resyncs `ClusterImagePolicy` resources every 10 hours by default. Adjust this with `--policy-resync-period` on the `policy-webhook` deployment:

```bash
helm upgrade policy-controller -n cosign-system sigstore/policy-controller \
  --set webhook.extraArgs.policy-resync-period=2h
```

See [time.ParseDuration](https://pkg.go.dev/time#example-ParseDuration) for valid duration string formats. The `TrustRoot` resync period defaults to 24 hours and is controlled by `--trustroot-resync-period`.

## Using a Private Sigstore Instance

If you run a private instance of Sigstore components, mount your [TUF (The Update Framework)](https://theupdateframework.io/) `root.json` into the webhook container and point to it at startup.

Create a Secret with your root:

```bash
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

```bash
helm upgrade policy-controller -n cosign-system sigstore/policy-controller \
  -f your-values.yaml \
  --set webhook.extraArgs.tuf-root=/var/run/tuf/root \
  --set webhook.extraArgs.tuf-mirror=https://tuf.example.com
```

To disable TUF entirely (for air-gapped environments or when using only `sigstoreKeys`-based `TrustRoot` resources):

```bash
helm upgrade policy-controller -n cosign-system sigstore/policy-controller \
  --set webhook.extraArgs.disable-tuf=true
```

## Test a Policy Without a Cluster

The `policy-tester` tool validates a `ClusterImagePolicy` against an image locally without a running cluster. Clone the repository and build it:

```bash
git clone https://github.com/sigstore/policy-controller
cd policy-controller
make policy-tester
./policy-tester --policy=my-policy.yaml --image=ghcr.io/example/app:v1.0.0
```

## Next Steps

- [Configuring policy-controller ClusterImagePolicy](/policy-controller/overview/#configuring-policy-controller-clusterimagepolicy)
- [Overview](/policy-controller/overview/)

