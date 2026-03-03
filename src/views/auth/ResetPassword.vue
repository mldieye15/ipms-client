<template>
  <div class="space-header-to-footer">
    <v-card
      class="mx-auto pa-12 pb-8 mt-5"
      elevation="8"
      max-width="500"
      rounded="lg"
    >
    <h2 class="mx-auto text-subtitle-6 text-medium-emphasis text-center">{{ $t('auth.forms.authentification.resetpwdtitre') }}</h2>
    <v-divider class="my-3" color="white"></v-divider>

    <v-alert
      v-if="showError"
      color="error"
      closable
      variant="outlined"
      border="start"
      border-color="red"
      elevation="1"
      :text="$t('auth.forms.authentification.misstokenPwdNotConform') "
      class="mb-3"
    ></v-alert>

    <v-divider  v-if="showError" class="my-3" />

    <v-form validate-on="submit lazy" @submit.prevent ref="form" :value="formValid">
      <v-text-field
        density="compact"
        prepend-inner-icon="mdi-key-variant"
        name="username"
        :label="$t('auth.forms.authentification.newPwd')"
        :rules="[rules.required, rules.min]"
        type="text"
        variant="underlined"
        v-model="userForm.newPassword"
        color="balck"
        class="mb-3"
      ></v-text-field>

      <v-text-field
        density="compact"
        prepend-inner-icon="mdi-key-chain"
        name="username"
        :label="$t('auth.forms.authentification.confirmPwd')"
        :rules="[rules.required, rules.min, passwordMatch]"
        type="text"
        variant="underlined"
        v-model="userForm.confirmPassword"
        color="balck"
        class="mb-3"
      ></v-text-field>

      <v-btn variant="tonal" block class="mt-2 mb-8" size="large" color="primary" @click="handleResetPwd">{{ $t('auth.forms.authentification.btnresetpwd') }}</v-btn>
    </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { shallowRef, ref, reactive, getCurrentInstance, computed, onMounted } from "vue";
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
const showError = shallowRef(false);
const token = ref('')

const userForm = reactive({
  token:'',
  newPassword:'',
  confirmPassword:'',
});

const requiredRule = v => !!v || 'Champ obligatoire';

const rules = reactive({
  required: value => !!value || 'Champ obligatoire.',
  min: v => v.length >= 6 || '6 cractére au moins',
  //emailMatch: () => (`The email and password you entered don't match`),
});
//  traitement de la connexion
const handleResetPwd= async () => {
  const { valid } = await form.value.validate()

  if (!valid) {
    showError.value = true
    return
  }

  if(valid && userForm.token!= ''){
    //const response = await userStore.resetPwd(userForm);
    //router.push( { name: 'home'});
    userStore.resetPwd(userForm).then( () => {
      //showMessage.value = true;
      router.push( { name: 'home'});

      addNotification({
        show: true,
        text:  i18n.t('welcome')+' ',
        color: 'black'
      });
    });

  }
}
const passwordMatch = computed(() => {
  return (v) => v === userForm.confirmPassword || 'Les mots de passe ne correspondent pas';
});
//
onMounted(async () => {
  //token.value = router.currentRoute.value.query.token; // Utilisez router.currentRoute pour récupérer la query
  userForm.token = router.currentRoute.value.query.token;
  if (!userForm.token) {
    showError.value = true; // Affiche l'erreur si le token est absent
  }
  console.log(userForm.token); // Affiche le token dans la console pour le débogage
});
</script>
