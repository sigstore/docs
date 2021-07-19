<template>
    <footer class="footer py-64 bg-gray-greyBkg">
        <div class="flex flex-wrap justify-between items-start container">
            <div class="w-full md:w-1/2">
                <Logo />
                <Navigation class="mt-16" nav-type="footer" :nav-list="navigation" />
            </div>
            <div class="w-full md:w-1/2">
                <Navigation class="mt-16" nav-type="social" :nav-list="socialLinks" />
            </div>
        </div>
    </footer>
</template>
<script lang="js" src="./Footer.js" />