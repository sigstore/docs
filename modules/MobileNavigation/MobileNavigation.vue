<template>
    <nav>
        <ul class="md:flex flex-wrap items-start pt-96" :class="[navType == 'social' ? 'justify-end' : 'justify-start']">
            <li v-for="navItem, index in navList" :key="index" class="mb-48">
                <NuxtLink 
                    v-if="navType == 'header'" 
                    class="mr-36 flex justify-between text-gray-dark text-19 hover:text-purple-light h" 
                    :to="`${navItem.menuLink}`"
                    >
                    {{ navItem.name }}
                </NuxtLink>
                <NuxtLink 
                    v-else-if="navType == 'footer'" 
                    class="mr-36 flex justify-between text-gray-dark text-19 hover:text-purple-light h" 
                    :to="`${navItem.footerMenuLink}`">
                    {{ navItem.name }}
                </NuxtLink>
                <a v-else class="mr-8 flex justify-between text-gray-dark text-19 hover:text-purple-light h" :href="`${navItem.url}`">
                    <!-- TODO: refactor with dynamic namescase to use the assets folder -->
                    <span v-if="navType == 'social' && navItem.name == 'GitHub'" class="mx-6">
                        <GitHubLogo :class="['fill-grey']" />
                    </span>
                    <span v-if="navType == 'social' && navItem.name == 'Twitter'" class="mx-6">
                        <TwitterLogo :class="['fill-grey']" />
                    </span>
                    {{ navItem.name }}
                </a>
            </li>
        </ul>
        <ul class="absolute bottom-0 left-0 w-full p-60 border-t-2 border-gray-light">
            <li v-for="(navItem, index) in socialLinks" :key="index" 
            :class="[index === socialLinks.length - 1 ? 'mb-0':'mb-48']">
                <a class="mr-8 flex justify-between text-gray-dark text-19 hover:text-purple-light h" :href="`${navItem.url}`">
                    {{ navItem.name }}
                </a>
            </li>
        </ul>
    </nav>
</template>
<script lang="js" src="./MobileNavigation.js" />
<style lang="scss" src="./MobileNavigation.scss" />
