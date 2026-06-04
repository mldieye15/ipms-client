<template>
  <div>
    <p class="text-h6">{{ $t('apps.forms.structsante.structsante') }}</p>

    <v-card>
      <v-tabs v-model="tab" bg-color="primary" >
        <v-tab value="structure">Structures</v-tab>
        <v-tab value="categorie">Catégories</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="structure">
            <v-container class="my-1" grid-list-xl>
              <v-row class="mb-0 mx-auto pa-1"  align="center">
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    label="Libelle ou ..."
                    placeholder="Placeholder"
                    variant="underlined"
                    append-inner-icon="mdi-magnify"
                    v-model="searchValue"
                  ></v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <!-- <v-col cols="auto">
                  <v-btn variant="outlined" color="blue" class="text" v-bind="props" @click="refresh">
                    <router-link :to="{ name: 'structsante-add' }" class="">
                      {{ $t('apps.forms.ajouter') }}
                    </router-link>
                  </v-btn>
                </v-col> -->
                <v-col cols="auto">
                  <AddPopup
                    :input-form="inputForm"
                    :lib-titre-form="$t('titleFormAddPopup', {field:$t('apps.forms.structsante.structsante')})"
                    :btn-add="true"
                    :show-btn-add="true"
                    icon-btn="mdi-delete"
                    color-btn="blue-darken-1"
                  />

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

               <template #item-actions="slotProps">
                    <div class="actions-wrapper">

                        <v-dialog transition="dialog-top-transition" width="55%" height="auto">
                          <template #activator="{ props: activatorProps }">
                            <v-btn variant="text"  class="text" v-bind="activatorProps" @click="treatDialogClicked(slotProps)">
                              <v-icon small flat color="green dark">mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <template v-slot:default="{ isActive }">
                            <v-card>
                              <!--<v-toolbar color="primary" :title="$t('apps.forms.demande.demande')"></v-toolbar>-->
                              <v-card-text>
                                <v-sheet class="mx-auto" width="500">

                                  <v-alert
                                    v-if="showError"
                                    density="compact"
                                    :text="$t('messages.validations.errors.checkform')"
                                    :title="$t('messages.validations.errors.titlecheckform')"
                                    type="error"
                                    variant="tonal"
                                    class="mb-2"
                                  />

                                  <v-divider  v-if="showError" class="my-3" />

                                  <v-form ref="form"
                                    validate-on="submit lazy"
                                    @submit.prevent
                                    >
                                    <v-row class="my-1">
                                      <v-text-field
                                        v-model="inputForm.libelle"
                                        density="compact"
                                        prepend-inner-icon="mdi-hospital-building"
                                        :label="$t('apps.forms.structsante.libelle')"
                                        :rules="[requiredRule]"
                                        variant="underlined"
                                        :disabled="disabledField"
                                        :class="`mb-2 ${addedClass || ''}`"
                                      />
                                    </v-row>

                                    <v-row>
                                      <v-col cols="8">
                                          <v-select
                                            v-model="inputForm.typeStructureSante"
                                            :items="typeStructsanteStore.dataListe"
                                            :label="$t(`apps.forms.structsante.categorie`)"
                                            :rules="[requiredRule]"
                                            density="compact"
                                            name="filtreCateg"
                                            variant="underlined"
                                            persistent-hint
                                            item-title="libelle"
                                            item-value="id"
                                            autocomplete="off"
                                            prepend-inner-icon="mdi-arch"
                                            @update:model-value="changeCategorie(selectedCategorie)"
                                          />
                                      </v-col>
                                      <v-col cols="4">
                                          <v-text-field
                                            v-model="inputForm.telephone"
                                            density="compact"
                                            prepend-inner-icon="mdi-phone"
                                            :label="$t('apps.forms.structsante.telephone')"
                                            :rules="[requiredRule, phoneRule]"
                                            variant="underlined"
                                            :disabled="disabledField"
                                            :class="`mb-2 ${addedClass || ''}`"
                                          />
                                      </v-col>
                                    </v-row>

                                    <v-row>
                                      <v-col cols="8">
                                        <v-text-field
                                          v-model="inputForm.responsbale"
                                          density="compact"
                                          prepend-inner-icon="mdi-badge-account"
                                          :label="$t('apps.forms.structsante.responsable')"
                                          :rules="[requiredRule]"
                                          variant="underlined"
                                          :disabled="disabledField"
                                          :class="`mb-2 ${addedClass || ''}`"
                                        />
                                      </v-col>
                                      <v-col cols="4">
                                        <v-radio-group
                                          v-model="inputForm.interne"
                                          :label="$t('apps.forms.structsante.interne')"
                                          :rules="[requiredRule]"
                                          inline
                                        >
                                          <v-radio label="Oui" value="O" style="margin-top: -15px;"></v-radio>
                                          <v-radio label="Non" value="N" selected style="margin-top: -15px;"></v-radio>
                                        </v-radio-group>
                                      </v-col>
                                    </v-row>

                                    <v-row>
                                      <v-col cols="8">
                                        <v-text-field
                                          v-model="inputForm.email"
                                          density="compact"
                                          prepend-inner-icon="mdi-at"
                                          :label="$t('apps.forms.structsante.email')"
                                          :rules="[emailRule]"
                                          variant="underlined"
                                          :disabled="disabledField"
                                          :class="`mb-2 ${addedClass || ''}`"
                                        />
                                      </v-col>
                                      <v-col cols="4">
                                        <v-radio-group
                                          v-model="inputForm.actif"
                                          :label="$t('apps.forms.structsante.actif')"
                                          :rules="[requiredRule]"
                                          inline
                                        >
                                          <v-radio label="Oui" value="O" selected style="margin-top: -15px;"></v-radio>
                                          <v-radio label="Non" value="N" style="margin-top: -15px;"></v-radio>
                                        </v-radio-group>
                                      </v-col>
                                    </v-row>

                                  </v-form>
                                </v-sheet>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer />

                                <v-btn
                                  :text="$t('apps.forms.fermer')"
                                  variant="plain"
                                  @click="isActive.value = false"
                                />

                                <v-btn
                                  color="primary"
                                  :text="$t('apps.forms.enregistrer')"
                                  variant="tonal"
                                  :disabled="saveDisabled"
                                  @click="save(slotProps)"
                                />
                              </v-card-actions>
                            </v-card>
                          </template>
                        </v-dialog>

                      <!-- <v-icon small flat color="blue dark" class="ma-3" @click="maj(item.id)">mdi-pencil</v-icon>-->
                  </div>
                </template>
            </EasyDataTable>
            </v-container>
          </v-window-item>
          <v-window-item value="categorie">
            Categories
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useStructsanteStore } from "../store";
import { onMounted, reactive, ref, shallowRef } from "vue"
import { useNotificationStore } from "@/store/notification";
import { useI18n } from "vue-i18n";
import AddPopup from "../components/AddPopup.vue";
import { useTypeStructsanteStore } from '@/modules/typestructsante/store'
import commonFunction from '@/helpers/functions'

