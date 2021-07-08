<template>
  <div>
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
    <nuxt-content class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto" :document="page"/>
  </div>
</template>

<script>

export default {
  async asyncData({ $content, params }) {
    const slug = params.slug || "index";
    const page = await $content('blog', slug)
      .fetch();

    return {
      page
    };
  }
};
</script>
