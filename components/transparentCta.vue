<template>
    <a v-if="ctaData" class="button cta_transparent flex flex-row justify-between items-center text-purple-dark p-14 text-12 rounded-full" :href="ctaData.link">
        <img v-if="ctaData" class="w-1/5 mr-14" :src="ctaData.ctaicon" alt="Cta icon" />
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
.cta{
    &_transparent {

        background-color: white;
        color: black;
        padding: 2rem;

    }
}
</style>

