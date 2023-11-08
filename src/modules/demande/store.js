// Utilities
import { defineStore } from 'pinia';
import axios from '@/plugins/axios.js'
import { useImputationStore } from '@/modules/imputation/store'
const imputationStore = useImputationStore();

//const { test } = imputationStore;
const  modulesURL = '/services/suivi-demande/api/v1';
const  listeDemandeForViewURL = modulesURL+'/liste-demande-for-view';
const  oneDemandeForViewURL = modulesURL+'/one-demande-for-view';
const DEMANDE_NON_TRAITE = 0;
const DEMANDE_ACCEPTE = 1;
const DEMANDE_REJETE = 2;


export const useDemandeStore = defineStore('demande', {
  state: () => ({
    dataListe: [],  //  List des données à afficher pour la table
    dataDetails: {},  //  Détails d'un élment,
    loading: true,  //  utilisé pour le chargement
    /*breadcrumbs: [
      {
        text: 'Paramétrage',
        disabled: true,
        route: 'home',
      },
      {
        text: 'Académies',
        disabled: true,
        route: 'src/modules/academie/routes.js',
      }
    ],*/
    headerTable: [
      { text: 'Matricule', value: 'matricule', align: 'start', sortable: true },
      { text: 'Demandeur', value: 'demandeur', align: 'start', sortable: true },
      { text: 'Bénéficiaire', value: 'beneficiaire', align: 'start', sortable: true },
      { text: 'Lien', value: 'lien', align: 'start', sortable: true },
      { text: 'Structure', value: 'structure', align: 'start', sortable: true },
      { text: 'Actions', value: 'actions', sortable: false }
    ]
  }),

  getters: {
    getDataListe: (state) => state.dataListe
  },

  actions: {
    //  recupérer la liste des académies et le mettre dans la tabel dataListe
    async all(etat) {
      try {
        await axios.get(`${listeDemandeForViewURL}/${etat}`)
        .then((response) => {
          if(response.status === 200){
            this.dataListe = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //  recupérer les informations d'une académie par son ide et le mettre dans la tabel dataDetails
    async one(demande) {
      try {
        await axios.get(`${modulesURL}/${demande}`)
        .then((response) => {
          if(response.status === 200){
            this.dataDetails = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //  ajouter une demande
    async add(payload) {
      try {
        await axios.post(modulesURL, payload)
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
            console.log("Response: ", this.dataDetails);
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },

    //  modifier une demande
    async modify(id, payload) {
      try {
        console.log("Id: ", id);
        console.log("Payload: ", payload);
        await axios.put(`${modulesURL}/${id}`, payload)
        .then((response) => {
          if(response.status === 200 ){
            this.dataDetails = response.data;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },

    //  supprimer une demande
    async refuse(imputation) {
      console.log(imputation);
      try {
        await axios.get(`${oneDemandeForViewURL}/${imputation}`)
        .then((response) => {
          if(response.status === 200){
            console.log(response.data);
            const result = response.data;
            const imputationPayload = {
              "patient": result.patient,
              "structureSante": result.structureSante,
              "typeImputation": result.typeImputation,
              "imputation": result.imputation,
              "suividemandeId": result.id,
              "etat": DEMANDE_ACCEPTE
            }
            console.log(imputationPayload);
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },

    //  approuver une demande
    async approve(imputation) {
      console.log(imputation);
      try {
        await axios.get(`${oneDemandeForViewURL}/${imputation}`)
        .then((response) => {
          if(response.status === 200){
            console.log(response.data);
            const result = response.data;
            const imputationPayload = {
              "patient": result.patient,
              "structureSante": result.structureSante,
              "typeImputation": result.typeImputation,
              "imputation": result.imputation,
              "suividemandeId": result.id,
              "etat": DEMANDE_ACCEPTE
            }
            console.log(imputationPayload);
            imputationStore.add(imputationPayload);/*.then((response) => {
              if(response.status === 200 ){
                this.dataDetails = response.data;
              }
            });
            */
            //add(imputationPayload);
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
