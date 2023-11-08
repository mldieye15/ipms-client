// Utilities
import { defineStore } from 'pinia';
import axios from '@/plugins/axios.js'

const  modulesURL = '/services/modules/api/v1/all-brute';
const  fonctionnalitesURL = '/services/fonctionnalites/api/v1/all-brute';
const  fonctionnalitesByModuleURL = '/services/fonctionnalites/api/v1/fonctionalite-by-module/';
//const  fonctionnalitesByModuleURL = '/fonctionnalites?moduleId=';


export const useAppStore = defineStore('app', {
  state: () => ({
    modules: [
      /*{
        "id": 1,
        "libelle": "Accueil",
        "routeName": "accueil",
        "icon": ""
      },
      {
        "id": 2,
        "libelle": "Paramétrage",
        "routeName": "parametrage",
        "icon": ""
      },
      {
        "id": 3,
        "libelle": "Traitement",
        "routeName": "traitement",
        "icon": ""
      },
      {
        "id": 4,
        "libelle": "Administration",
        "routeName": "administration",
        "icon": ""
      }*/
    ],
    fonctionnalites: [
      /*{
        "id": 1,
        "title": "Tableau de bord",
        "translate": "dashboard",
        "code": "dashboard",
        "icon": "mdi-view-dashboard",
        "route": "dashboard",
        "moduleId": 1
      },
      {
        "id": 2,
        "title": "Profile",
        "translate": "profile",
        "code": "profile",
        "icon": "mdi-account-box",
        "route": "profile",
        "moduleId": 1
      },
      {
        "id": 3,
        "title": "Académies",
        "translate": "academie",
        "code": "academie",
        "icon": "mdi-playlist-check",
        "route": "academie-liste",
        "moduleId": 2
      },
      {
        "id": 4,
        "title": "Villes",
        "translate": "ville",
        "code": "ville",
        "icon": "mdi-city",
        "route": "ville-liste",
        "moduleId": 2
      }*/
    ],
    loading: true,
  }),

  getters: {
    geModules: (state) => state.modules,
    getFonctionnalites: (state) => state.fonctionnalites,
  },

  actions: {
    async listeModules() {
      this.loading = true;
      try { //`${loginURL}`
        await axios.get(modulesURL)
        .then((response) => {
          if(response.status === 200){
            this.modules = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async listeFonctionnalites() {
      this.loading = true;
      try {
        await axios.get(fonctionnalitesURL)
        .then((response) => {
          if(response.status === 200){
            this.fonctionnalites = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async listeFonctionnalitesByModule(module) {
      this.loading = true;
      try {
        await axios.get(`${fonctionnalitesByModuleURL}${module}`)
        .then((response) => {
          if(response.status === 200){
            this.fonctionnalites = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})
