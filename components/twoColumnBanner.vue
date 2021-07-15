<template>
    <section :style="backgroundColour" class="py-44 px-16">
        <div class="flex items-center justify-center container inner">
            <div v-animate-on-scroll class="w-full md:w-1/2 step-delay_2 pr-32">
                <h2 :class="[!bgColour ? 'text-purple-dark' : 'text-white']">{{header}}</h2>
                <div :class="[!bgColour ? 'text-purple-dark' : 'text-white']" class="mt-8"><p>{{text}}</p></div>
            </div>
            <div v-if="!card" v-animate-on-scroll class="w-full md:w-1/2 step-delay_5">
                <div><img :src="imageAsset" /></div>
            </div>
            <div v-else>
                {{card}}
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
        }
    },

    mounted() {
    },

    methods: {
    }

};
</script>