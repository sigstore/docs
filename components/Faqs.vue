<template>
    <div>
        <p v-for="(faq, index) in faqs" :key="index">{{faq.answer}}</p>
    </div>
</template>
<script lang="js">
export default {

    components: {

    },

    props: {
        faqs: { type: Array, default: null },
    },

    data: () => ({
    }),

    mounted() {
    },

    methods: {
    }

};
</script>