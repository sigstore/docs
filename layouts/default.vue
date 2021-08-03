<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div v-if="loading">
      loading...
  </div>
  <div v-else>
    <Header :navigation="headerNavLinks" :socialLinks="footerSocialLinks" />
        <main>
            <Nuxt />
        </main>
    <Footer :navigation="footerNavLinks" :socialLinks="footerSocialLinks" />
    <transition name="fade" :duration="{ enter: 500, leave: 500 }">
        <MobileNavigation 
            v-show="mobileNavOpen"
            :navState="mobileNavOpen"  
            nav-type="header" 
            :social-links="footerSocialLinks" 
            :nav-list="headerNavLinks" 
        />
    </transition>
  </div>
</template>

<script>
import Header from "@/modules/Header/Header.vue"
import Footer from "@/modules/Footer/Footer.vue"
import MobileNavigation from "@/modules/MobileNavigation/MobileNavigation.vue";

export default {
  name: "MainLayout",
  components: {
    Header,
    Footer,
    MobileNavigation
  },

    filters: {
        capitalize (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    data: () => ({
        scrollPos: '',
        isScrolling: false,
        loading: false,
        headerNavLinks: null,
        footerNavLinks: null,
        footerSocialLinks: null,
        observer: undefined,
        commits: null,
        orgs: null,
        members: null,
        bgColourMain: null,
        mobileNavOpen: false
    }),

    computed: {
		scrollPosX() {
			return window.scrollY;
		},
	},

    watch: {
        '$route'(to, from) {
            this.$nuxt.$emit('openNavigation',false);
        }
    },

    mounted() {
        window.addEventListener("scroll", this.getScrollPos)
        this.getGlobalHeader();
        this.getGlobalFooter();
        this.getGlobalSocialLinks();

        this.observer = new IntersectionObserver((entries) => {
            this.$nuxt.$emit("observer.observed", entries);
        });

        this.$nuxt.$emit("observer.created", this.observer);

        this.$nuxt.$on('openNavigation', (payload) => {
            this.mobileNavOpen = payload
        })

        

    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.getScrollPos)
        this.$nuxt.$off('openNavigation')
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
        },
        async getGlobalSocialLinks(){
            const globalData = await this.$content('setup').fetch()
            this.footerSocialLinks = globalData.filter(d => d.slug === 'connect')[0].links;                     
        }
    },

}
</script>
<!-- eslint-enable -->