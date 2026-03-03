// Utilities
import { defineStore } from 'pinia';
import axios from '@/plugins/axios.js'

const  modulesURL = '/services/type-struct-sante/api/v1';
const  allBruteURL = modulesURL+'/all-brute';

export const useTypeStructsanteStore = defineStore('typestructsante', {
  state: () => ({
    dataListe: [],  //  List des données à afficher pour la table,
    typeStructures: [],  //  List des données à afficher pour la table,
    dataDetails: {},  //  Détails d'un élment,
    loading: true,  //  utilisé pour le chargement
    headerTable: [
      { text: 'Nom', value: 'libelle', align: 'start', sortable: true },
      { text: 'Actions', value: 'actions', sortable: false }
    ]
  }),

  getters: {
    getDataListe: (state) => state.dataListe,
    getTypeStructures: (state) => state.typeStructures
  },

  actions: {
    //  recupérer la liste des catégories
    async all() {
      try {
        await axios.get(allBruteURL)
        .then((response) => {
          if(response.status === 200){
            this.dataListe = response.data;
            this.typeStructures = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    }
  },

})
