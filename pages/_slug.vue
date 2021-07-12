<template>
  <div>
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
    <nuxt-content class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto" :document="page"/>
  </div>
</template>

<script>

export default {

  async asyncData({ $content, params }) {
    const slug = params.slug || "index";
    const page = await $content(slug)
      .fetch();

    return {
      page
    };
  },
  head() {
      return this.page ? {
        title: this.page.title,
        titleTemplate: "%s · " + process.env.VUE_APP_SITENAME,
        script: [
          { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
          {
            json: {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${process.env.VUE_APP_FRONTEND + this.$route.path}`
              },
              headline: `Home`,
              url: `${process.env.VUE_APP_FRONTEND + this.$route.path}`
            },
            type: "application/ld+json"
          }
        ],
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: this.page.description },
          { name: 'format-detection', content: 'telephone=no' },
          // Twitter Card
        {
          name: "twitter:card",
          content: process.env.VUE_APP_SITENAME
        },
        { name: "twitter:title", content: this.page.title },
        {
          name: "twitter:description",
          content: this.page.description
        },
        // image must be an absolute path
        {
          name: "twitter:image",
          content: this.page.description
        },
        // Facebook OpenGraph
        { property: "og:title", content: this.page.title },
        {
          property: "og:site_name",
          content: process.env.VUE_APP_SITENAME
        },
        { property: "og:type", content: "website" },
        {
          property: "og:image",
          content: ''
        },
        {
          property: "og:description",
          content:
            ""
        }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          {
            rel: "canonical",
            href: `${process.env.VUE_APP_FRONTEND + this.$route.path}`
          }
        ]
      } : null
  }
};
</script>
