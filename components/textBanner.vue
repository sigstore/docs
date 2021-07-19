<!-- eslint-disable vue/no-v-html -->
<template>
    <section :style="backgroundColour" class="overflow-auto" :class="[isScreenHeight ? 'min-h-screen h-screen' : 'h-auto py-128']">
        <div class="flex items-center justify-center h-full">
            <div class="container inner relative" :class="[showSupportedBy ? 'min-h-bannerInner' : '',`text-${textAlign}`]">
                <h1 v-if="header" v-animate-on-scroll :class="[textColour]" class="delay-step_1 mb-30 text-gray-dark">{{header}}</h1>
                <div v-animate-on-scroll :class="[textColour]" class="subheading text-24 delay-step_3 mb-26 text-gray-dark" v-html="$md.render(text)"></div>

                <div v-if="ctaButtons" v-animate-on-scroll class="delay-step_5">
                    <!-- ctas need to be this data; {name: 'outlineButton', title: 'Find out more', link: 'https://sigstore.dev/story', style: 'outlined'} -->
                    <div v-for="(ctaButton, index) in ctaButtons" :key="index" :class="[textAlign == 'center' ? 'flex justify-center items-center' : 'flex justify-start items-center']">
                        <component :is="`${ctaStyle}`" v-bind="[{'slug': ctaButton}]" />
                    </div>
                </div>

                <div v-if="showSupportedBy" v-animate-on-scroll class="delay-step_5 md:mt-140">
                    <p>Supported by</p>
                </div>
            </div>
            <div v-if="showStatsBanner" v-animate-on-scroll class="delay-step_5 container absolute bottom-0 left-0 inner">
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
        showSupportedBy: {
            type: Boolean,
            default: false
        },
        showStatsBanner: {
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