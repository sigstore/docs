<template>
    <a v-if="ctaData" class="button cta_transparent flex items-center text-purple-dark p-14 text-12 rounded-full" :href="ctaData.link">
        <img v-if="ctaData" class="w-20 mr-14 inline-block" :src="ctaData.ctaicon+`?inline`" alt="Cta icon" />
        {{ ctaData.title }}
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
<style lang="scss">
.cta_transparent{
    &:hover{
        svg {
            path {
                fill: white;
            }
        }
    }
}
</style>

