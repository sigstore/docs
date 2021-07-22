import Navigation from "@/modules/Navigation/Navigation.vue";
import MobileNavigation from "@/modules/MobileNavigation/MobileNavigation.vue";
import Logo from "@/assets/icons/logo.svg?inline";
import NavButton from "@/assets/icons/menu-button.svg?inline"
import NavCloseButton from "@/assets/icons/menu-button-close.svg?inline"

export default {

    components: {
        Navigation,
        MobileNavigation,
        Logo,
        NavButton,
        NavCloseButton
    },
    data: () => ({
        globalHeader: null,
        globalHeaderMenu: null,
        scrollPos: '',
        isScrolling: false,
        navOpen: {
            type: Boolean,
            default: false
        }
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
        socialLinks: Array
    },

    methods: {
        getScrollPos() {
            // if(window.scrollY > this.scrollCheck){
            //   this.isScrolling = true;
            //   this.scrollPos = window.scrollY;
            // } else {
            //   this.isScrolling = false;
            // }
        },
        openNavDrawer() {
            this.navOpen = !this.navOpen;
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
