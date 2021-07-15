<template>
    <section class="py-32 px-16 bg-white">
        <div class="container inner">
            <div class="flex items-start justify-center -ml-10 -mr-10">
                <div v-animate-on-scroll class="delay-step_1 mb-8 w-full md:w-1/3 px-10">
                    <img :src="column1.imageAsset" class="mb-6" />
                    <h4 class="mb-6">{{column1.header}}</h4>
                    <p>{{column1.text}}</p>
                </div>
                <div v-animate-on-scroll class="delay-step_3 mb-8 w-full md:w-1/3 px-10">
                    <img :src="column2.imageAsset" class="mb-6" />
                    <h4 class="mb-6">{{column2.header}}</h4>
                    <p>{{column2.text}}</p>
                </div>
                <div v-animate-on-scroll class="delay-step_5 mb-8 w-full md:w-1/3 px-10">
                    <img :src="column2.imageAsset" class="mb-6" />
                    <h4 class="mb-6">{{column3.header}}</h4>
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