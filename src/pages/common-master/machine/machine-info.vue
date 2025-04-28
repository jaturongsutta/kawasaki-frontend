<template>
  <div>
    <v-form ref="frmInfo">
      <v-card>
        <v-card-title>
          <h4>{{ pageMode === "add" ? "Add" : "Edit" }} Master - Machine</h4>
        </v-card-title>

        <v-tabs v-model="tab">
          <v-tab value="main">Information</v-tab>
          <v-tab value="tool" v-if="pageMode === 'edit'">Tool</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="main">
              <info />
            </v-tabs-window-item>
            <v-tabs-window-item value="tool">
              <tool />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import Info from "@/components/master-machine/info.vue";
import Tool from "@/components/master-machine/tool.vue";

const route = useRoute();

let tab = ref("main");

let pageMode = ref("add");

onMounted(() => {
  if (route.params.id) {
    pageMode.value = "edit";
  }
});
</script>
