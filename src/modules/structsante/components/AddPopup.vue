<template>
  <span class="text-center pa-4">

    <!-- Bouton Ajouter -->
    <v-btn
      v-if="btnAdd"
      class="ma-0 text-none font-weight-regular"
      variant="tonal"
      color="blue-darken-1"
      prepend-icon="mdi-plus"
      @click="dialog = true"
    >
      {{ $t('apps.forms.ajouter') }}
    </v-btn>

    <!-- Bouton Icône -->
    <v-btn
      v-else
      variant="text"
      :style="styleBtn"
      :icon="iconBtn"
      :color="colorBtn"
      @click="dialog = true"
    />

    <!-- Dialog -->
    <v-dialog v-model="dialog" width="auto" min-width="500">
      <v-card>

        <v-toolbar color="primary" :title="libTitreForm">
          <template #append>
            <v-btn
              icon="mdi-window-close"
              variant="text"
              color="brown-lighten-5"
              @click="close"
            />
          </template>
        </v-toolbar>

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
                  v-model="localForm.libelle"
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
                      v-model="localForm.typeStructureSante"
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
                      v-model="localForm.telephone"
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
                    v-model="localForm.responsbale"
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
                    v-model="localForm.interne"
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
                    v-model="localForm.email"
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
                    v-model="localForm.actif"
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

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            :text="$t('apps.forms.fermer')"
            variant="plain"
            @click="close"
          />

          <v-btn
            v-if="showBtnAdd"
            color="primary"
            :text="$t('apps.forms.enregistrer')"
            variant="tonal"
            :disabled="saveDisabled"
            @click="save"
          />
        </v-card-actions>

      </v-card>
    </v-dialog>

  </span>
</template>


<script setup>
import { shallowRef, onMounted, onUnmounted, reactive, ref } from 'vue'
import { storeToRefs } from "pinia"
import { useStructsanteStore } from "../store"
import { useTypeStructsanteStore } from '@/modules/typestructsante/store'
import { useNotificationStore } from "@/store/notification"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const notificationStore = useNotificationStore()
const { addNotification } = notificationStore

const structureSanteStore = useStructsanteStore();
const typeStructsanteStore = useTypeStructsanteStore();
const { add } = structureSanteStore

// ✅ Emit propre
//const emit = defineEmits(['save'])
const dialog = ref(false);
const showError = shallowRef(false);
const form = shallowRef();
const saveDisabled = shallowRef(false);
const selectedCategorie = ref("");
//  validation
const requiredRule = v => !!v || 'Champ obligatoire';
const emailRule = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalide';
const phoneRule = v => !v || /^[0-9+\s-]{8,15}$/.test(v) || 'Numéro invalide';
//  couleurs
const ALERT_NOTIFTCATION_COLOR = ref('light-blue-darken-3');
const ALERT_DNAGER_COLOR = ref('light-bred-darken-3');

// ✅ defineProps version JS
const props = defineProps({
  inputForm: {
    type: Object,
    required: true
  },
  libTitreForm: {
    type: String,
    required: true
  },
  btnAdd: Boolean,
  iconBtn: String,
  colorBtn: String,
  onClick: Function,
  styleBtn: String,
  idItem: String,
  disabledField: {
    type: Boolean,
    default: false
  },
  addedClass: String,
  showBtnAdd: {
    type: Boolean,
    default: true
  }
})

const localForm = reactive({ ...props.inputForm })


/*const save = async () => {
  const { valid } = await form.value.validate()
  //  validation du formulaire
  if (!valid) {
    if(props.btnAdd){ //  Ajout
      console.log("Ajout: ", localForm);
      await structureSanteStore.add(localForm).then( () => {
        notificationStore.addNotification({
          show: true,
          text: $t('addedField', {field:$t('apps.forms.structsante.structsante')}),
          color: `${ALERT_NOTIFTCATION_COLOR.value}`,
          id: Math.floor(Math.random()*1000)
        });

        const addedData = reactive({
          id: typeCompteCaisseStore.typeCompteCaisse?.id ?? null,
          libelle: localForm?.libelle ?? '',
          telephone: localForm?.telephone ?? '',
          responsbale: localForm?.responsbale ?? '',
          interne: localForm?.interne ?? 'N',
          actif: localForm?.actif ?? 'O',
          email: localForm?.email ?? '',
          typeStructureSante: localForm?.typeStructureSante ?? '',
        });

        structureSanteStore.dataListe.unshift(addedData);
      });
    } else{ //  Modification
      console.log("Modification: ", localForm)
      await structureSanteStore.modify(props.idItem, localForm).then( () => {
        notificationStore.addNotification({
          show: true,
          text: $t('updatedField', {field:$t('apps.forms.structsante.structsante')}),
          color: `${ALERT_NOTIFTCATION_COLOR.value}`,
          id: Math.floor(Math.random()*1000)
        });
        });
    }
    showError.value = true
    return
  }

  console.log("Formulaire valide :", localForm)

  // 🔥 EMIT PROPRE
  // emit('save', { ...localForm })

  dialog.value = false
}
*/
const save = async () => {
  const { valid } = await form.value.validate()

  // ❌ Si formulaire invalide
  if (!valid) {
    showError.value = true
    return
  }

  try {
    if (props.btnAdd) { // ✅ AJOUT
      console.log("Ajout :", localForm)

      const response = await structureSanteStore.add(localForm)

      // 🔥 Récupération ID depuis la réponse backend
      const addedData = {
        id: response?.id ?? null,
        libelle: response?.libelle ?? localForm.libelle,
        telephone: response?.telephone ?? localForm.telephone,
        responsbale: response?.responsbale ?? localForm.responsbale,
        interne: response?.interne ?? localForm.interne,
        actif: response?.actif ?? localForm.actif,
        email: response?.email ?? localForm.email,
        typeStructureSante: response?.typeStructureSante.libelle ?? localForm.typeStructureSante
      }

      // Mise à jour locale optimisée
      structureSanteStore.dataListe.unshift(addedData)

      notificationStore.addNotification({
        show: true,
        text: t('addedField', {
          field: t('apps.forms.structsante.structsante')
        }),
        color: ALERT_NOTIFTCATION_COLOR.value,
        id: Math.floor(Math.random() * 1000)
      })

    } else {  // ✅ MODIFICATION
      console.log("Modification :", localForm)

      const response = await structureSanteStore.modify(props.idItem, localForm)

      const index = structureSanteStore.dataListe.findIndex(
        item => item.id === props.idItem
      )

      if (index !== -1) {
        structureSanteStore.dataListe[index] = {
          ...structureSanteStore.dataListe[index],
          ...response
        }
      }

      notificationStore.addNotification({
        show: true,
        text: t('updatedField', {
          field: t('apps.forms.structsante.structsante')
        }),
        color: ALERT_NOTIFTCATION_COLOR.value,
        id: Math.floor(Math.random() * 1000)
      })
    }

    dialog.value = false
    showError.value = false

  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error)

    notificationStore.addNotification({
      show: true,
      text: "Une erreur est survenue",
      color: "error",
      id: Math.floor(Math.random() * 1000)
    })
  }
}

const close = () => {
  dialog.value = false
}

// onMounted(() => {})
onMounted(async ()=>{
  typeStructsanteStore.all();
  console.log(typeStructsanteStore.typeStructures);

});
onUnmounted(() => {})
//
const changeCategorie  = async (id) => {
  console.log(id);
}
</script>
