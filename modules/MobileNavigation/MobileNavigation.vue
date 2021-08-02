<template>
    <nav class="block md:hidden navigation--mobile w-full" :class="[bg]">
        <div class="container">
            <div class="py-30 flex flex-wrap justify-between items-start ">
                <NuxtLink class="z-20" :to="`/`"><Logo :class="[$route.params.slug === 'trust-security' ? 'logo-white' : 'logo-black']" /></NuxtLink>
                <NavCloseButton class="block md:hidden w-32 h-32 z-20 relative" :class="[$route.params.slug === 'trust-security' ? 'fill-white' : 'fill-black']" @click="closeNavDrawer" />
            </div>
        </div>
        <ul class="md:flex flex-wrap items-start" :class="[navType == 'social' ? 'justify-end' : 'justify-start']">
            <li class="mb-48">
                <NuxtLink class="mr-36 flex justify-between text-19 hover:text-purple-light h" :class="[text]" :to="`/`">
                    Overview
                </NuxtLink>
            </li>
            <li v-for="navItem, index in navList" :key="index" class="mb-48">
                <NuxtLink 
                    v-if="navType == 'header'" 
                    class="mr-36 flex justify-between text-19 hover:text-purple-light h"
                    :class="[text]" 
                    :to="`${navItem.menuLink}`"
                    >
                    {{ navItem.name }}
                </NuxtLink>
                <NuxtLink 
                    v-else-if="navType == 'footer'" 
                    class="mr-36 flex justify-between text-19 hover:text-purple-light h"
                    :class="[text]" 
                    :to="`${navItem.footerMenuLink}`">
                    {{ navItem.name }}
                </NuxtLink>
                <a v-else class="mr-8 flex justify-between text-19 hover:text-purple-light h" :class="[text]" :href="`${navItem.url}`">
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
        <ul class="w-full p-60 border-t-2" :class="[bg != 'bg-purple-dark' ? 'border-gray-dark' : 'border-white']">
            <li v-for="(navItem, index) in socialLinks" :key="index" 
            :class="[index === socialLinks.length - 1 ? 'mb-0':'mb-48']">
                <a class="mr-8 flex justify-between text-19 hover:text-purple-light h" :class="[text]" :href="`${navItem.url}`">
                    {{ navItem.name }}
                </a>
            </li>
        </ul>
    </nav>
</template>
<script lang="js" src="./MobileNavigation.js" />
<style lang="scss" src="./MobileNavigation.scss" />
