<template>
    <section>
        {{heading}}
        {{text}}
        {{bgColour}}
        {{textAlign}}
        <div v-if="names.length">
            <!-- ctas need to be this data; {name: 'outlineButton', title: 'Find out more', link: 'https://sigstore.dev/story', style: 'outlined'} -->
            <div v-for="(index, name) in names" :key="index">
                {{name}}
            </div>
        </div>
        <component :is="cta.name"></component>
    </section>
</template>
<script lang="js">
export default {

    components: {

    },

    props: {
        heading: { type: String, default: null },
        text: { type: String, default: null },
        names: { type: Array, default: null },
        cta: { type: Object, default: null },
        bgColour: { type: String, default: null },
    },

    data: () => ({
    }),

    mounted() {
    },

    methods: {
    }

};
</script>