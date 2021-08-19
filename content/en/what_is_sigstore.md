---
title: sigstore
date: 2020-12-07T17:09:20Z
draft: false
section: single
type: page
---
**sigstore** is a [Linux Foundation](https://linuxfoundation.org/) project.

**sigstore** is a project with the goal of providing a public good / non-profit service to improve the open source
software supply chain by easing the adoption of cryptographic software signing, backed by transparency log technologies.

**sigstore** will seek to empower software developers to securely sign software artifacts such as release files,
container images, binaries, bill of material manifests and more. Signing materials are then stored into a tamper
resistant public log

**sigstore** will be free to use for all developers and software providers, with sigstore's code and operation
tooling being 100% open source and maintained / developed by the [**sigstore** community](https://github.com/sigstore).

### Software Supply Chain Security

Software supply chains are exposed to multiple risks. Users are susceptible to various targeted attacks, along with
account and cryptographic key compromise. Keys in particular are a challenge for software maintainers to manage.
Projects often have to maintain a list of current keys in use, and manage the keys of individuals who no longer
contribute to a project. Projects all too often store public keys / digests on git repo readme files or websites,
two forms of storage susceptible to tampering and therefore a less than optimal means of securely communicating trust.

The toolsets we have historically relied upon were also not built for the present circumstance of remote teams. This can
be seen by the need to create a web of trust, with teams having to meet in person and sign each other's keys. The
current tooling (outside of controlled environments) all too often [feel inappropriate to even technical users](https://blog.filippo.io/giving-up-on-long-term-pgp/).

![Supply Chain Image](/images/ssc.png)
<p style="text-align: center;">supply chain risks</p>

## What is sigstore?

**sigstore** will be a free to use non-profit software signing service that harnesses existing technologies of x509 PKI and
transparency logs.

Users generate ephemeral short-lived key pairs using the sigstore client tooling. The sigstore PKI service will then
provide a signing certificate generated upon a successful OpenID connect grant. All certificates are recorded into a
certificate transparency log and software signing materials are sent to a signature transparency log. The use of
transparency logs introduces a trust root to the user's OpenID account. We can then have guarantees that the claimed
user was in control of an identity service provider's account at the time of signing. Once the signing operation is
complete, the keys can be discarded, removing any need for further key management or need to revoke or rotate.

Using OpenID connect identities allows users to take advantage of existing security controls such as 2FA, OTP
and hardware token generators.

sigstore's transparency logs can act as a source of provenance, integrity, and discoverability. Being public
and open anyone can monitor sigstore's transparency logs for occurrences of their software namespace being used,
perform queries using an artifact's digest, return entries signed by a specific email address, public key, etc. Further
to this, security researchers can monitor the log to seek out possible nefarious patterns or questionable behavior.

![Supply Chain Image](/images/tree.png)
<p style="text-align: center;">sigstore manifests entry into the transparency log</p>

### What will I be able to sign and store?

We are initially targeting generic release artifacts such as tarballs, compiled binaries and container images. Later
we will explore other formats (such as jars) and manifest signing, such as SBOM etc. We also open to collaborate with
package managers and ease the adoption of signing for their communities.

### Are there any privacy concerns?

We don't think so.

The only personal data we require will be provided from an OpenID Connect grant, and we keep that as lean as
we can (the user's email address). We don't want access to your contacts, email contents, cloud drive, calendar
etc. We won't want to email you offers nor sell the accounts to another party to maintain the service. We just need a
way of mapping a signing event to someone who has access to an identity provider account. This allows us a trust root.

### What is the current status of the project

We now have a fully functioning transparency log named 'rekor'. Rekor consists of a server and client tooling to
make entries and query for inclusion. It has a customizable schema framework and pluggable PKI framework.

At present the WebPKI and client signing tooling is under prototype development and is not available for general use.

### Can I use the transparency log on its own?

Sure, anyone can stand up a rekor instance (rekor is the name of the transparency log project under sigstore). We
originally planned to just run a t-log, but then we realised not many were likely to use it as the whole signing UX [is
less than desirable](https://latacora.micro.blog/2019/07/16/the-pgp-problem.html). So we extended the project to include
an 'easy to use' signing system. So we very much intend to keep rekor in its current state where it can be run in on its
own. So if you perform your own signing, you can just use rekor on its own.

Rekor has a pluggable PKI and support present for the following:

* GPG
* X.509
* Minisign

It also has a customizable manifest schema (pluggable types), so you can get rekor to work with whatever values you need
(within reason).

More details of pluggable types can be found on the related [documentation page](../docs/plugable_types).

Documentation on running a rekor server [is available here](../get_started/server).

Documentation on the rekor client CLI (for adding an entry to a rekor transparency log) [is available here](../get_started/client).

### Why not blockchain?

Mostly for these reasons:

* Public blockchains with all the best of intentions, often end up using a centralized entry point for canonicalization,
  auth etc.
* Consensus algorithms can be susceptible to majority attacks
* Transparency logs are more [mature in this space at present](https://certificate.transparency.dev/) and they are
  capable of providing exactly what we need.

### How does this relate to the work of TUF / in-toto?

sigstore is complementary to TUF / in-toto, and project members of the TUF / in-toto
communities are collaborating with sigstore. For more details and the latest status
please jump onto our [slack
workplace](https://join.slack.com/t/sigstore/shared_invite/zt-mhs55zh0-XmY3bcfWn4XEyMqUUutbUQ).

### Do you plan to run a monitor?

Yes, we do in some form. Currently some folks from Purdue university are working on a monitor prototype.

### Would I be able to run my own monitor or build my own application to interact with the transparency logs?

Yes, very much! The more people monitoring the logs and rendering or providing useful services to users, the better.

We have published OpenAPI interfaces for both [Rekor](https://sigstore.dev/swagger/index.html?urls.primaryName=Rekor) and [Fulcio](https://sigstore.dev/swagger/index.html?urls.primaryName=Fulcio)
The goal is to make it easier to integrate directly with sigstore services. You can always jump on our [slack workspace](https://join.slack.com/t/sigstore/shared_invite/zt-mhs55zh0-XmY3bcfWn4XEyMqUUutbUQ)
to run your ideas past us.

### What is the current status of the project

As of time of writing [24/06/2021] we have a working transparency log (rekor), that is fully operation as a standalone
service. Files are available to run this in GKE. Work is now underway to mature the
WebPKI (fuclio) and develop client tools for various package managers and upstream communities

## Want to find out more?

* Come on over to our [slack
workplace](https://join.slack.com/t/sigstore/shared_invite/zt-mhs55zh0-XmY3bcfWn4XEyMqUUutbUQ)
* follow us on [twitter @projectsigstore](https://twitter.com/projectsigstore) (we are quite busy there with updates)
* follow our [blog](https://blog.sigstore.dev)
* join our mailing list at [sigstore-dev@googlegroups.com](https://groups.google.com/g/sigstore-dev)
