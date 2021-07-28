<template>
    <header ref="header" class="headroom py-30 fixed w-full z-50" :class="[bg,isScrolling ? 'scrolled' : '']">
        <div class="container">
            <div class="flex flex-wrap justify-between items-start">
                <NuxtLink class="z-20" :to="`/`"><Logo :class="[$route.params.slug === 'trust-security' ? 'logo-white' : 'logo-black']" /></NuxtLink>
                <Navigation class="hidden md:block" :scrolled="isScrolling" nav-type="header" :nav-list="navigation" />
                <NavButton class="block md:hidden w-32 h-32 z-20 relative" :class="[$route.params.slug === 'trust-security' ? 'fill-white' : 'fill-black']" @click="openNavDrawer" />
                <!-- <NavCloseButton v-if="!navOpen" class="block md:hidden w-20 h-16 z-20 relative" @click="openNavDrawer" /> -->
            </div>
        </div>
    </header>
</template>
<script lang="js" src="./Header.js" />
<style lang="scss" src="./Header.scss" />