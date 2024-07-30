<template>
  <div>
    Dashboard page<br/>
    <button @click="handleDownloadFile">Download File</button><br/>
    <PdfApp style="height: 80vh" :pdf="pdfSrc"></PdfApp>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";

import VuePdfApp from "vue3-pdf-app";
import PdfApp from "vue3-pdf-app";
// import this to use default icons for buttons
import "vue3-pdf-app/dist/icons/main.css";
import pdfTest from '@/assets/pdf/releve1.pdf'

import { useUserStore } from "@/store/user";
//const userStore = useUserStore();
//const { pdfSrc, loading, error } = storeToRefs(userStore);
//const { downloadFile } = userStore;

const pdfA = ref("/releve1.pdf");

//  traitement de la connexion
/*const handleDownloadFile = () => {
  console.log("Download file");
  downloadFile("0523PG1316143").then( (response) => {
    console.log("Download file api");
  });
}*/
</script>
