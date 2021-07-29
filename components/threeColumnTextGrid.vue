<template>
    <section class="py-64 md:py-128 px-16 bg-white" data-header-text="text-gray-dark">
        <div class="container">
            <div class="md:max-w-1/2 w-full">
                <h3 class="pb-64" :class="[$route.params.slug === 'community' ? 'text-orange-dark' : 'text-purple-dark']">{{ header }}</h3>
                <div v-if="text" v-animate-on-scroll class="delay-step_3 pb-64 text-gray-dark" v-html="$md.render(text)"></div>
            </div>
            <div class="md:flex items-start justify-between md:-ml-30 md:-mr-30">
                <div 
                v-if="column1.header" 
                :style="`background-color: ${column1.bgColour};`"
                :class="[column1.isCardStyle ? 'rounded-xl px-40 py-40 md:min-h-440' : 'md:px-10']" 
                class="w-full md:w-1/3 md:max-w-352 md:ml-30 mb-44">
                    <img :src="column1.imageAsset" class="mb-24" />
                    <h4 class="mb-24 text-24 leading-32" :class="[$route.params.slug === 'community' ? 'text-orange-dark' : 'text-purple-dark']">{{column1.header}}</h4>
                    <p class="text-gray-dark">{{column1.text}}</p>
                    <a v-if="column1.ctaLink" class="pt-24 flex items-center h text-12 md:text-16 inline--button-grey" :href="column1.ctaLink">
                        {{column1.ctaText}}
                        <span class="ml-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 3H21V9" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 14L21 3" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </a>
                </div>
                <div 
                v-if="column2.header" 
                :style="`background-color: ${column1.bgColour};`"
                :class="[column2.isCardStyle ? 'rounded-xl px-40 py-40 md:min-h-440' : 'md:px-10 ']"  
                class="w-full md:w-1/3 md:max-w-352 md:ml-30 mb-44">
                    <img :src="column2.imageAsset" class="mb-24" />
                    <h4 class="mb-24 text-24 leading-32" :class="[$route.params.slug === 'community' ? 'text-orange-dark' : 'text-purple-dark']">{{column2.header}}</h4>
                    <p class="text-gray-dark">{{column2.text}}</p>
                    <a v-if="column2.ctaLink" class="pt-24 flex items-center h text-12 md:text-16 inline--button-grey" :href="column2.ctaLink">
                        {{column2.ctaText}}
                        <span class="ml-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 3H21V9" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 14L21 3" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </a>
                </div>
                <div
                v-if="column3.header" 
                :style="`background-color: ${column1.bgColour};`"
                :class="[column3.isCardStyle ? 'rounded-xl px-40 py-40 md:min-h-440' : 'md:px-10 ']"  
                class="mb-8 w-full md:w-1/3 md:max-w-352 md:ml-30 md:mr-30">
                    <img :src="column3.imageAsset" class="mb-24" />
                    <h4 class="mb-24 text-24 leading-32" :class="[$route.params.slug === 'community' ? 'text-orange-dark' : 'text-purple-dark']">{{column3.header}}</h4>
                    <p class="text-gray-dark">{{column3.text}}</p>
                    <a v-if="column3.ctaLink" class="pt-24 flex items-center h text-12 md:text-16 inline--button-grey" :href="column3.ctaLink">
                        {{column3.ctaText}}
                        <span class="ml-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 3H21V9" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 14L21 3" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </a>
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
        header: {
            type: String,
            default: null
        },
        text: {
            type: String,
            default: null
        },
        column1: {
            type: Object,
            default: null
        },
        column2: {
            type: Object,
            default: null
        },
        column3: {
            type: Object,
            default: null
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
        console.log(this.$nuxt)
    },

    methods: {
    }

};
</script>