<template>
  <div v-if="loading">
      loading...
  </div>
  <div v-else>
    <Header :navigation="headerNavLinks" />
        <main>
            <Nuxt />
        </main>
    <Footer :navigation="footerNavLinks" />
  </div>
</template>

<script>
import Header from "@/modules/Header/Header.vue"
import Footer from "@/modules/Footer/Footer.vue"

export default {
  name: "MainLayout",
  components: {
    Header,
    Footer
  },
  data: () => ({
    scrollPos: '',
    isScrolling: false,
    loading: false,
    headerNavLinks: null,
    footerNavLinks: null
  }),

  computed: {
		scrollPosX() {
			return window.scrollY;
		},
	},

  mounted() {
    window.addEventListener("scroll", this.getScrollPos)
    this.getGlobalHeader();
    this.getGlobalFooter();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.getScrollPos)
  },

  methods: {
    getScrollPos() {
      if(window.scrollY > 0){
        this.isScrolling = true;
        this.scrollPos = window.scrollY;
      } else {
        this.isScrolling = false;
      }
    },
    async getGlobalHeader(){
        const globalData = await this.$content('header').fetch()
        this.headerNavLinks = globalData[0].menu;
    },
    async getGlobalFooter(){
        const globalData = await this.$content('footer').fetch()
        this.footerNavLinks = globalData[0].footerMenu;
    }
  },

}
</script>