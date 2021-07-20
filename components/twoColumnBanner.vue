<template>
    <section :style="backgroundColour" class="py-80 md:py-160">
        <div class="lg:flex justify-between container inner" :class="[textAlignment != 'textRight' ? 'items-center' : 'items-start']">
            <div v-animate-on-scroll class="w-full md:w-1/2 step-delay_2 md:mr-80">
                <h2 class="text-36 leading-32 mb-32" :class="[!bgColour ? 'text-purple-dark' : 'text-white']">{{header}}</h2>
                <div v-if="textAlignment != 'textRight'" :class="[!bgColour ? 'text-purple-dark' : 'text-white']" class="mt-8" v-html="$md.render(text)"></div>
            </div>
            <div v-if="!card" v-animate-on-scroll class="w-full md:w-1/2 step-delay_5">
                <div v-if="textAlignment != 'textRight'"><img :src="imageAsset" /></div>
                <div v-else v-html="$md.render(text)"></div>
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