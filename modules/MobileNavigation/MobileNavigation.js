import GitHubLogo from "@/assets/icons/github.svg?inline"
import TwitterLogo from "@/assets/icons/twitter.svg?inline"
export default {
    components: {
        GitHubLogo,
        TwitterLogo
    },
    props: {
        navType: { type: String, default: null },
        navList: { type: Array, default: null },
        socialLinks: { type: Array, default: null },
        scrolled: { type: Boolean, default: false }
    },
};
