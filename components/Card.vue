<template>
    <section>
        {{heading}}
        {{text}}
        {{bgColour}}
        {{alignment}}
        {{imageAsset}}
        {{cta}}
    </section>
</template>
<script lang="js">
export default {

    components: {

    },

    props: {
        heading: { type: String, default: null },
        text: { type: String, default: null },
        imageAsset: { type: String, default: null },
        alignment: { type: String, default: null },
        bgColour: { type: String, default: null },
        cta: { type: Object, default: null },
    },

    data: () => ({
    }),

    mounted() {
    },

    methods: {
    }

};
</script>