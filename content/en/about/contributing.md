---
type: docs
category: About sigstore
description: Intro text
title: Contributing
weight: 20
---

## Contributing as a developer

To contribute to Sigstore as a developer, check out the following repositories for developer information on the various Sigstore projects:

- [Cosign](https://github.com/sigstore/cosign)
- [Rekor](https://github.com/sigstore/rekor)
- [Fulcio](https://github.com/sigstore/fulcio)

### Sigstore clients

* Go:
    * [sigstore/sigstore-go](https://github.com/sigstore/sigstore-go)
    * [sigstore/sigstore](https://github.com/sigstore/sigstore)
    * [Sigstore Go meeting notes](https://docs.google.com/document/d/1EcJIhqSS9E86cHAQXaXiu2_r1s0kNbHz4uLLwwGo-vw/edit)
* Python: 
    * [sigstore/sigstore-python](https://github.com/sigstore/sigstore-python)
* Java and Maven:
    * [sigstore/java](https://github.com/sigstore/sigstore-java)
    * [sigstore/sigstore-maven](https://github.com/sigstore/sigstore-maven)
    * [sigstore/sigstore-maven-plugin](https://github.com/sigstore/sigstore-maven-plugin)
    * [Sigstore Java meeting notes](https://docs.google.com/document/d/1R7mL-IUrc2Z_LuOIvwDWshVuPQS_2VNE_cIQx4Oy5zw/edit)
* JavaScript: [sigstore/sigstore-js](https://github.com/sigstore/sigstore-js)
* Rust: [sigstore/sigstore-rs](https://github.com/sigstore/sigstore-rs)
* Ruby: [sigstore/ruby-sigstore](https://github.com/sigstore/ruby-sigstore)

## Contributing to the documentation

This covers a few basics to get you started. It covers pointers for writing clear, consistent technical documentation, some tips and tricks you can use in Nuxt, to sigstore community policies on changing and reviewing content.

### Technical writing

There’s plenty of good style guides for writing technical documentation. [Microsoft’s Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/) or [Google's developer documentation](https://developers.google.com/style) are two of the most mature and well established guides, and these are especially useful to turn to when you’ve got a decision to make that might become convention. The most important thing though, especially as your documentation resources grow, is to follow your nose, discuss any decisions that might create consistency rules and keep track of the results, and do a little contextual review of what’s already been published to check for consistency.

### Tips

- Always write like you’re onboarding a new colleague. You want to help them get up to speed. Prioritise your points and be action-focused, cut anything that’s not really necessary, and provide as much cross-linking as you can - this’ll help keep your reader knowing what to pay attention to, and provides just enough information at the right time without robbing them of the chance to learn more.

- It’s good to scope out the beginning, middle and end of what each resource will be before you start writing - it’s easy for a quick guide to become a rambling tangent. Take good stock of what content might be living in the same area as this one, and always include links to build up your internal architecture.

- Give a quick pass over any similar type of resource to see what kind of layout conventions you should leverage to keep things consistent and easy to understand. Best practice is to imagine you’re onboarding a new colleague. Respect their time, be friendly but direct, and focus on the end goal together.

- Using insets, alert banners and callouts help make each page a little more visually interesting, which helps a reader engage with, follow and understand what you’re writing about.

- Always check your assumptions. It’s easy to assume your reader knows exactly what you do. But that’s not always the case. Be careful writing about anything that might require more context, embed links in passing if it’ll help. If you’re introducing something difficult for the first time, state it, explain it as simply as you can, and then move to its application using consistent language - don’t be tempted to start using variations or introducing more tangents than is absolutely critical.

### Website content

#### Overview

As website content grows, matures and adapts, it can be tricky to keep the content’s style and tone of voice consistent. This is crucial in making things feel they’ve been written by one single author, which helps create trust and authority, and keeps the user experience streamlined. Here’s a few pointers to help guide your changes:

- Write like you’re onboarding a new colleague. You want to help them get up to speed. Prioritise your points and be action-focused, cut anything that’s not really necessary. Be friendly but direct, and focus on the end goal together.

- Who’s your audience? They’re a wide mix of readers with different levels of know-how. Good, accessible website content tends to keep things simple and more entry level rather than diving straight in at the deep end.

- Branded terms. Sigstore, Cosign, Fulcio, Rekor, and Gitsign are title case. Meanwhile, `policy-controller` is all lower-case with a hyphen. Keeping these consistent establishes the branding and can prevent confusion.

- Compare similar content before making new changes. This will help pick out things like syntax and grammar, which should help you know what conventions to follow and keep things consistent.

- Let the context do some of the work. A sentence doesn’t have to overwork or spell out every single subtext. You can let the surrounding parts do their job to carry the weight, and that way you keep things simple.

- Read things out loud! Does something you’ve written sound like what you’d expect from a regular conversation? Aim for this - website content lands best when it matches your reader’s inner monologue and expected patterns of speech.

- The more prominent something is in design, the more risky it is to change. That’s because their impact is partly down to what the words mean, and partly about their visual, subtle impact. Only change these if it’s absolutely crucial.

- Always check your assumptions. It’s easy to assume your reader knows exactly what you do. If you’re introducing something difficult for the first time, state it, explain it as simply as you can, and then move to its application using consistent language.

- And above all, be consistent. This applies both to the words you use, and the way you use them - so things like grammar and formatting, whether you capitalise a word or not, etc.

### Working with Nuxt

The Nuxt documentation is a great first stop for anyone new to writing technical documentation, or anyone interested in what Nuxt supports. All their guidance for writing, fetching and displaying content can be found here. It’s quick to pick up, and essential for transforming markdown files and raw text into well designed, readable guides and resources anyone can pick up.

Resource: https://content.nuxtjs.org/

## Community
The [sigstore/community](https://github.com/sigstore/community/) repository contains the most up-to-date information about how to get involved with the Sigstore project and its community.
In this repository you can find our [code of conduct](https://github.com/sigstore/community/blob/main/CODE_OF_CONDUCT.md) and our [contributing guidelines](https://github.com/sigstore/community/blob/main/CONTRIBUTING.md).

## Mailing list

We use a [public mailing list group](https://groups.google.com/g/sigstore-dev) for communications. Anyone interested in contributing, discussing, or meeting the Sigstore community is invited to join the group.

Docs and other calendar invites may be shared directly with this group, so please join this before requesting access to anything that appears private.

## Slack

You can also keep in touch by joining our [Slack channel](https://sigstore.slack.com). Use [this invite link](https://links.sigstore.dev/slack-invite) to join.
