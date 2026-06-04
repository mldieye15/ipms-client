<template>
  <div class="space-header-to-footer">
    <v-card
      class="mx-auto pa-12 pb-8 mt-5"
      elevation="8"
      max-width="500"
      rounded="lg"
    >
    <h2 class="mx-auto text-subtitle-6 text-medium-emphasis text-center">{{ $t('auth.forms.authentification.changepwdtitre') }}</h2>
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
      v-if="showError"
    ></v-alert>

    <v-alert
      v-if="showMessage"
      color="green"
      closable
      variant="outlined"
      border="start"
      border-color="black"
      elevation="1"
      :text="$t('auth.forms.authentification.mailsend') "
      class="mb-3"
    ></v-alert>

    <v-form validate-on="submit lazy" @submit.prevent ref="form" :value="formValid">
      <v-text-field
        density="compact"
        prepend-inner-icon="mdi-at"
        name="username"
        :label="$t('auth.forms.authentification.email')"
        :rules="[requiredRule]"
        type="text"
        variant="underlined"
        v-model="userForm.username"
        color="balck"
      ></v-text-field>

      <v-btn variant="tonal" block class="mt-2 mb-8" size="large" color="primary" @click="handleSendMail">{{ $t('auth.forms.authentification.btnsendmail') }}</v-btn>
    </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { shallowRef, ref, reactive, getCurrentInstance } from "vue";
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
const { user } = userStore;

//  définition de quelques variables utilisées dans le formulaire
const formValid = ref(false);
const form = shallowRef();
const showPwd = ref(false);
const showMessage = shallowRef(false);

const userForm = reactive({
  username:''
});

const requiredRule = v => !!v || 'Champ obligatoire';

//  traitement de la connexionhttp://localhost:3000/mdp-reset?token=c6dd774e-4c84-466c-9053-588397bfa477
const handleSendMail= async () => {
  const { valid } = await form.value.validate()

  if (!valid) {
    showError.value = true
    return
  }

  if(valid){
    userStore.sendResetpwdMail(userForm).then( () => {
      showMessage.value = true;
      //router.push( { name: 'dashboard'});

      addNotification({
        show: true,
        text:  i18n.t('welcome')+' ',
        color: 'black'
      });
    });
    //const response = await userStore.sendResetpwdMail(userForm);
  }
}
</script>
