<template>
  <div>
    <p class="text-h6">{{ $t('apps.forms.ville.ville') }}</p>
    <FormVue :inputForm="inputForm" :actionSubmit="handleSave" />
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from 'vue-router';
import { useNotificationStore } from "@/store/notification";
import { useI18n } from "vue-i18n";

//
import FormVue from "./Form.vue";
import { useVilleStore } from "../store";
const i18n = useI18n();

const notificationStore = useNotificationStore();
const { addNotification } = notificationStore;

const instance = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const villeStore = useStructsanteStore();
const { dataDetails, loading } = storeToRefs(villeStore);
const { one, modify } = villeStore;

const inputForm = reactive({
  nom: ''
});

const handleSave = (payload) => {
  modify(route.params.id, payload).then( () => {
    addNotification({
        show: true,
        text:  i18n.t('updated'),
        color: 'blue'
      });
    router.push( { name: 'structsante-liste'});
  });
}

onMounted(()=>{
  one(route.params.id ).then( () => {
    inputForm.nom = dataDetails.value.nom
  });
});


</script>
