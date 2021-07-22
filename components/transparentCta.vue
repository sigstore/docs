<template>
    <a v-if="ctaData" class="button cta_transparent items-center text-purple-dark p-14 text-12 rounded-full" :href="ctaData.link">
        <img v-if="ctaData" class="w-20 mr-14 inline-block" :src="ctaData.ctaicon" alt="Cta icon" />
        <span class="w-4/5">{{ ctaData.title }}</span>
    </a>
</template>
<script>

export default{
    props: {
        slug: { type: String, default: null },
        internalCta: {
            type: Object,
            default: null
        }
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
            this.internalCta != null ? this.ctaData = this.internalCta : this.ctaData = cta;
        },
    }
}
</script>

