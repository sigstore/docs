<template>
    <header class="py-30 fixed w-full z-50" :class="[isScrolling ? 'scrolled' : '']">
        <div class="container">
            <div class="flex flex-wrap justify-between items-start">
                <NuxtLink class="z-20" :to="`/`"><Logo /></NuxtLink>
                <Navigation class="hidden md:block" :scrolled="isScrolling" nav-type="header" :nav-list="navigation" />
                <transition name="fade" :duration="{ enter: 500, leave: 500 }">
                    <MobileNavigation 
                        v-show="!navOpen" 
                        class="block md:hidden navigation--mobile" 
                        :scrolled="isScrolling" 
                        nav-type="header" 
                        :social-links="socialLinks" 
                        :nav-list="navigation" 
                    />
                </transition>
                <NavButton v-if="navOpen" class="block md:hidden w-20 h-16 z-20 relative" @click="openNavDrawer" />
                <NavCloseButton v-if="!navOpen" class="block md:hidden w-20 h-16 z-20 relative" @click="openNavDrawer" />
            </div>
        </div>
    </header>
</template>
<script lang="js" src="./Header.js" />