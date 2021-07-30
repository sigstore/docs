<template>
    <section class="py-32 bg-white" data-header-text="text-gray-dark">
        <div class="container inner">
            <div v-animate-on-scroll class="delay-step_3">
                <div class="flex items-center justify-center">
                    <img class="md:w-122 w-55 mr-20" src="/img/googlelogo.png" alt="Google sponsor logo" />
                    <img class="md:w-122 w-55 mr-20" src="/img/linuxfoundationlogo.png" alt="Linux Foundation sponsor logo" />
                    <img class="md:w-122 w-55 mr-20" src="/img/redhatlogo.png" alt="RedHat sponsor logo" />
                    <img class="md:w-122 w-55 mr-20" src="/img/purdueunilogo.png" alt="Purdue University sponsor logo" />
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="js">
// import LinkButton from "@/assets/icons/link.svg";
export default {

    components: {
        // LinkButton
    },

    data: () => ({
        articlesArray: {
            type: Array,
            default: null
        }
    }),

    computed: {
    },

    created() {
    },

    methods: {
    },

};
</script>