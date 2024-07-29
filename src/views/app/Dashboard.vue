<template>
  <div>
    Dashboard page<br/>
    <button @click="downloadFile">Download File</button><br/>
    <PdfApp style="height: 80vh" pdf="/rapport-1.pdf"></PdfApp>
  </div>
</template>

<script setup>
import VuePdfApp from "vue3-pdf-app";
import PdfApp from "vue3-pdf-app";
// import this to use default icons for buttons
import "vue3-pdf-app/dist/icons/main.css";
import pdfTest from '@/assets/pdf/rapport-1.pdf'
</script>
