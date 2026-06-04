<template>
  <div class="space-header-to-footer">
    <v-card
      class="mx-auto pa-12 pb-8 mt-5"
      elevation="8"
      max-width="500"
      rounded="lg"
    >
    <h2 class="mx-auto text-subtitle-6 text-medium-emphasis text-center">{{ $t('auth.forms.authentification.titre') }}</h2>
    <v-divider class="my-3" color="white"></v-divider>

    <v-alert
      color="error"
      closable
      variant="outlined"
      border="start"
      border-color="red"
      elevation="1"
      :text="$t('auth.forms.authentification.badcrentials') "
      class="mb-3"
      v-if="error"
    ></v-alert>


      <v-btn variant="tonal" block class="mt-2 mb-8" size="large" color="primary" @click="handleRedirectLogin">{{ $t('auth.forms.authentification.compteactive') }}</v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from 'vue-router'
//  recupération des states et des actions définies dans la store
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import axios from '@/plugins/axios.js'
//
const notificationStore = useNotificationStore();
const { addNotification } = notificationStore;
//
const instance = getCurrentInstance();
const router = useRouter();
//
import { useI18n } from "vue-i18n";
const i18n = useI18n();
//
const userStore = useUserStore();
const { isLoggedIn, userDetails, refreshToken, username, users, loading, error } = storeToRefs(userStore);
const { login, user } = userStore;

//  définition de quelques variables utilisées dans le formulaire
const formValid = ref(false);
const showPwd = ref(false);

const userForm = reactive({
  //email:'',
  username:''
});

const rules = reactive({
  required: value => !!value || 'Champ obligatoire.',
  min: v => v.length >= 6 || '6 cractére au moins',
  //emailMatch: () => (`The email and password you entered don't match`),
});

//  traitement de la connexion
const handleRedirectLogin = () => {
  router.push( { name: 'home'});
}
</script>
