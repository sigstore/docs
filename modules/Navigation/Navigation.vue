<template>
    <nav>
        <ul class="flex flex-wrap justify-start items-start">
            <li v-for="navItem, index in navList" :key="index">
                <NuxtLink class="mr-8" :to="`${navItem.menuLink}`">{{ navItem.name }}</NuxtLink>
            </li>
            <GitHubLogo />
        </ul>
    </nav>
</template>
<script lang="js" src="./Navigation.js" />
