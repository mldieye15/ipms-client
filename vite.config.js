// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

//  i18n
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

//
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    // i18n
    VueI18nPlugin({
      //runtimeOnly: false, // if the interpolation or pluralization is not working in production, you can also try setting the runtimeOnly option to false in the config
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**')
    })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
  port: 3000,
  https: {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
  },
  proxy: {
    '/ipms': {
      target: 'https://ipms-api.ucad.sn:8203',
      changeOrigin: true,
      secure: false
    }
  }
}
})
