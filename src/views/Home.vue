<template>
  <div class="d-flex flex-column align-center" >
      <v-row no-gutters class="bg-black w-100 px-12 pt-10 mb-3 pb-10 flex-sm-row">
        <v-col cols="8">
          <v-flex xs12 sm8 md4>
            <h1 class=" font-weight-bold mt-3">
              {{ $t('public.hero.titre') }}
            </h1>
            <p class="subheading font-weight-regular text-white-50">
              {{ $t('public.hero.soustitre') }},
              <br>{{ $t('public.hero.pasdecompte') }}
              <v-btn class="text-caption large" large>
                <router-link :to="{name:'register'}"><span class="text hidden-sm-and-down text-black"> {{ $t('public.nav.top.inscription') }}</span></router-link>
              </v-btn>
            </p>
          </v-flex>
        </v-col>
        <v-col cols="4">
          <v-flex xs12 sm8 md4>
            <v-card>
              <v-img
                :src="heroImage3"
                :lazy-src="heroImage"
                cover
                class="mx-auto"
                max-height="500"
                max-width="500"
              ></v-img>
            </v-card>
          </v-flex>
        </v-col>
      </v-row>
      <v-row no-gutters class="w-100 px-12 mb-3 pb-10 justify-between">
        <v-col cols="4">
          <v-flex xs12 sm8 md4>
            <v-card elevation="10">
              <v-img
                :src="dir"
                :lazy-src="heroImage"
                cover
                class="mx-auto"
                max-height="500"
                max-width="500"
              ></v-img>
            </v-card>
          </v-flex>
        </v-col>
        <v-col cols="8" justify-end>
          <v-flex xs12 sm8 md4>
            <h1 class="font-weight-bold mt-3 text-center">
              Mot du Directeur
            </h1>
            <p class="subheading font-weight-regular pa-12 text-black">
              Bonjour à chacun.e <br>
              C'est un grand honneur pour moi, d'assumer depuis le 1er xxx 201X, les fonctions de Directeur de l'Institut Polyvalence Médico Sociale.
              <br>Le Recteur, président de l'assemblée de l'Université Cheikh Anta Diop de Dakar a choisi de me faire confiance pour assurer le suivi personnel du personnel de l'UCAD et offrir un service de qualité à la communauté universiatire.
              <br>C'est avec grand plaisir que j'accueille la mission qui m'est confiée et par la même occasion vous souhaiter la bienvenue dans notre plateforme de suivi et de gestion de l'IPMS.
              <br><span class="text-caption">Professeur Abdoul KANE / Directeur de l'IPMS</span>
            </p>
          </v-flex>
        </v-col>
      </v-row>
      <v-row no-gutters class=" w-100 px-12 mb-3 pb-10 flex-sm-row">

      </v-row>
  </div>
</template>

<script setup>
import heroImage from '@/assets/imgs/off1.jpeg'
import heroImage2 from '@/assets/imgs/off2.jpg'
import heroImage3 from '@/assets/imgs/off3.jpeg'
import dir from '@/assets/imgs/dir2.jpeg'
</script>
