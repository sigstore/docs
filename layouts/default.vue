<template>
  <div>
    <Header />
    <Nuxt />
    <Footer />
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
    isScrolling: false
  }),

  computed: {
		scrollPosX() {
			return window.scrollY;
		},
	},

  mounted() {
    window.addEventListener("scroll", this.getScrollPos)
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
    }
  },

}
</script>