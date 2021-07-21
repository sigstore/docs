---
title: Home
date: 2021-07-12T15:33:03.264Z
description: Homepage
thumbnail: /img/icon.png
sections:
  - ctaStyle: solidCtaPurple
    showSupportedBy: true
    text: Making sure your software’s what it says it is.
    header: A new standard for signing, verifying  and protecting software
    showStatsBanner: true
    bgColour: "#ffead7"
    ctaButtons: []
    textAlign: left
    textColour: text-dark-purple
    type: textBanner
    showBetaCard: true
  - type: twoColumnBanner
    header: The problem with  open source security
    imageAsset: /img/problemwithopensource.svg
    text: >-
      Not knowing where all your software comes from presents hard to spot risks
      to the integrity of your services.


      Most of today’s commercial programs, critical software and key infrastructure use open source software, linked together in a  supply chain - the map of relationships existing in a piece of software. It’s everything your software needs to work. The more complex and critical the software, the more relationships exist, and there might be hundreds of open source dependencies in just one project.


      But a high percentage of that code is insecure. Without foolproof ways to verify where all your software came from, open source dependencies open the door for breaches, supply chain attacks and exploits.
    bgColour: "#2a1e71"
    alignment: imageRight
    ctaButtons: []
    ctaStyle: transparentCta
  - alignment: textRight
    cardTitle: What makes sigstore different?
    text: >-
      #### sigstore was started to improve supply chain technology for anyone
      using open source projects. It’s for open source maintainers, by open
      source maintainers.


      ####   It’s a direct response to today’s challenges, a work in progress towards a future where the integrity of what we build and use is up to standard.
    header: Our Vision
    bgColour: "#ddeff1"
    imageAsset: ""
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
    cardText: We’ve focused on automating the process of digitally signing and
      checking components, for a safer chain of custody tracing open source
      software back to the source. We want to remove the effort, time and risk
      of error this usually comes with. And for anyone whose software depends on
      open source, future integrations can make it easier to check your software
      for authenticity, wherever it’s come from.
    column3:
      header: Driven by community
      imageAsset: /img/community.svg
      text: Everyone involved in sigstore believes in an open, transparent and
        accountable future for open source software. Everything we do comes from
        that shared vision.
  - alignment: imageRight
    cardTitle: How can you use it?
    text: >-
      sigstore is a set of tools developers, software maintainers,  package
      managers and security experts can benefit from. Bringing together
      free-to-use open source technologies like Fulcio, Cosign and Rekor, we’re
      building ways to handle digital signing, verification and checks for
      provenance needed to make it safer to distribute and use open source
      software.   \


      **A standardized approach** 

      This means that open source software uploaded for distribution has a stricter, more standardized way of checking who’s been involved, that it hasn’t been tampered with. There’s no risk of key compromise, so third parties can’t hijack a release and slip in something malicious. \


      **Building for future integrations** 

      With the help of a working partnership that includes Google, the Linux Foundation, Red Hat and Purdue University, we’re in constant collaboration to find new ways to improve the sigstore technology, to make it easy to adopt, integrate and become a long-lasting standard.
    header: How sigstore works
    bgColour: ""
    imageAsset: /img/simplesystemarchitecture.svg
    type: twoColumnBannerWithCard
    column1:
      header: Sign your code
      imageAsset: /img/howtouseit_signcode.svg
      text: Easy authentication and smart cryptography work in the background. Just
        push your code, sigstore can handle the rest.
    column2:
      header: Verify signatures
      imageAsset: /img/howtouseit_verify.svg
      text: Rekor transparency logs store unique identification like who created it
        and where it was built, so you know it hasn’t been changed.
    cardText: ""
    column3:
      header: Monitor activity
      imageAsset: /img/howtouseit_monitor.svg
      text: Data stored in the logs is readily auditable, a foundation for future
        monitors and integrations to build into your security workflow.
  - type: carousel
    header: Image Gallery
    carouselCaseItems:
      - bleeping-computer
      - google
      - kpack
      - red-hat
      - wired
  - type: newsEvents
    isNewsAndEvents: true
  - ctaStyle: transparentCta
    text: Step into a safer future with us.
    header: ""
    bgColour: "#2a1e71"
    ctaButtons:
      - view-the-project
    textAlign: center
    textColour: text-white
    type: textBanner
    isScreenHeight: false
---

Yes
