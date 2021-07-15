<template>
    <header class="header py-8 fixed w-full z-50" :class="[isScrolling ? 'scrolled' : '']">
        <div class="flex flex-wrap justify-between items-start container">
            <NuxtLink :to="`/`"><Logo /></NuxtLink>
            <Navigation :scrolled="isScrolling" nav-type="header" :nav-list="navigation" />
        </div>
    </header>
</template>
<script lang="js" src="./Header.js" />