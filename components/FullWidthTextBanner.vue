<!-- eslint-disable vue/no-v-html -->
<template>
    <section class="h-screen bg-pastel-orange">
        <div class="flex items-center justify-center h-full">
            <div class="container inner">
                <h3 v-animate-on-scroll class="delay-step_1 mb-8">{{header}}</h3>
                <div v-animate-on-scroll class="subheading delay-step_3 mb-8" v-html="$md.render(text)"></div>

                <div v-if="ctaButtons" v-animate-on-scroll class="delay-step_5">
                    <!-- ctas need to be this data; {name: 'outlineButton', title: 'Find out more', link: 'https://sigstore.dev/story', style: 'outlined'} -->
                    <div v-for="(ctaButton, index) in ctaButtons" :key="index">
                        <component :is="`${ctaStyle}`" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="js">
export default {

    components: {

    },

    props: {
        header: { type: String, default: null },
        subHeading: { type: String, default: null },
        text: { type: String, default: null },
        isQuote: { type: Boolean, default: false },
        textWidth: { type: String, default: null }
    },

    data: () => ({
    }),

    computed: {
        backgroundColour(){
            return `background: ${this.bgColour};`;
        }
    },

    mounted() {
    },

    methods: {
    }

};
</script>
<!--eslint-enable-->