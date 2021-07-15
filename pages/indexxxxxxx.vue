<template>
  <div>
    {{entry.title}}
    {{entry}}
  </div>
</template>

<script>

export default {
  async asyncData({ $content }) {
    const home = await $content('home')
      .fetch();

    return {
      home
    };
  },
  head() {
      return {
        title: this.title,
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
          { hid: 'description', name: 'description', content: '' },
          { name: 'format-detection', content: 'telephone=no' },
          // Twitter Card
        {
          name: "twitter:card",
          content:
            ""
        },
        { name: "twitter:title", content: "Home" },
        {
          name: "twitter:description",
          content:
            ""
        },
        // image must be an absolute path
        {
          name: "twitter:image",
          content:
            ""
        },
        // Facebook OpenGraph
        { property: "og:title", content: "Home" },
        {
          property: "og:site_name",
          content: process.env.VUE_APP_SITENAME
        },
        { property: "og:type", content: "website" },
        {
          property: "og:image",
          content:
            ""
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
      }
  },
  computed: {
    title(){
      return this.entry.title;
    }
  },
  // apollo: {
  //   entry: {
  //     prefetch: true,
  //     query: HOME_QUERY
  //   }
  // },
  mounted() {
  }
}
</script>