const i18n = useI18n();

const notificationStore = useNotificationStore();
const { addNotification } = notificationStore;

const structureSanteStore = useStructsanteStore();
const { dataListe, headerTable, loading, dataDetails } = storeToRefs(structureSanteStore);
const { all, destroy } = structureSanteStore;

const liste = reactive({ items: [] });
const headers = reactive({ items: [] });
const searchValue = ref("");
const dialog = ref(false);
const typeStructsanteStore = useTypeStructsanteStore();
//
const tab = ref(null);
//  validation
const requiredRule = v => !!v || 'Champ obligatoire';
const emailRule = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalide';
const phoneRule = v => !v || /^[0-9+\s-]{8,15}$/.test(v) || 'Numéro invalide';
//
const inputForm = reactive({
  libelle: '',
  telephone: '',
  responsbale: '',
  interne: 'N',
  actif: 'O',
  email: '',
  typeStructureSante: '',
  correspondance: null
});
const form = shallowRef();
const showError = ref(false);
const saveDisabled = ref(false);
const itemsSelected = ref([]);

const showRow = (item) => {
  console.log(item);
};

const changeCategorie = (value) => {
  console.log(value);
};

onMounted(()=>{
  all();
});

const refresh = () => {
  all();
};

const maj = async (id) => {
  await structureSanteStore.one(id).then(() => {
    if (dataDetails.value) {
      Object.assign(inputForm, dataDetails.value);
    }
  });
};

const treatDialogClicked = (item) => {
  inputForm.libelle = item.libelle;
  inputForm.telephone = item.telephone;
  inputForm.responsbale = item.responsbale;
  inputForm.interne = item.interne;
  inputForm.actif = item.actif;
  inputForm.email = item.email;
  inputForm.typeStructureSante = item.typeStructureSante.id;
};

const save = async (item) => {
  const { valid } = await form.value.validate();

  if (!valid) {
    showError.value = true;
    return;
  }

  try {
    await structureSanteStore.modify(item.id, inputForm);

    notificationStore.addNotification({
      show: true,
      text: i18n.t('updatedField', { field: i18n.t('apps.forms.structsante.structsante') }),
      color: 'success',
      id: Math.floor(Math.random() * 1000)
    });

    showError.value = false;
    await all();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);

    notificationStore.addNotification({
      show: true,
      text: "Une erreur est survenue",
      color: "error",
      id: Math.floor(Math.random() * 1000)
    });
  }
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
