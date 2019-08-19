const environment = process.env.NODE_ENV || 'development'
const env = require(`./env.${environment}.js`)

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: '分割ったー | 長い投稿を自動で分割・ツイート！',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: '長い文章をいい感じの長さに区切ってツイートできます。使い方は文章を書いて投稿ボタンを押すだけ！'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#405d83",
    height: "10px",
    duration: 2000,
    continuous: true
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/firebase', '@/plugins/auth.ts'],

  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    ['@nuxtjs/google-analytics', {
      id: 'UA-143780066-2',
      dev: false
    }]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  manifest: {
    name: '分割ったー',
    lang: 'ja'
  },
  styleResources: {
    scss: [
      '~/assets/css/main.scss'
    ]
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  env
}
