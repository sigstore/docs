# Sigstore Docs

This repo contains the Sigstore documentation, which is hosted at [docs.sigstore.dev](https://docs.sigstore.dev/).

If you are looking for the frontend development of the [Sigstore website](https://www.sigstore.dev/), please visit the [sigstore-website](https://github.com/sigstore/sigstore-website) repo. 

## Contributing

We welcome contributions on the docs site!

### Pull Request Process

1. Please first discuss the change you wish to make via an [issue](https://github.com/sigstore/docs/issues).
2. Fork the `docs` repository to your own GitHub account and clone it locally.
3. Hack on your changes.
4. Write a meaningful commit message (and sign your commit). Review the [commit message guidelines](https://github.com/sigstore/sigstore-website/blob/main/CONTRIBUTORS.md#commit-message-guidelines).
5. Ensure that CI passes, if it fails, fix the failures. If you are making many commits into one PR, please [squash your commits](https://github.com/sigstore/sigstore-website/blob/main/CONTRIBUTORS.md#squash-commits).
6. Every pull request requires a review from the [core sigstore-website team](https://github.com/orgs/github.com/sigstore/teams/codeowners-sigstore-website) before merging.

## Setup

First, [install Hugo](https://gohugo.io/installation/) following the instructions for your platform.

Clone this repository and navigate to its directory.

Install dependencies:

```bash
npm install
```

## Development Server

You can run the development server with:

```bash
npm run start
```

If needed, you can also build the site locally:

```bash
npm run build
```

## Site Information

This site is built using the [Hugo static site generator](https://gohugo.io/) and the [Doks theme](https://getdoks.org/).

Modifications have been made to the theme templates to change the landing page from the Doks default, to make section bundles more useful to visitors, and to give an option to display simplified titles in the sidebar.

Full text search is provided by [FlexSearch](https://github.com/nextapps-de/flexsearch).

## Common Tasks

To change the order of pages on the site, edit the `weight` variable in the front matter of individual pages. A smaller number means the page will appear first in the sidebar and in section bundles. 

To change the order of sections of content, refer to the `weight` variable in the `_index.html` file within the folder for that section. These `_index.html` files also enable you to change the names of sections.

Both a `title` and `menuTitle` variable can be set in front matter. If a `menuTitle` variable is set, that text will be used in the left sidebar and on section bundles. If only a `title` is set, that text will be used for both the on-page title and in menus. The `menuTitle` variable should be used to shorten long page titles.

The Doks theme provides additional functionality for linting and checking scripts that may be useful:

[Doks Commands](https://getdoks.org/docs/overview/commands/)



