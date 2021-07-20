<template>
    <header class="py-30 fixed w-full z-50" :class="[isScrolling ? 'scrolled' : '']">
        <div class="container">
            <div class="flex flex-wrap justify-between items-start">
                <NuxtLink :to="`/`"><Logo /></NuxtLink>
                <Navigation class="hidden md:block" :scrolled="isScrolling" nav-type="header" :nav-list="navigation" />
                <NavButton class="block md:hidden" @click="openNavDrawer" />
            </div>
        </div>
    </header>
</template>
<script lang="js" src="./Header.js" />