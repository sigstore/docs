import Navigation from "@/modules/Navigation/Navigation.vue"
import gql from 'graphql-tag'

const NAV_QUERY = gql`
    query NAV_QUERY {
        globalSet(handle: "footer") {
            name
            ... on footer_GlobalSet {
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
        Navigation
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
    },

    methods: {
        async getGlobalFooter(){
            const globalData = await this.$content('footer').fetch()
            this.globalFooter = globalData[0].footerMenu;
        }
    },

    apollo: {
        globalSet: {
          prefetch: true,
          query: NAV_QUERY
        }
    },

    mounted() {
        this.getGlobalFooter();
    }

};
