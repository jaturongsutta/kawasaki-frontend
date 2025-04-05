<template>
  <v-btn prepend-icon="mdi mdi-magnify" class="bg-gradient-info" elevation="5">
    <template v-slot:prepend>
      <v-icon color="white" size="large"></v-icon>
    </template>

    {{
      (props.label === null || props.label) === undefined
        ? "Search"
        : props.label
    }}
  </v-btn>
</template>

<script setup>
import { defineProps, onMounted } from "vue";

const props = defineProps({
  label: String,
  menuName: String,
});

onMounted(() => {});
</script>

<style scoped>
.bg-gradient-info {
  background-image: linear-gradient(310deg, rgb(68 156 0 / 87%), #a3f862 100%);
  color: #fff;
}
</style>
