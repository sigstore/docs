<!-- eslint-disable vue/no-v-html -->
<template>
    <section :style="backgroundColour" :class="[isScreenHeight ? 'min-h-screen h-screen' : 'h-auto py-32']">
        <div class="flex items-center justify-center h-full">
            <div class="container inner relative" :class="`text-${textAlign}`">
                <h1 v-animate-on-scroll :class="[textColour]" class="delay-step_1 mb-8">{{header}}</h1>
                <div v-animate-on-scroll :class="[textColour]" class="subheading text-24 delay-step_3 mb-8" v-html="$md.render(text)"></div>

                <div v-if="ctaButtons" v-animate-on-scroll class="delay-step_5">
                    <!-- ctas need to be this data; {name: 'outlineButton', title: 'Find out more', link: 'https://sigstore.dev/story', style: 'outlined'} -->
                    <div v-for="(ctaButton, index) in ctaButtons" :key="index" :class="[textAlign == 'center' ? 'flex justify-center items-center' : 'flex justify-start items-center']">
                        <component :is="`${ctaStyle}`" v-bind="[{'slug': ctaButton}]" />
                    </div>
                </div>

                <div v-if="showBetaCard" v-animate-on-scroll class="delay-step_5 container absolute bottom-0 left-0 inner">
                    <BetaCard />
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="js">
/* eslint camelcase : ["error", {ignoreDestructuring:false}] */
export default {
    components: {
    },
    props: {
        header: { type: String, default: null },
        text: { type: String, default: null },
        useCta: Boolean,
        ctaButtons: { type: Array, default: null },
        ctaStyle: { type: String, default: 'solidCtaPurple' },
        bgColour: { type: String, default: null },
        textAlign: { type: String, default: null },
        textColour: { type: String, default: null },
        isScreenHeight: {
            type: Boolean,
            default: true
        },
        showBetaCard: {
            type: Boolean,
            default: false
        }
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
<!-- eslint-enable -->