---
title: 'History and Research'
description: ''
category: 'About sigstore'
position: 4
---

_An earlier version of some of this material was published in Chapter 5 of the [Linux Foundation Sigstore course](https://learning.edx.org/course/course-v1:LinuxFoundationX+LFS182x+2T2022/home)._

Since its founding, over 100 contributors pushed over 2,800 commits to the Sigstore open-source repository. These contributors hail from 20 different organizations, including Google, Red Hat, Chainguard, Purdue University, VMware, Twitter, Citi, Charm, Anchor, and Iron Bank. As an open-source project that is growing in popularity, Sigstore currently has over 2,000 GitHub Stars and the project has over 2.25 million log entries. Today, there are over 1,100 active members on the public Slack channel, and many who regularly attend the weekly Sigstore community meetings.

## A Short History Leading to Sigstore

In response to a man-in-the-middle attack through a misissued wildcard HTTPS certificate for google.com, Ben Laurie wrote on Google’s approach to mitigate this issue going forward through certificate transparency. In 2014, he published “[Certificate Transparency](https://certificate.transparency.dev/)” in ACM’s _Queue_ about the approach, which was in active development. With certificate transparency, certificates could be public and verifiable through append-only logs. Out of this work came the [Certificate Transparency](Certificate Transparency) project — an ecosystem to support making website certificate issuance more transparent and verifiable.  

In 2015, the [Verifiable Data Structures](https://github.com/google/trillian/blob/master/docs/papers/VerifiableDataStructures.pdf) white paper was written by a team at Google (Adam Eijdenberg, Ben Laurie, and Al Cutter). This effort extended and generalized the ideas put forth by Laurie in his Certificate Transparency paper of 2014. The white paper discusses Verifiable Logs, Verifiable Maps, and Verifiable Log Backed Maps as data structures and provides the example of a Verifiable Database that leverages a Verifiable Log and a Verifiable Map. The Trillian project is an implementation of the ideas put forth in this white paper. 

A transparent, scalable, and cryptographically verifiable data store, [Trillian](https://trillian.im/) implements a Merkle tree and can therefore cryptographically prove that a given record is in the log and also that the log has not been tampered with. A tampered log would be changed or have something deleted since a previous point in time. Trillian’s contents are served from a data storage layer which enables its high scalability to very large trees. As an append-only log, Trillian is similar in technology to a blockchain. Developed at Google, Trillian was open-sourced in 2016. As Sigstore’s signature transparency log, Rekor requires running instances of Trillian's log server and signer, and relies on a database backend. If you ran your own Rekor instance in the previous chapter, you will have set up Trillian as part of that process. 

In addition to informing Trillian and Sigstore, Certificate Transparency supported the development of other transparency projects. Notably, [Binary Transparency for Firefox](https://wiki.mozilla.org/Security/Binary_Transparency), which was published by Mozilla in 2017. This piggybacked off of existing Certificate Transparency logs and enabled third parties to verify that all Firefox binaries are public and that the same version was distributed to everyone without them having been compromised by some malicious actor. Built upon Firefox’s Binary Transparency was the project [rget](https://github.com/merklecounty/rget#rget), developed for general binary transparency. Created by Brandon Phillips in 2019, the project was archived in 2020, and a later project, [tl](https://github.com/transparencylog/tl), was sunset in 2021. 

The transparency log work fed into the Rekor project which began in mid-2020. Luke Hinds, Bob Callaway, and Dan Lorenc are the co-founders of the Sigstore project, which launched in March 2021 with Rekor, Fulcio, and Cosign. The 1.0 version of Cosign was released on July 28, 2021, and general availability of Sigstore is imminent. 

## Relevant Research

* [Software Distribution Transparency and Auditability](https://arxiv.org/abs/1711.07278)
* [Contour: A Practical System for Binary Transparency](https://arxiv.org/abs/1712.08427)
* [Reproducible Builds: Break a log, good things come in trees](https://bora.uib.no/bora-xmlui/handle/1956/20411)
* [Dependency Issues: Solving the World's Open-Source Software Security Problem](https://warontherocks.com/2022/05/dependency-issues-solving-the-worlds-open-source-software-security-problem/)

Review also the [Software Supply-Chain Security Reading List](https://github.com/chainguard-dev/ssc-reading-list). 

## Resources for Learning More

Sigstore is a living open source project that is in active development with an engaged community. There are a number of places where you can look for updated information about Sigstore.

The [Sigstore GitHub organization](https://github.com/sigstore/) with its relevant libraries for [Cosign](https://github.com/sigstore/cosign), [Fulcio](https://github.com/sigstore/fulcio), and [Rekor](https://github.com/sigstore/rekor) serve as a living source of truth for the Sigstore project and its components. The [Sigstore YouTube Channel](https://www.youtube.com/channel/UCWPVc8glVGOODxsA_ep0VVws) offers community talks and demos in addition to weekly community meetings. The [Sigstore Blog](https://blog.sigstore.dev/) also offers frequent posts about new changes, announcements, and technical overviews of Sigstore.

If you would like more of a background about software supply chain security more generally, you can refer to the resources available through the [Software Supply-Chain Security Reading List](https://github.com/chainguard-dev/ssc-reading-list). If you are interested in how Sigstore relates to different programming language communities, you can join the relevant language channels on the [Sigstore Slack](https://join.slack.com/t/sigstore/shared_invite/zt-mhs55zh0-XmY3bcfWn4XEyMqUUutbUQ). If you are interested in Python, you may review Dustin Ingram’s PyCon talk on [Securing the Open Source Software Supply Chain](https://www.youtube.com/watch?v=i1QqhGsbX6Y) and review the [sigstore/sigstore-python](https://github.com/sigstore/sigstore-python) repository. Ruby developers may be interested in learning more about [signing gems](https://docs.ruby-lang.org/en/2.1.0/Gem/Security.html) and reviewing the [sigstore/ruby-sigstore](https://github.com/sigstore/ruby-sigstore) repository. The Java community holds a regular [Sigstore Java](https://docs.google.com/document/d/1R7mL-IUrc2Z_LuOIvwDWshVuPQS_2VNE_cIQx4Oy5zw/edit) meeting.

Sigstore is increasingly being adopted by Cloud Native Computing Foundation (CNCF) projects, including [Kubernetes as of their 1.24 release](https://kubernetes.io/blog/2022/05/03/kubernetes-1-24-release-announcement/), [Harbor as of their 2.5.0 release](https://goharbor.io/blog/cosign-2.5.0/), and [Flux as of their 0.26 Security Docs release](https://fluxcd.io/blog/2022/02/security-image-provenance/). This wide adoption has implications for DevOps engineers and the larger supply chain around software artifacts, their provenance, and the ability for them to be verified. 

You can also take the Linux Foundation [LFS182x: Securing Your Software Supply Chain with Sigstore](https://learning.edx.org/course/course-v1:LinuxFoundationX+LFS182x+2T2022/home), which is free on the edX platform, with a paid certificate option. 