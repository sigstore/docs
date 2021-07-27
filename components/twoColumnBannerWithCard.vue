<template>
    <section 
    :class="[backgroundColour]" 
    class="py-64 md:py-160" 
    :data-header-text="[(backgroundColour === 'bg-purple-dark') ? 'text-white' : (backgroundColour === 'bg-pastel-blue') ? 'text-purple-dark' : 'text-gray-dark']"
    >
        <div class="lg:flex justify-between container inner" :class="[textAlignment != 'textRight' ? 'items-start' : 'items-start']">
            <div v-animate-on-scroll class="w-full lg:w-1/2 step-delay_1 md:mr-80">
                <h2 class="text-36 leading-32 mb-64 md:mb-32" :class="[!bgColour ? 'text-purple-dark' : 'text-purple-dark']">{{header}}</h2>
                <div v-if="textAlignment != 'textRight'" :class="[!bgColour ? 'text-purple-dark' : 'text-white']" class="md:mt-8 mb-64 md:mb-32" v-html="$md.render(text)"></div>
            </div>
            <div v-if="!card" v-animate-on-scroll class="w-full lg:w-1/2 step-delay_5">
                <div v-if="textAlignment != 'textRight'"><img :src="imageAsset" /></div>
                <div v-else class="markdown" v-html="$md.render(text)"></div>
            </div>
        </div>
        <div class="container container--card">
            <div class="rounded-xl md:bg-white p-0 md:p-32 lg:p-64 mt-64 md:mt-128 w-full mx-auto px-24 md:px-0">
                <div class="w-full lg:w-1/2 p-32 md:p-0 bg-white md:bg-transparent md:rounded-none rounded-xl">
                    <h4 class="text-36 leading-32 mb-28">{{ cardTitle }}</h4>
                    <div v-html="$md.render(cardText)"></div>
                </div>
                <div class="lg:flex items-start justify-between md:-ml-10 md:-mr-10 mt-32 md:mt-64">
                    <div v-animate-on-scroll class="delay-step_1 mb-32 md:mb-16 w-full md:w-1/3 md:px-10 p-32 md:p-0 bg-white md:bg-transparent md:rounded-none rounded-xl md:max-w-315">
                        <img :src="column1.imageAsset" class="mb-24" />
                        <h4 class="mb-24 text-24">{{column1.header}}</h4>
                        <p>{{column1.text}}</p>
                    </div>
                    <div v-animate-on-scroll class="delay-step_2 mb-32 md:mb-16 w-full md:w-1/3 md:px-10 p-32 md:p-0 bg-white md:bg-transparent md:rounded-none rounded-xl md:max-w-315">
                        <img :src="column2.imageAsset" class="mb-24" />
                        <h4 class="mb-24 text-24">{{column2.header}}</h4>
                        <p>{{column2.text}}</p>
                    </div>
                    <div v-animate-on-scroll class="delay-step_3 mb-0 md:mb-16 w-full md:w-1/3 md:px-10 p-32 md:p-0 bg-white md:bg-transparent md:rounded-none rounded-xl md:max-w-315">
                        <img :src="column3.imageAsset" class="mb-24" />
                        <h4 class="mb-24 text-24">{{column3.header}}</h4>
                        <p>{{column3.text}}</p>
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
        text: { type: String, default: null },
        imageAsset: { type: String, default: null },
        alignment: { type: String, default: null },
        bgColour: { type: String, default: null },
        card: { type: Object, default: null },
        cardTitle: { type: String, default: null },
        cardText: { type: String, default: null },
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
            return `${this.bgColour}`;
        },
        textAlignment() {
            return this.alignment;
        }
    },

    mounted() {
    },

    methods: {
    }

};
</script>