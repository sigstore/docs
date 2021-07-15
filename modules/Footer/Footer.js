import Navigation from "@/modules/Navigation/Navigation.vue"
import Logo from "@/assets/icons/logo.svg?inline"
export default {

    components: {
        Navigation,
        Logo
    },
    data: () => ({
        globalFooter: null
    }),

    computed: {

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
    },

    mounted() {
    }

};
