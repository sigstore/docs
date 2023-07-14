---
title: "Installation"
category: "Kubernetes Policy Controller"
menuTitle: "Installation"
position: 905
---

The
[`policy-controller`](https://github.com/sigstore/policy-controller) project contains
an admission controller for Kubernetes, which can be installed on
your Kubernetes cluster in a form of a
[`helm chart`](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller).

If you run a private instance of Sigstore components, you can specify your own
`TUF` root by mounting your TUF root.json file into the container (for example
by mounting a Secret) and then pointing to it with --tuf-root argument as well
as using --tuf-mirror argument to point to where the TUF mirror is. There's
an optional Secret `tuf-root` that you can create with key `root` that you can
put the `root.json` file in that gets mounted as `/var/run/tuf/root.json`.

The webhook can be used to automatically validate that all the container images have been signed.
The webhook also resolves the image tags to ensure the image being ran is not different from when it was admitted.

The `policy-controller` admission controller will only validate resources in
namespaces that have chosen to opt-in. See the
[Enable policy-controller Admission Controller for Namespaces](/policy-controller/overview/#enable-policy-controller-admission-controller-for-namespaces) instructions for more details.

The `policy-controller` resyncs `ClusterImagePolicies` by default every 10 hours.
Customize the resync period by using the `--policy-resync-period` argument and
defining a duration for the `policy-webhook` deployment. See the [Golang time package's ParseDuration](https://pkg.go.dev/time#example-ParseDuration) for example duration string formats.

See the [Configuring policy-controller ClusterImagePolicy](/policy-controller/overview/#configuring-policy-controller-clusterimagepolicy) instructions for more details on configuration.
