import Navigation from "@/modules/Navigation/Navigation.vue";
import Logo from "@/assets/icons/logo.svg?inline";
import NavButton from "@/assets/icons/menu-button.svg?inline"

export default {

    components: {
        Navigation,
        Logo,
        NavButton
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
        },
        openNavDrawer() {
            console.log('nav open');
        }
    },

    mounted() {
        window.addEventListener("scroll", this.getScrollPos)
    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.getScrollPos)
    },

};
