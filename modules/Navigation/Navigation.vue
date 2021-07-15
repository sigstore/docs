<template>
    <nav>
        <ul class="flex flex-wrap items-start" :class="[navType == 'social' ? 'justify-end' : 'justify-start']">
            <li v-for="navItem, index in navList" :key="index">
                <NuxtLink class="mr-8" :class="[scrolled ? 'text-white' : '']" :to="`${navItem.menuLink}`">{{ navItem.name }}</NuxtLink>
            </li>
            <GitHubLogo :class="[scrolled ? 'fill-white' : '']" />
        </ul>
    </nav>
</template>
<script lang="js" src="./Navigation.js" />
