---
title: Home
date: 2021-07-12T15:33:03.264Z
description: Homepage
thumbnail: /img/icon.png
sections:
  - ctaStyle: solidCtaPurple
    showSupportedBy: true
    text: Making sure your software’s what it claims to be.
    header: A new standard for signing, verifying  and protecting software
    showStatsBanner: true
    bgColour: bg-pastel-orange
    ctaButtons: []
    textAlign: left
    textColour: text-gray-dark
    type: textBanner
    showBetaCard: true
  - type: twoColumnBanner
    header: The problem with open source security
    imageAsset: /img/problemwithopensource_update.svg
    text: Not knowing where all your software comes from means hard-to-spot risks to
      the integrity of your services. Without constant identity checks and
      safety protocols for keys and secrets, open source dependencies can open
      the door to breaches, exploits and supply chain attacks.
    bgColour: bg-purple-dark
    alignment: imageRight
    ctaButtons: []
    ctaStyle: transparentCta
  - alignment: textRight
    cardTitle: What makes sigstore different?
    text: sigstore was started to improve supply chain technology for anyone using
      open source projects. It's for open source maintainers, by open source
      maintainers.
    header: Our vision
    bgColour: bg-pastel-blue
    imageAsset: ""
    textBottom: And it's a direct response to today’s challenges, a work in progress
      for a future where the integrity of what we build and use is up to
      standard.
    type: twoColumnBannerWithCard
    column1:
      header: Automatic key management
      imageAsset: /img/keys.svg
      text: We use Cosign to generate the key pairs needed to sign and verify
        artifacts, automating as much as possible so there’s no risk of losing
        or leaking them.
    column2:
      header: Transparent ledger technology
      imageAsset: /img/ledger.svg
      text: A transparency log means anyone can find and verify signatures, and check
        whether someone’s changed the source code, the build platform or the
        artifact repository.
    cardText: We’ve automated how you digitally sign and check components, for a
      safer chain of custody tracing software back to the source. We want to
      remove the effort, time and risk of error this usually comes with. And for
      anyone whose software depends on open source, future integrations can make
      it easier to check for authenticity, wherever it’s come from.
    column3:
      header: Driven by our community
      imageAsset: /img/community.svg
      text: Everyone involved in sigstore believes in an open, transparent and
        accountable future for open source software. Everything we do comes from
        that shared vision.
  - type: sigstoreDivider
    showSigstoreDivider: true
  - alignment: imageRight
    cardTitle: How can you use it?
    text: >-
      sigstore is a set of tools developers, software maintainers, package
      managers and security experts can benefit from. Bringing together
      free-to-use open source technologies like Fulcio, Cosign and Rekor, it
      handles digital signing, verification and checks for provenance needed to
      make it safer to distribute and use open source software.


      **A standardized approach** 


      This means that open source software uploaded for distribution has a stricter, more standardized way of checking who’s been involved, that it hasn’t been tampered with. There’s no risk of key compromise, so third parties can’t hijack a release and slip in something malicious.
    header: How sigstore works
    bgColour: bg-white
    imageAsset: /img/system_architecture_summary-01.svg
    textBottom: >-
       **Building for future integrations** 


      With the help of a working partnership that includes Google, the Linux Foundation, Red Hat and Purdue University, we’re in constant collaboration to find new ways to improve the sigstore technology, to make it easy to adopt, integrate and become a long-lasting standard.
    type: twoColumnBannerWithCard
    column1:
      header: Sign code
      imageAsset: /img/howtouseit_signcode.svg
      text: Easy authentication and smart cryptography work in the background. Just
        push your code.
    column2:
      header: Verify signatures
      imageAsset: /img/howtouseit_verify.svg
      text: A transparency log stores data like who created something and how, so you
        know it hasn’t been changed.
    cardText: ""
    column3:
      header: Monitor activity
      imageAsset: /img/howtouseit_monitor.svg
      text: Logged data is readily auditable, for future monitors and integrations to
        build into your security workflow.
  - type: sigstoreDivider
    showSigstoreDivider: true
  - type: carousel
    header: Image Gallery
    carouselCaseItems:
      - bleeping-computer
      - google
      - kpack
      - red-hat
      - wired
  - type: sigstoreDivider
    showSigstoreDivider: true
  - type: newsEvents
    isNewsAndEvents: true
  - ctaStyle: transparentCta
    text: Help build a safer future with us.
    header: ""
    bgColour: bg-purple-dark
    ctaButtons:
      - view-the-project
    textAlign: center
    textColour: text-white
    type: textBanner
    isScreenHeight: false
---

Yes
