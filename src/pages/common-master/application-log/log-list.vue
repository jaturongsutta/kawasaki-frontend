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
          <v-tabs-window-item value="combined">
            <log-detail-list></log-detail-list>
          </v-tabs-window-item>

          <v-tabs-window-item value="error">
            <log-error-list></log-error-list>
          </v-tabs-window-item>

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
import logDetailList from "@/components/application-log/log-detail-list.vue";
import logErrorList from "@/components/application-log/log-error-list.vue";
import logBatchJobList from "@/components/application-log/log-batch-job-list.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const tab = ref("combined");

const tabChange = (value) => {
  console.log("tabChange", value);
  if (value === "combined") {
    // router.push({ name: "log-combined" });
  } else if (value === "error") {
    router.push({ name: "log-error-list" });
  } else if (value === "batchjob") {
    router.push({ name: "log-batchjob-list" });
  }
};
</script>

<style></style>
