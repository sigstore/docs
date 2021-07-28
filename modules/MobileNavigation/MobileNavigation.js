import GitHubLogo from "@/assets/icons/github.svg?inline"
import TwitterLogo from "@/assets/icons/twitter.svg?inline"
import Logo from "@/assets/icons/logo.svg?inline";
import NavButton from "@/assets/icons/menu-button.svg?inline"
import NavCloseButton from "@/assets/icons/menu-button-close.svg?inline"
import { mapGetters } from "vuex";
export default {
    components: {
        GitHubLogo,
        TwitterLogo,
        NavButton,
        Logo,
        NavCloseButton
    },
    props: {
        navType: { type: String, default: null },
        navList: { type: Array, default: null },
        socialLinks: { type: Array, default: null },
        scrolled: { type: Boolean, default: false },
        navState: { type: Boolean, default: false }
    },
    computed: mapGetters({
        bg: 'settings/bg',
        text: 'settings/textColor'
    }),
    methods:{
        closeNavDrawer() {
            this.$nuxt.$emit('openNavigation',false);
        },
    }
};
