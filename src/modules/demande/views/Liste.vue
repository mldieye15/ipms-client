<template>
  <div>
    <p class="text-h6">{{ $t('apps.forms.demande.demande') }}</p>

    <v-card>
      <v-tabs v-model="tab" bg-color="primary" >
        <v-tab value="nontraite">Non traité</v-tab>
        <v-tab value="traite">Traité</v-tab>
        <v-tab value="rejete">Rejeté</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="nontraite">
            <v-container class="my-5" grid-list-xl>
              <v-row class="mb-0 mx-auto pa-1"  align="center">
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    label="Matricule ou ..."
                    placeholder="Placeholder"
                    variant="underlined"
                    append-inner-icon="mdi-magnify"
                    v-model="searchValue"
                  ></v-text-field>
                </v-col>
                <v-spacer></v-spacer>

                <v-col cols="auto">
                  <v-btn variant="outlined" color="blue" class="text" v-bind="props" @click="refresh">
                    <v-icon small flat green="green dark">mdi-refresh</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <div id="row-clicked"></div>
              <EasyDataTable
                :headers="headerTable"
                :items="dataListe"
                :loading="loading"
                buttons-pagination
                :search-value="searchValue"
                v-model:items-selected="itemsSelected"
                @click-row="showRow"
              >
              <template #item-actions="item">
          <div class="actions-wrapper">
            <!--
            <router-link :to="{ name: 'demande-details', params: { id: item.id } }"> <v-icon small flat color="green dark">mdi-thumb-up</v-icon> </router-link>
            <router-link :to="{ name: 'demande-edit', params: { id: item.id } }" class="ml-4"> <v-icon small flat color="blue dark">mdi-pencil</v-icon> </router-link>
            -->
            <v-dialog transition="dialog-top-transition" width="50%" height="auto">
              <template v-slot:activator="{ props }">
                <v-btn variant="text"  class="text" v-bind="props">
                  <v-icon small flat green="green dark">mdi-thumb-up</v-icon>
              </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar color="primary" :title="$t('apps.forms.demande.demande')"></v-toolbar>
                  <v-card-text>

                    <div class="text-h6">{{ $t('apps.forms.acceptDemandMessage') }}</div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" color="primary" @click="isActive.value = false">{{ $t('apps.forms.annuler') }}</v-btn>
                    <v-btn variant="outlined" color="black"  @click="accept(item.imputation)">{{ $t('apps.forms.oui') }}</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>

            <v-dialog transition="dialog-top-transition" width="50%" height="auto">
              <template v-slot:activator="{ props }">
                <v-btn variant="text"  class="text" v-bind="props">
                  <v-icon small flat color="red dark">mdi-thumb-down</v-icon>
              </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar color="primary" :title="$t('apps.forms.demande.demande')"></v-toolbar>
                  <v-card-text>

                    <div class="text-h6">{{ $t('apps.forms.refuseDemandMessage') }}</div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" color="primary" @click="isActive.value = false">{{ $t('apps.forms.annuler') }}</v-btn>
                    <v-btn variant="outlined" color="black"  @click="reject(item.imputation)">{{ $t('apps.forms.oui') }}</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </template>
                <!--<template #item-actions="item">
                  <div class="actions-wrapper">
                      <v-icon small flat color="green dark" @click="accept(item.imputation)">mdi-thumb-up</v-icon>
                      <v-icon small flat color="red dark" class="ma-3" @click="reject(item.imputation)">mdi-thumb-down</v-icon>
                  </div>
                </template>-->
              </EasyDataTable>
            </v-container>
          </v-window-item>

          <v-window-item value="traite">
            <v-container class="my-5" grid-list-xl>
              <v-row class="mb-0 mx-auto pa-1"  align="center">
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    label="Matricule ou ..."
                    placeholder="Placeholder"
                    variant="underlined"
                    append-inner-icon="mdi-magnify"
                    v-model="searchValue"
                  ></v-text-field>
                </v-col>
                <v-spacer></v-spacer>

                <v-col cols="auto">
                  <v-btn variant="outlined" color="blue"  class="text" v-bind="props" @click="refresh">
                    <v-icon small flat green="green dark">mdi-refresh</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>

              </v-row>
              <EasyDataTable
                :headers="headerTable"
                :items="dataTraiteListe"
                :loading="loading"
                buttons-pagination
                :search-value="searchValue"
              >
                <template #item-actions="item">
                    <div class="actions-wrapper">

                        <v-dialog transition="dialog-top-transition" width="55%" height="auto">
                          <template v-slot:activator="{ props }">
                            <v-btn variant="text"  class="text" v-bind="props" @click="treatDialogClicked(item)">
                              <v-icon small flat color="green dark">mdi-file-document</v-icon>
                            </v-btn>
                          </template>
                          <template v-slot:default="{ isActive }">
                            <v-card>
                              <!--<v-toolbar color="primary" :title="$t('apps.forms.demande.demande')"></v-toolbar>-->
                              <v-card-text>
                                <PdfApp style="height: 60vh" :pdf="pdfSrc"></PdfApp>
                              </v-card-text>
                            </v-card>
                          </template>
                        </v-dialog>

                      <v-icon small flat color="red dark" class="ma-3" @click="reject(item.imputation)">mdi-history</v-icon>
                  </div>
                </template>
                <!-- <template #item-actions="item">
                  <div class="actions-wrapper">
                    <v-dialog transition="dialog-top-transition" width="50%" height="auto">
                      <template v-slot:activator="{ props }">
                        <v-btn variant="text"  class="text" v-bind="props" @click="treatDialogClicked(item)">
                          <v-icon small flat green="green dark">mdi-file-document</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:default="{ isActive }">
                        <v-card>
                          <v-toolbar color="primary" :title="$t('apps.forms.demande.demande')"></v-toolbar>
                          <v-card-text>

                            <div class="text-h6">{{ $t('apps.forms.acceptDemandMessage') }}</div>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn variant="text" color="primary" @click="isActive.value = false">{{ $t('apps.forms.annuler') }}</v-btn>
                            <v-btn variant="outlined" color="black"  @click="refresh">{{ $t('apps.forms.oui') }}</v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>

                    <v-dialog transition="dialog-top-transition" width="50%" height="auto">
                      <template v-slot:activator="{ props }">
                        <v-btn variant="text"  class="text" v-bind="props">
                          <v-icon small flat color="red dark">mdi-history</v-icon>
                      </v-btn>
                      </template>
                      <template v-slot:default="{ isActive }">
                        <v-card>
                          <v-toolbar color="primary" :title="$t('apps.forms.demande.demande')"></v-toolbar>
                          <v-card-text>

                            <div class="text-h6">{{ $t('apps.forms.refuseDemandMessage') }}</div>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn variant="text" color="primary" @click="isActive = false">{{ $t('apps.forms.annuler') }}</v-btn>
                            <v-btn variant="outlined" color="black"  @click="refresh">{{ $t('apps.forms.oui') }}</v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </div>
                </template>-->
              </EasyDataTable>
            </v-container>
          </v-window-item>

          <v-window-item value="rejete">
            <v-container class="my-5" grid-list-xl>
              <v-row class="mb-0 mx-auto pa-1"  align="center">
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    label="Matricule ou ..."
                    placeholder="Placeholder"
                    variant="underlined"
                    append-inner-icon="mdi-magnify"
                    v-model="searchValue"
                  ></v-text-field>
                </v-col>
                <v-spacer></v-spacer>

                <v-col cols="auto">
                  <v-btn variant="outlined" color="blue" class="text" v-bind="props" @click="refresh">
                    <v-icon small flat green="green dark">mdi-refresh</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <div id="row-clicked"></div>
              <EasyDataTable
                :headers="headerTable"
                :items="dataRejeteListe"
                :loading="loading"
                buttons-pagination
                :search-value="searchValue"
                show-index
                v-model:items-selected="itemsSelected"
                @click-row="showRow"
              >
                <template #item-actions="item">
                  <div class="actions-wrapper">
                      <v-icon small flat color="green dark" @click="accept(item.imputation)">mdi-thumb-up</v-icon>
                      <v-icon small flat color="red dark" class="ma-3" @click="reject(item.imputation)">mdi-thumb-down</v-icon>
                  </div>
                </template>
              </EasyDataTable>
            </v-container>
          </v-window-item>
        </v-window>
      </v-card-text>
      </v-card>


  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDemandeStore } from "../store";
