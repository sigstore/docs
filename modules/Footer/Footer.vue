<template>
    <footer class="footer py-64 bg-pastel-orange">
        <div class="flex flex-wrap justify-between items-start container">
            <div class="w-full md:w-1/2">
                <Logo />
                <Navigation nav-type="footer" :nav-list="navigation" />
            </div>
            <div class="w-full md:w-1/2">
                <Navigation nav-type="social" :nav-list="socialLinks" />
            </div>
            <p class="text-12 text-gray-dark mt-32">Copyright © 2021 The Linux Foundation®. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page. Linux is a registered trademark of Linus Torvalds. Privacy Policy and Terms of Use. Forms on this site are protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
</p>
        </div>
    </footer>
</template>
<script lang="js" src="./Footer.js" />