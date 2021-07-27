<template>
  <div>
    <component :is="section.type" v-for="(section, index) in page.sections" :key="index" v-bind="section" /> 
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  components: {

  },

  async asyncData({ $content, params }) {
    const slug = params.slug || "home";
    const page = await $content(slug)
      .fetch();

    return {
      page
    };
  },
  data () {
    return {
      animation: ''
    }
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
  },
  computed: {

  },

  mounted(){
    const firstBanner = this.page.sections.filter(p => p.type === 'textBanner')[0]
    const textBannerCards = this.page.sections.filter(p => p.type === 'textBannerWithcards')
    if(firstBanner){
      this.setColour(firstBanner.bgColour);
    } else {
      this.setColour(textBannerCards[0].bgColour);
    }
  },

  methods: {
    ...mapActions("settings", ["setColour"])
  }
};
</script>
