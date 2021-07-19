<template>
    <section :style="backgroundColour" class="py-80 md:py-160">
        <div class="flex justify-between container inner" :class="[textAlignment != 'textRight' ? 'items-start' : 'items-start']">
            <div v-animate-on-scroll class="w-full md:w-1/2 step-delay_2 md:mr-80">
                <h2 class="text-36 leading-32 mb-32" :class="[!bgColour ? 'text-purple-dark' : 'text-purple-dark']">{{header}}</h2>
                <div v-if="textAlignment != 'textRight'" :class="[!bgColour ? 'text-purple-dark' : 'text-white']" class="mt-8" v-html="$md.render(text)"></div>
            </div>
            <div v-if="!card" v-animate-on-scroll class="w-full md:w-1/2 step-delay_5">
                <div v-if="textAlignment != 'textRight'"><img :src="imageAsset" /></div>
                <div v-else v-html="$md.render(text)"></div>
            </div>
        </div>
        <div class="container">
            <div class="rounded-md bg-white md:p-64 md:mt-128 w-full mx-auto">
                <div class="w-full md:w-1/2">
                    <h4 class="text-36 leading-32 mb-28">{{ cardTitle }}</h4>
                    <div v-html="$md.render(cardText)"></div>
                </div>
                <div class="flex items-start justify-between -ml-10 -mr-10 mt-64">
                    <div v-animate-on-scroll class="delay-step_1 mb-16 w-full md:w-1/3 px-10 max-w-315">
                        <img :src="column1.imageAsset" class="mb-16" />
                        <h4 class="mb-16 text-24">{{column1.header}}</h4>
                        <p>{{column1.text}}</p>
                    </div>
                    <div v-animate-on-scroll class="delay-step_3 mb-16 w-full md:w-1/3 px-10 max-w-315">
                        <img :src="column2.imageAsset" class="mb-16" />
                        <h4 class="mb-16 text-24">{{column2.header}}</h4>
                        <p>{{column2.text}}</p>
                    </div>
                    <div v-animate-on-scroll class="delay-step_5 mb-8 w-full md:w-1/3 px-10 max-w-315">
                        <img :src="column2.imageAsset" class="mb-16" />
                        <h4 class="mb-16 text-24">{{column3.header}}</h4>
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
            return `background: ${this.bgColour};`;
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