export default defineNuxtConfig({
  devtools: { enabled: false },

  srcDir: './src/client',

  serverDir: './src/server',

  nitro: {
    output: { 
      dir: './dist/server',
      serverDir: './dist/server/core', 
      publicDir: './dist/server/public' 
    }
  },

  runtimeConfig: {
    dev: process.env.NODE_ENV === 'production' ? false : true,
    mongoURI: process.env.MONGO_URI,
    mongoDB: process.env.MONGO_DB,
    apiSecret: process.env.SECRET,
    
    public: {
      dev: process.env.NODE_ENV === 'production' ? false : true,
      clientURL: process.env.CLIENT_URL,
      domain: process.env.DOMAIN,
      cookieConfig: {
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : undefined
      },
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/ui',
    ['@nuxtjs/google-fonts', {
      display: 'swap',
      download: true,
      families: {
        Montserrat: [400,500,600,700]
      }
    }],
    ['@nuxtjs/robots', {
      rules: [
        { UserAgent: '*' },
        { Disallow: '/callback/*' },
        { Disallow: '/admin/*' },
        { Disallow: '/.nuxt/*' },
        { BlankLine: true },
        { Sitemap: `${process.env.CLIENT_URL}/sitemap.xml` }
      ]
    }],
    //'@vite-pwa/nuxt'
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: [
    '@/app.sass'
  ],

  colorMode: {
    preference: 'dark'
  },

  ui: {
    icons: ['bxs', 'bx', 'bxl'],
  },

  image: {
    domains: [
      process.env.DOMAIN as string
    ]
  },

  //pwa: {
    // manifest: {
    //   name: process.env.NAME,
    //   short_name: process.env.SHORT_NAME,
    //   description: 'CMS Game Online',
    //   icons: [
    //     { src: 'pwa/64.png', sizes: "64x64", type: 'image/png' },
    //     { src: 'pwa/144.png', sizes: "144x144", type: 'image/png' },
    //     { src: 'pwa/192.png', sizes: "192x192", type: 'image/png' },
    //     { src: 'pwa/512.png', sizes: "512x512", type: 'image/png', purpose: 'any'  },
    //     { src: 'pwa/512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    //   ]
    // },
    // workbox: {
    //   navigateFallback: '/',
    //   sourcemap: true
    // },
    // registerType: 'autoUpdate'
  //}
})
