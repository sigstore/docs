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

- A Kubernetes cluster and [`kubectl`](https://kubernetes.io/docs/tasks/tools/) configured to access it
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
namespace. For the full list of configurable values, see the
[chart README](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller).

## Verify the installation

Confirm the webhook pods are running:

```shell
kubectl get pods -n cosign-system
```

## Enabling policy enforcement

The `policy-controller` admission controller only validates resources in
namespaces that have chosen to opt-in. See the
[Configure policy-controller admission controller for namespaces](/policy-controller/overview/#configure-policy-controller-admission-controller-for-namespaces)
instructions for more details.

The webhook validates that container images have been signed, and resolves image
tags to digests to ensure the image being run is not different from when it was
admitted.

## Using a private Sigstore instance (custom TUF root)

If you run a private instance of Sigstore components, you can specify your own
`TUF` root by mounting your TUF `root.json` file into the container (for example
by mounting a Secret) and then pointing to it with the `--tuf-root` argument, as
well as using the `--tuf-mirror` argument to point to where the TUF mirror is.
There is an optional Secret `tuf-root` that you can create with key `root`
containing the `root.json` file, which gets mounted as `/var/run/tuf/root.json`.

## Tuning the resync period

The `policy-controller` resyncs `ClusterImagePolicies` by default every 10 hours.
Customize the resync period by using the `--policy-resync-period` argument and
defining a duration for the `policy-webhook` deployment. See the
[Golang time package's ParseDuration](https://pkg.go.dev/time#example-ParseDuration)
for example duration string formats.

See the [Configuring policy-controller ClusterImagePolicy](/policy-controller/overview/#configuring-policy-controller-clusterimagepolicy)
instructions for more details on configuration.
