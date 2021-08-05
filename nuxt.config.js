export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  loading: {
    color: 'blue',
    height: '5px'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'sigstore',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: "msapplication-TileColor", content: "#da532c" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5"},
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/base'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/components.client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',

    '@nuxtjs/google-fonts'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [

    '@nuxtjs/svg',

    '@nuxtjs/pwa',

    '@nuxtjs/dotenv',

    '@nuxtjs/redirect-module',

    '@nuxtjs/sitemap',

    '@nuxt/content',

    '@nuxtjs/markdownit',

    '@nuxtjs/proxy',

  ],

  proxy: [
      // // Proxies /foo to http://example.com/foo
      // 'http://example.com/foo',
  
      // // Proxies /api/books/*/**.json to http://example.com:8000
      // 'http://example.com:8000/api/books/*/**.json',
  
      // // You can also pass more options
      // [ 'http://example.com/foo', { ws: false } ]
  ],

  markdownit: {
    runtime: true, // Support `$md()`
    preset: 'default',
    linkify: true,
    breaks: true
  },

  googleFonts: {
    families: {
      Inter: [400],
    },
    display: 'swap' // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  },

  content: {
    fullTextSearchFields: ['title', 'description', 'slug', 'text']
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: process.env.VUE_APP_FRONTEND,
    generate: true,
    cacheTime: 86400,
    trailingSlash: true
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  generate: {
    fallback: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
