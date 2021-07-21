<template>
    <section class="py-32 bg-white">
        <div class="container inner">
            <div v-animate-on-scroll class="delay-step_5">
                <div class="flex items-center justify-center overflow-scroll lg:overflow-unset">
                    <img class="max-w-122 mr-20" src="/img/googlelogo.png" alt="Google sponsor logo" />
                    <img class="max-w-122 mr-20" src="/img/linuxfoundationlogo.png" alt="Linux Foundation sponsor logo" />
                    <img class="max-w-122 mr-20" src="/img/redhatlogo.png" alt="RedHat sponsor logo" />
                    <img class="max-w-122 mr-20" src="/img/purdueunilogo.png" alt="Purdue University sponsor logo" />
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