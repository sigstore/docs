<template>
    <section class="py-64 md:py-128 px-16 bg-white" data-header-text="text-gray-dark">
        <div class="container">
            <div class="max-w-440 w-full">
                <h3 class="pb-64">{{ header }}</h3>
                <div v-if="text" v-animate-on-scroll class="delay-step_3 pb-64 text-gray-dark" v-html="$md.render(text)"></div>
            </div>
            <div class="md:flex items-start justify-between md:-ml-30 md:-mr-30">
                <div 
                v-animate-on-scroll
                :style="`background-color: ${column1.bgColour};`"
                :class="[column1.isCardStyle ? 'rounded-xl px-40 py-40' : '']" 
                class="delay-step_1 mb-8 w-full md:w-1/3 px-10 md:max-w-352 md:ml-30 mb-24">
                    <img :src="column1.imageAsset" class="mb-24" />
                    <h4 class="mb-24 text-24">{{column1.header}}</h4>
                    <p>{{column1.text}}</p>
                </div>
                <div 
                v-animate-on-scroll
                :style="`background-color: ${column1.bgColour};`"
                :class="[column1.isCardStyle ? 'rounded-xl px-40 py-40' : '']"  
                class="delay-step_3 mb-8 w-full md:w-1/3 px-10 md:max-w-352 md:ml-30 mb-24">
                    <img :src="column2.imageAsset" class="mb-24" />
                    <h4 class="mb-24 text-24">{{column2.header}}</h4>
                    <p>{{column2.text}}</p>
                </div>
                <div 
                v-animate-on-scroll
                :style="`background-color: ${column1.bgColour};`"
                :class="[column1.isCardStyle ? 'rounded-xl px-40 py-40' : '']"  
                class="delay-step_5 mb-8 w-full md:w-1/3 px-10 md:max-w-352 md:ml-30 md:mr-30">
                    <img :src="column3.imageAsset" class="mb-24" />
                    <h4 class="mb-24 text-24">{{column3.header}}</h4>
                    <p>{{column3.text}}</p>
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
    },

    methods: {
    }

};
</script>