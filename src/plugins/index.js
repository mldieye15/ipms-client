/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import i18n from './i18n'
//import axios from './axios'
import vuetify from './vuetify'
import pinia from '../store'
//import { createPinia } from 'pinia'
import router from '../router'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

export function registerPlugins (app) {
  loadFonts()
  app.component('EasyDataTable', Vue3EasyDataTable);
  //app.component('axios', axios);
  app
    .use(vuetify)
    .use(pinia)
    //.use(createPinia())
    .use(router)
    .use(i18n)
}
