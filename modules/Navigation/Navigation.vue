<template>
    <nav>
        <ul class="flex flex-wrap items-start" :class="[navType == 'social' ? 'justify-end' : 'justify-start']">
            <li v-for="navItem, index in navList" :key="index">
                <NuxtLink v-if="navType == 'header'" class="mr-36 flex justify-between hover:text-purple-light" :class="[scrolled ? 'text-white' : '']" :to="`${navItem.menuLink}`">
                    {{ navItem.name }}
                </NuxtLink>
                <NuxtLink v-else-if="navType == 'footer'" class="mr-36 flex justify-between hover:text-purple-light" :class="[scrolled ? 'text-white' : '']" :to="`${navItem.footerMenuLink}`">
                    {{ navItem.name }}
                </NuxtLink>
                <a v-else class="mr-8 flex justify-between hover:text-purple-light" :href="`${navItem.url}`">
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
    </nav>
</template>
<script lang="js" src="./Navigation.js" />
