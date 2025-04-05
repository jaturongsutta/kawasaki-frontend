<template>
  <v-btn prepend-icon="mdi mdi-upload" class="bg-gradient-info">
    <template v-slot:prepend>
      <v-icon color="white" size="large"></v-icon>
    </template>

    {{
      (props.label === null || props.label) === undefined
        ? "Upload"
        : props.label
    }}
  </v-btn>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";

const props = defineProps({
  label: String,
});

onMounted(() => {});
</script>

<style scoped>
.bg-gradient-info {
  background-image: linear-gradient(310deg, rgb(68 156 0 / 87%), #a3f862 100%);
  color: #fff;
}
</style>
