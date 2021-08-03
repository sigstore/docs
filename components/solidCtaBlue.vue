<template>
    <a v-if="ctaData" class="button cta-solid-blue bg-purple-light flex flex-row justify-between items-center text-white" :href="'#'">
        <img v-if="ctaData" class="w-1/5 mr-5" :src="ctaData.ctaicon" alt="Cta icon" />
        {{ ctaData.title }}
    </a>
</template>
<script>

export default{
    props: {
        slug: { type: String, default: null },
    },
    data: () => ({
        ctaData: null
    }),
    created() {
        this.getCtaData();
    },
    methods: {
        async getCtaData(){
            const globalData = await this.$content('ctas').fetch();
            const cta = globalData.find(cta => cta.slug === this.slug);
            this.ctaData = cta;
        },
    }
}
</script>
<style lang="scss">
.cta-solid-blue{
    color: white;
    border: 1px solid #6349FF;
    background-color: #6349FF;
}
</style>

