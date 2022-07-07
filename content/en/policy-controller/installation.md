---
title: "Installation"
category: "Policy Controller"
menuTitle: "Installation"
position: 142
---

The
[`policy-controller`](https://github.com/sigstore/policy-controller) project contains
an admission controller for Kubernetes, which can be installed on
your Kubernetes cluster in a form of a
[`helm chart`](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller).

The webhook can be used to automatically validate that all the container images have been signed.
The webhook also resolves the image tags to ensure the image being ran is not different from when it was admitted.

The `policy-controller` admission controller will only validate resources in
namespaces that have chosen to opt-in. See the
[Enable policy-controller Admission Controller for Namespaces](overview#enable-policy-controller-admission-controller-for-namespaces) instructions for more details.

See the [Configuring policy-controller ClusterImagePolicy](overview#configuring-policy-controller-clusterimagepolicy) instructions for more details on configuration.
