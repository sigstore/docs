import Navigation from "@/modules/Navigation/Navigation.vue"
import Logo from "@/assets/icons/logo.svg?inline"
import gql from 'graphql-tag'

const NAV_QUERY = gql`
    query NAV_QUERY {
        globalSet(handle: "header") {
            name
            ... on header_GlobalSet {
            id
            name
            navList {
                ... on navList_navItem_BlockType {
                id
                navLink {
                    ... on howSigstoreWorks_howSigstoreWorks_Entry {
                    id
                    url
                    uri
                    slug
                    }
                    ... on testimonials_testimonials_Entry {
                    id
                    url
                    uri
                    slug
                    }
                    ... on home_home_Entry {
                    id
                    url
                    uri
                    slug
                    }
                }
                navTitle
                }
            }
            }
        }
    }
`;
export default {

    components: {
        Navigation,
        Logo
    },
    data: () => ({
        globalHeader: null,
        globalHeaderMenu: null
    }),

    computed: {

    },

    watch: {
        $route() {

        }
    },

    props: {
        navigation: Array,
    },

    methods: {
    },

    apollo: {
        globalSet: {
          prefetch: true,
          query: NAV_QUERY
        }
    },

    mounted() {
    }

};
