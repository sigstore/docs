<template>
    <section class="py-80 md:py-160" 
    :class="[backgroundColour]" 
    :data-header-text="[(backgroundColour === 'bg-purple-dark') ? 'text-white' : (backgroundColour === 'bg-pastel-blue') ? 'text-purple-dark' : 'text-gray-dark']"
    >
        <div class="md:flex justify-between container inner" :class="[textAlignment != 'textRight' ? 'items-center' : 'items-start']">
            <div v-animate-on-scroll class="w-full md:w-1/2 step-delay_1 md:mr-80 md:order-1 order-2">
                <h2 class="text-24 leading-23 md:leading-32 mb-32" :class="[!bgColour ? 'text-purple-dark' : 'text-white']">{{header}}</h2>
                <div v-if="textAlignment != 'textRight'" :class="[!bgColour ? 'text-purple-dark' : 'text-white']" class="mt-8 md:block hidden" v-html="$md.render(text)"></div>
                <div v-if="textAlignment != 'textRight'" class="block md:hidden"><img :alt="`${header} image`" :src="imageAsset" /></div>
            </div>
            <div v-if="!card" v-animate-on-scroll class="w-full md:w-1/2 step-delay_2 mt-32 md:mt-0 md:order-2">
                <div v-if="textAlignment != 'textRight'" class="md:block hidden"><img :alt="`${header} image`" :src="imageAsset" /></div>
                <div v-else v-html="$md.render(text)"></div>
                <div v-if="textAlignment != 'textRight'" :class="[!bgColour ? 'text-purple-dark' : 'text-white']" class="mt-8 block md:hidden" v-html="$md.render(text)"></div>
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