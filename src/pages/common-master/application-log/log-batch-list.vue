<template>
  <div class="mx-4">
    <v-card class="py-4">
      <v-tabs v-model="tab" @update:model-value="tabChange">
        <v-tab value="combined">Combined</v-tab>
        <v-tab value="error">Error</v-tab>
        <v-tab value="batchjob">Batch Job</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="combined"> </v-tabs-window-item>

          <v-tabs-window-item value="error"> </v-tabs-window-item>

          <v-tabs-window-item value="batchjob">
            <log-batch-job-list></log-batch-job-list>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import logBatchJobList from "@/components/application-log/log-batch-job-list.vue";

import { useRouter } from "vue-router";
const router = useRouter();
const tab = ref("batchjob");

const tabChange = (value) => {
  console.log("tabChange", value);
  if (value === "combined") {
    router.push({ name: "application-log" });
  } else if (value === "error") {
    router.push({ name: "log-error-list" });
  } else if (value === "batchjob") {
    // router.push({ name: "log-batchjob-list" });
  }
};
</script>

<style></style>
