<template>
  <div class="qr-container">
    <v-card class="mx-auto my-12" max-width="400">
      <v-card-title>
        <h4>Download APK</h4>
      </v-card-title>
      <v-card-text class="d-flex flex-column align-center">
        <QRCodeVue3
          :value="backendUrl"
          :dotsOptions="{
            type: 'square',
          }"
          :cornersSquareOptions="{ type: 'square', color: '#000000' }"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import QRCodeVue3 from "qrcode-vue3";
const backendUrl = import.meta.env.VITE_API_URL + "/apk"; // Adjust as needed

onMounted(() => {
  console.log("Backend URL:", backendUrl);
});
</script>

<style scoped>
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
#qrcode {
  margin: 0 auto;
}
</style>
