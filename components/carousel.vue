<!-- eslint-disable -->
<template>
    <section class="py-64 md:py-128">
        <Slider :slideData="slideData" />
    </section>
</template>
<script lang="js">
import Slider from "@/components/Slider.vue";
export default {

    components: {
        Slider
    },

    props: {
        carouselCaseItems: { 
            type: Array, default: null 
        },
    },

    data: () => ({
        carouselCaseStudies: {
            type: Array,
            default: null
        }
    }),

    computed: {
        slideData() {
            let data = null;
            if(this.carouselCaseStudies.length > 0) {
                data = this.carouselCaseStudies;
            }
            return data;
        }
    },

    created() {
        this.getCarouselCaseStudies();
    },

    methods: {
        async getCarouselCaseStudies(){
            const globalData = await this.$content('caseStudies').fetch();
            const cases = globalData.filter(g => this.carouselCaseItems.includes(g.slug)).map(g => g);
            this.carouselCaseStudies = cases;
        },
    },

};
</script>
<!-- eslint-enable -->