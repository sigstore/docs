import Navigation from "@/modules/Navigation/Navigation.vue"
import Logo from "@/assets/icons/logo.svg?inline"

export default {

    components: {
        Navigation,
        Logo
    },
    data: () => ({
        globalHeader: null,
        globalHeaderMenu: null,
        scrollPos: '',
        isScrolling: false
    }),

    computed: {
        scrollCheck() {
            return 150;
        }
    },

    watch: {
        $route() {

        }
    },

    props: {
        navigation: Array,
    },

    methods: {
        getScrollPos() {
            if(window.scrollY > this.scrollCheck){
              this.isScrolling = true;
              this.scrollPos = window.scrollY;
            } else {
              this.isScrolling = false;
            }
        }
    },

    mounted() {
        window.addEventListener("scroll", this.getScrollPos)
    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.getScrollPos)
    },

};
