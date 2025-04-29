<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>{{ pageMode === "add" ? "Add" : "Edit" }} Master - Machine Information</h4>
      </v-card-title>
      <v-card-text>
        <info />
      </v-card-text>
    </v-card>
    <v-card v-if="pageMode === 'edit'" class="mt-3">
      <tool />
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import Info from "@/components/master-machine/info.vue";
import Tool from "@/components/master-machine/tool.vue";

const route = useRoute();
let pageMode = ref("add");

onMounted(() => {
  if (route.params.id) {
    pageMode.value = "edit";
  }
});
</script>
