<!-- eslint-disable -->
<template>
    <section class="py-64 bg-pastel-blue" data-header-text="text-purple-dark">
        <div class="text-gray-dark container inner text-center">
            <h3 class="text-36 pb-64">Frequently asked questions</h3>
            <article 
                v-if="faqs.length > 0" 
                v-for="(faq, index) in faqs" 
                :key="index"
                class="rounded-md p-24 bg-white mb-24 text-left md:w-832 w-full mx-auto cursor-pointer"
                @click="activeFaq = index"
                :class="[activeFaq == index ? 'slideDown' : 'slideUp']"
            >
                <div class="flex justify-between items-center">
                    <p class="font-bold" :class="[activeFaq == index ? 'pb-24' : null]">{{ faq.question }}</p>
                    <span class="transition" :class="[activeFaq == index ? 'transform rotate-180' : 'transform rotate-0']"><chevron /></span>
                </div>
                <div v-if="activeFaq == index" class="markdown" v-html="$md.render(faq.answer)"></div>
            </article>
        </div>
    </section>
</template>
<script lang="js">
import chevron from '@/assets/icons/chevron_down.svg?inline';
export default {

    components: {
        chevron
    },

    data: () => ({
        faqs: {
            type: Array,
            default: null
        },
        activeFaq: 0
    }),

    computed: {
    },

    created() {
        this.getFaqs();
    },

    methods: {
        async getFaqs(){
            const faqData = await this.$content('faq').fetch();
            const f = faqData.reduce((faq, g) => {
                if (g.slug === 'faqs') faq = g;
                return faq;
            }, {});  
            this.faqs = f.faq; 
        },
        expandFaq(){

        }
    },

};
</script>
<!-- eslint-enable -->