<template>
  <nav>
    <v-app-bar class="bg-black-navbar darken-2" dark app inset padless flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="text-white"></v-app-bar-nav-icon>
      <v-avatar class="elevation-1">
        <v-img alt="Logo" class="shrink logo" rounded lazy-src="" :src="imageUrl" transition="scale-transition" width="40"  />
      </v-avatar>
      <v-toolbar-title class="text-uppercase text-white">
          <span class="font-weight-light">{{ appName }} </span>
          <span></span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn text v-bind="props" >
            <v-icon left size="36" class="text-white">mdi-apps</v-icon>
          </v-btn>
        </template>
        <v-list flat>
          <v-list-item v-for="link in modules" :key="link.id" router  class="link-item active">
            <v-list-item-title @click="loadFonction(link.id)">{{link.libelle}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <Localisation iconColorClass="text-white" />

      <v-menu bottom min-width="250px" rounded offset-x class="px-12" >
        <template v-slot:activator="{ props }">
          <v-btn icon x-large v-bind="props">
            <v-avatar color="white" size="46" light >
              <!--<v-img alt="Logo" class="shrink logo" rounded lazy-src="" :src="imageUrl" transition="scale-transition" width="40"  />-->
              <span black class="black--text text-h5">LD</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <h3>Lamine DIEYE</h3>
              <p class="text-caption mt-1">
                mldieye
              </p>
              <v-divider class="my-3"></v-divider>
              <router-link :to="{name:'profile'}" class="text">{{ $t('public.nav.top.profile') }}</router-link>
              <v-divider class="my-3"></v-divider>
              <v-btn class="ma-3 bg-blue" rounded text @click="handleLogout">
                {{ $t('public.nav.top.deconnexion') }}
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" dark app class="bg-blue-navbar darken-6" >
      <v-layout column align-center>
        <v-flex class="mt-2 mx-auto">
            <v-avatar size="100">
              <v-img alt="Logo" class="shrink logo" rounded lazy-src="" :src="profileUrl" transition="scale-transition" width="60"  />
            </v-avatar>
            <p class="text-white subheading mt-1 text-center">mldieye</p>
        </v-flex>
      </v-layout>
      <v-divider class="mx-10 mt-3"></v-divider>
      <SidebarItem :items="fonctionItems.items"/>
    </v-navigation-drawer>
  </nav>
</template>

<script setup>
import imageUrl from '@/assets/imgs/logo_blanc.jpg'
import profileUrl from '@/assets/imgs/profile3.png'
import Localisation from '@/components/core/Localisation.vue';
import SidebarItem from '@/components/core/SidebarItem.vue';

import { ref, onMounted, reactive } from 'vue';
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app";


const appStore = useAppStore();
const { modules, fonctionnalites } = storeToRefs(appStore);
const { listeModules, listeFonctionnalitesByModule } = useAppStore();

const drawer = ref(true);
const fonctionItems = reactive({ items: [] });

defineProps({
  appName: String,
  modules: [],
});

//
const defaultSideBarItems = reactive({ items: [
  {
      "id": 1,
      "title": "Tableau de bord",
      "translate": "dashboard",
      "code": "dashboard",
      "icon": "mdi-view-dashboard",
      "route": "dashboard"
  },
  {
    "id": 2,
    "title": "Demandes",
    "translate": "demande",
    "code": "demande",
    "icon": "mdi-playlist-check",
    "route": "demande-liste"
  }
] });

onMounted(()=>{
  listeModules();
  fonctionItems.items = defaultSideBarItems.items;
});

const loadFonction = async (module) => {
  await listeFonctionnalitesByModule(module).then( (response) => {
    fonctionItems.items = fonctionnalites.value;
  });
}

//  deconnexion
const handleLogout = () => {
  console.log("handleLogout clicked");
}
</script>

<style scoped>
router-link, a{
    text-decoration: dashed !important;
}
.link-item:hover{
  cursor: pointer;
  background-color: #3490dc;
  color: white;
  font-weight: bold;
}
</style>
