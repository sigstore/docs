<template>
  <ul>
    <li
      v-for="link in article"
      :key="link.id"
      :class="{ 'toc2': link.depth === 2, 'toc3': link.depth === 3 }"
    >
    test
      <NuxtLink :to="`${link.path}`">{{ link.title }}</NuxtLink>
    </li>
  </ul>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const article = await $content('docs')
      .fetch()

    return {
      article
    }
  }
}
</script>