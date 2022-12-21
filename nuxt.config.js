import theme from '@nuxt/content-theme-docs'

export default theme({
  router: {
    trailingSlash: true,
  },
  i18n: {
    locales: () => [{
      code: 'en',
      iso: 'en-US',
      file: 'en-US.js',
      name: 'English'
    }],
    defaultLocale: 'en'
  },
  build: {
    publicPath: 'https://docs.sigstore.dev'
  }
})
