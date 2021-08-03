<!-- eslint-disable -->
<template>
    <section class="py-128 bg-white" data-header-text="text-gray-dark">
        <div v-if="story.textBlock" class="md:flex justify-between items-start container inner">
            <div v-animate-on-scroll class="w-full md:w-1/2 step-delay_1">
                <h2 class="text-36 leading-32 mb-32 text-gray-dark">{{story.header}}</h2>
            </div>
            <div v-animate-on-scroll class="w-full md:w-1/2 step-delay_2">
                <div class="text-gray-dark markdown" v-html="$md.render(story.textBlock)"></div>
            </div>
        </div>
        <div v-if="story.releaseDate" class="md:flex justify-center items-start container inner py-128">
            <div class="rounded-xl bg-orange-medium p-40 md:max-w-500">
                <div 
                    class="text-center text-orange-dark markdown"
                    v-html="$md.render(story.releaseDate)"
                >
                </div>
                <div class="flex justify-center mt-24">
                    <Cta :internalCta="ctaInfo" />
                </div>
            </div>
        </div>
        <div class="text-gray-dark container inner text-center">
            <h3 class="text-36 pb-128">Plans &amp; next steps</h3>
            <div v-for="(step, index) in dates.step" :key="index" class="pb-120 dotted--divider relative">
                <p class="h text-16 text-gray-dark mb-16">{{ step.date == Date.now() ? 'Now' : step.date }}</p>
                <p class="h text-24 text-purple-dark mb-16">{{ step.title }}</p>
                <div 
                    class="text-center text-gray-dark markdown"
                    v-html="$md.render(step.text)"
                />
            </div>
            <div class="flex justify-center mt-24">
                <Cta class="border-2 border-black" :internalCta="ctaInfoEmail" />
            </div>
        </div>
    </section>
</template>
<script lang="js">
import Cta from '@/components/transparentCta.vue'
export default {

    components: {
        Cta
    },

    data: () => ({
        story: {
            type: Object,
            default: null
        },
        dates: {
            type: Object,
            default: null
        },
        ctaInfo: {
            type: Object,
            default: null
        },
        ctaInfoEmail: {
            type: Object,
            default: null
        }
    }),

    computed: {
    },

    created() {
        this.getStoryContent();
        this.getCtaData();
    },

    methods: {
        async getStoryContent(){
            const storyData = await this.$content('story').fetch();
            const info = storyData.filter(story => story.slug === 'info');
            const dates = storyData.filter(story => story.slug === 'dates');
            this.story = info[0];
            this.dates = dates[0];
        },
        async getCtaData(){
            const globalData = await this.$content('ctas').fetch();
            const cta = globalData.find(cta => cta.slug === 'view-the-project');
            const emailCta = globalData.find(cta => cta.slug === 'if-youre-interested-lets-talk');
            this.ctaInfo = cta;
            this.ctaInfoEmail = emailCta;
        },
    },

};
</script>
<!-- eslint-enable -->