import { onMounted, ref } from "vue"
import { useNotificationStore } from "@/store/notification";
import { useI18n } from "vue-i18n";
import PdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";

const i18n = useI18n();

const notificationStore = useNotificationStore();
const { addNotification } = notificationStore;

const demandeStore = useDemandeStore();
const { dataListe, headerTable, loading, dataTraiteListe, dataRejeteListe, pdfSrc, error } = storeToRefs(demandeStore);
const { all, approve, refuse, downloadImputationPdf } = demandeStore;

const searchValue = ref("");
const DEMANDE_NON_TRAITE = 0;
const DEMANDE_TRAITE = 2;
const DEMANDE_ACCEPTE = 2;
const DEMANDE_REJETE = 3;
//const clickedItem = reactive({});
//
const tab = ref(null);
//

onMounted(()=>{
  all(DEMANDE_NON_TRAITE);
  all(DEMANDE_TRAITE);
  all(DEMANDE_REJETE);
});

const accept = (id) => {
  approve(id, DEMANDE_ACCEPTE).then( () => {
    addNotification({
        show: true,
        text:  i18n.t('saved'),
        color: 'blue'
      });

  });
  //isActive.value=false;
  //dialog.value=false;
  removeItem(id, DEMANDE_ACCEPTE);
};

const removeItem = (id, etat) => {
  let newArray = []
  dataListe.value.forEach((item) => {
    if(item.imputation != id){
      newArray.push(item);
    } else{
      if(etat === DEMANDE_ACCEPTE){
        dataTraiteListe.value.unshift(item);
      } else{
        dataRejeteListe.value.unshift(item);
      }
    }
  });
  dataListe.value = [];
  dataListe.value = newArray;
};

const refresh = () => {
  all(DEMANDE_NON_TRAITE);
  all(DEMANDE_TRAITE);
  all(DEMANDE_REJETE);
};
const reject = (id) => {
  refuse(id).then( () => {
    addNotification({
        show: true,
        text:  i18n.t('saved'),
        color: 'blue'
      });
  });
  removeItem(id, DEMANDE_REJETE);
}

const treatDialogClicked = (item) => {
  console.log(item);
  console.log(item.imputation);
  downloadImputationPdf(item.imputation).then( (response) => {
    console.log("Impuation downloaded!");
  });
  //this.clickedItem=id;
};

const handleDownloadImputation = (imputation) => {
console.log("Download imputation for", imputation);
  downloadImputationPdf(imputation).then( (response) => {
    console.log("Impuation downloaded!");
  });
}
</script>
<style scoped>
.v-text-field {
  background-color: white;
}
.v-text-field:hover {
  background-color: white;
}
</style>
