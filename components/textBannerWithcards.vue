<!-- eslint-disable vue/no-v-html -->
<template>
    <section 
    class="text_banner md:flex justify-center items-center" 
    :class="[backgroundColour,isScreenHeight ? 'min-h-screen md:flex-col' : 'h-auto py-128']"
    :data-header-text="[(backgroundColour === 'bg-purple-dark') ? 'text-white' : (backgroundColour === 'bg-pastel-blue') ? 'text-purple-dark' : 'text-gray-dark']"
    >
        <div class="flex items-center justify-center pt-128 md:pt-30" :class="[showSupportedBy ? 'text_banner--main' : '']">
            <div class="container inner relative" :class="[showSupportedBy ? 'md:h-180' : '',textAlign === 'center' ? 'text-left md:text-center' : 'text-left']">
                <h1 v-if="header" v-animate-on-scroll :class="[textColour]" class="delay-step_1 mb-30 text-gray-dark">{{header}}</h1>
                <div 
                v-animate-on-scroll 
                :class="[textAlign == 'center' ? 'md:max-w-690 w-full mx-auto' : null,textColour]" 
                class="subheading text-24 delay-step_3 mb-26 text-gray-dark" 
                v-html="$md.render(text)"
                >
                </div>
            </div>
        </div>
        <div class="container container--card">
            <div class="p-0 md:p-32 lg:p-128 w-full mx-auto px-24 md:px-0">
                <div class="md:flex items-start justify-between md:-ml-30 md:-mr-30 mt-32 md:mt-64">
                    <div class="px-30 w-full md:w-1/2">
                        <div class="mb-32 md:mb-16 w-full p-32 md:p-32 rounded-xl border border-white text-white md:min-h-320">
                            <img v-if="card1.imageAsset" :src="card1.imageAsset" :alt="`${card1.header} image`" class="mb-24" />
                            <h4 class="mb-24 text-24">{{card1.header}}</h4>
                            <div class="markdown" v-html="$md.render(card1.text)"></div>
                            <a v-if="card1.ctaLink" class="pt-64 flex items-center h text-12 md:text-16 inline--button-white" :href="card1.ctaLink">
                                {{card1.ctaText}}
                                <span class="ml-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M15 3H21V9" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 14L21 3" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                    <div class="px-30 w-full md:w-1/2">
                        <div class="mb-32 md:mb-16 w-full p-32 md:p-32 rounded-xl border border-white text-white md:min-h-320">
                            <img v-if="card2.imageAsset" :src="card2.imageAsset" :alt="`${card2.header} image`" class="mb-24" />
                            <h4 class="mb-24 text-24">{{card2.header}}</h4>
                            <div class="markdown" v-html="$md.render(card2.text)"></div>
                            <a v-if="card2.ctaLink" class="pt-64 flex items-center h text-12 md:text-16 inline--button-white" :href="card2.ctaLink">
                                {{card2.ctaText}}
                                <span class="ml-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M15 3H21V9" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 14L21 3" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
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
        showSupportedBy: {
            type: Boolean,
            default: true
        },
        isScreenHeight: {
            type: Boolean,
            default: true
        },
        card1: {
            type: Object,
            default: null
        },
        card2: {
            type: Object,
            default: null
        },
    },

    data: () => ({
        commits: {
            type: Number,
            default: 0
        },
        members: {
            type: Number,
            default: 0
        },
        orgs: {
            type: Number,
            default: 0
        },  
    }),

    computed: {
        backgroundColour(){
            return `${this.bgColour}`;
        }
    },

    mounted() {
    },

    methods: {
    }

};
</script>
<style lang="scss">
.text_banner{
    &--main{
        height: 100vh;
    }
}
</style>
<!-- eslint-enable -->