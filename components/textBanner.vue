<!-- eslint-disable vue/no-v-html -->
<template>
    <section>
        <div
        ref="textBanner" 
        class="text_banner md:flex justify-center items-center relative" 
        :class="[backgroundColour,isScreenHeight ? 'min-h-screen md:flex-col' : 'h-auto py-128']"
        :data-header-text="[(backgroundColour === 'bg-purple-dark') ? 'text-white' : (backgroundColour === 'bg-pastel-blue') ? 'text-purple-dark' : 'text-gray-dark']"
        :data-bg-color="backgroundColour"
        >
            <div class="flex items-center justify-center" :class="[showSupportedBy ? 'text_banner--main' : null, isScreenHeight ? 'h-screen' : 'h-auto' ]">
                <div class="container inner relative" :class="[showSupportedBy ? 'md:h-180' : null,textAlign === 'center' ? 'text-left md:text-center' : 'text-left']">
                    <h1 v-if="header" v-animate-on-scroll :class="[textColour]" class="delay-step_1 mb-30 ">{{header}}</h1>
                    <h2 :class="[textAlign == 'center' ? 'md:max-w-690 w-full mx-auto' : null,textColour]" class="subheading md:text-24 delay-step_3 mb-26">{{text}}</h2>
                    <!-- <div 
                    v-animate-on-scroll 
                    :class="[textAlign == 'center' ? 'md:max-w-690 w-full mx-auto' : null,textColour]" 
                    class="subheading text-24 delay-step_3 mb-26 " 
                    v-html="$md.render(text)"
                    >
                    </div> -->

                    <div v-if="ctaButtons" v-animate-on-scroll class="delay-step_5">
                        <!-- ctas need to be this data; {name: 'outlineButton', title: 'Find out more', link: 'https://sigstore.dev/story', style: 'outlined'} -->
                        <div v-for="(ctaButton, index) in ctaButtons" :key="index" :class="[textAlign == 'center' ? 'flex justify-center items-center' : 'flex justify-start items-center']">
                            <component :is="`${ctaStyle}`" v-bind="[{'slug': ctaButton}]" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showSupportedBy" class="absolute bottom-0 mb-24 w-full">
                <div class="container inner">
                    <p class="h mb-16 text-gray-dark">In collaboration with </p>
                    <div class="flex items-center justify-start overflow-scroll lg:overflow-unset">
                        <img class="md:w-122 w-55 mr-20" src="/img/googlelogo.png" alt="Google sponsor logo" />
                        <img class="md:w-122 w-55 mr-20" src="/img/linuxfoundationlogo.png" alt="Linux Foundation sponsor logo" />
                        <img class="md:w-122 w-55 mr-20" src="/img/redhatlogo.png" alt="RedHat sponsor logo" />
                        <img class="md:w-122 w-55 mr-20" src="/img/purdueunilogo.png" alt="Purdue University sponsor logo" />
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-pastel-orange w-full">
            <div v-if="showStatsBanner" v-animate-on-scroll class="delay-step_4 container container--card relative lg:py-64">
                <div class="lg:flex flex-wrap items-center justify-between bg-orange-medium py-50 px-20 lg:p-64 stat_banner">
                    <div class="w-full md:w-full lg:w-1/2 lg:max-w-440">
                        <div class="flex items-center justify-start">
                            <div class="pr-24">
                                <h2 class="text-33 lg:text-54 text-orange-dark mb-14 lg:mb-16">+{{ info.commits }}</h2>
                                <h4 class="h4 text-orange-dark uppercase">Commits</h4>
                            </div>
                            <div class="pr-24">
                                <h2 class="text-33 lg:text-54 text-orange-dark mb-14 lg:mb-16">+{{ info.members }}</h2>
                                <h4 class="h4 text-orange-dark uppercase">Members</h4>
                            </div>
                            <div class="pr-24">
                                <h2 class="text-33 lg:text-54 text-orange-dark mb-14 lg:mb-16">+{{ info.organizations }}</h2>
                                <h4 class="h4 text-orange-dark uppercase">Organisations</h4>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-full lg:w-1/2 lg:max-w-470 mt-28">
                        <div class="bg-white rounded-full p-28 text-gray-dark flex items-center justify-around">
                            <p class="h text-11 md:text-12 pr-22 md:w-auto w-1/2">Currently in beta<br>Stable release due in August 2021</p>
                            <a href="https://github.com/sigstore" target="_blank" class="button button--transparent-border md:w-auto w-1/2">Find out more</a>
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
        info: {
            type: Object,
            default: null
        } 
    }),

    computed: {
        backgroundColour(){
            return `${this.bgColour}`;
        }
    },

    created() {
        if(this.showStatsBanner){
            this.getGlobalStats();
        }
        console.log(this.$refs)
    },

    methods: {
        async getGlobalStats(){
            const globalData = await this.$content('setup').fetch()
            const t = globalData.reduce((info, g) => {
                if (g.slug === 'info') info = g;
                return info;
            }, {});  
            this.info = t;                      
        }
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