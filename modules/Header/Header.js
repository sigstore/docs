import Navigation from "@/modules/Navigation/Navigation.vue";
import MobileNavigation from "@/modules/MobileNavigation/MobileNavigation.vue";
import Logo from "@/assets/icons/logo.svg?inline";
import NavButton from "@/assets/icons/menu-button.svg?inline"
import NavCloseButton from "@/assets/icons/menu-button-close.svg?inline"
import Headroom from "headroom.js";
import { mapGetters } from "vuex";

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

    computed: mapGetters({
        bg: 'settings/bg'
    }),

    props: {
        navigation: Array,
        socialLinks: Array
    },

    methods: {
        openNavDrawer() {
            this.navOpen = !this.navOpen;
            console.log('nav open');
        },
        initHeadroom(){
            const headerRef = this.$refs.header;
            // const header = document.querySelector(headerRef);
            const headroom = new Headroom(headerRef);
            headroom.init();
        },
        startsWith(classlist, name) {
            console.log(classlist.lastIndexOf(name, 0) === 1)
            // return classlist.lastIndexOf(name, 0) === 0;
        },
        getBgColour() {
            const rootBgColourEl = document.getElementsByClassName("text_banner")[0]
            const bgC = rootBgColourEl.dataset.bgColor;
            // console.log(bgC);
            this.backgroundC = bgC;
        }
    },

    mounted() {
        window.addEventListener("scroll", this.getScrollPos)
        this.initHeadroom();
        this.getBgColour();
        this.$nextTick(() => {
            this.getBgColour();
        });
    },

    updated(){
        this.getBgColour();
        this.$nextTick(() => {
            this.getBgColour();
        });
    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.getScrollPos)
    },

};
