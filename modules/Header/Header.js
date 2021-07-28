import Navigation from "@/modules/Navigation/Navigation.vue";
import Logo from "@/assets/icons/logo.svg?inline";
import NavButton from "@/assets/icons/menu-button.svg?inline"
import NavCloseButton from "@/assets/icons/menu-button-close.svg?inline"
import Headroom from "headroom.js";
import { mapGetters } from "vuex";

export default {

    components: {
        Navigation,
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
        bg: 'settings/bg',
        text: 'settings/textColor'
    }),

    props: {
        navigation: Array,
        socialLinks: Array
    },

    methods: {
        openNavDrawer() {
            this.$nuxt.$emit('openNavigation', true);
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
        }
    },

    mounted() {
        window.addEventListener("scroll", this.getScrollPos)
        this.initHeadroom();
    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.getScrollPos)
    },

};
