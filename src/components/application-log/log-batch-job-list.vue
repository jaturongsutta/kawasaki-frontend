<template>
  <div>
    <v-data-table
      v-model:page="currentPage"
      :headers="headers"
      :items="items"
      :items-per-page="pageSize"
      :group-by="groupBy"
    >
      <template
        v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
      >
        <tr>
          <td :colspan="columns.length">
            <div class="d-flex align-center">
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                color="medium-emphasis"
                density="comfortable"
                size="small"
                variant="outlined"
                @click="toggleGroup(item)"
              ></v-btn>

              <span class="ms-4">{{ item.value }}</span>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <n-gbtn-view @click="onView(item)"></n-gbtn-view>
      </template>
      <template v-slot:bottom>
        <n-pagination
          v-model:currentPage="currentPage"
          v-model:itemPerPage="pageSize"
          v-model:totalItems="totalItems"
        ></n-pagination>
      </template>
    </v-data-table>

    <n-loading :loading="isLoading" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as api from "@/api/common-master/application-log";
import { useRouter } from "vue-router";

const router = useRouter();
let isLoading = ref(false);
const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Line", key: "folders", sortable: true },
  { title: "Filename", key: "filename", sortable: true },
];
const groupBy = [{ key: "folders", order: "asc" }];
let items = ref([]);
let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);

onMounted(() => {
  isLoading.value = true;

  api.search().then((res) => {
    items.value = res.logBatchJob;
    totalItems.value = items.value.length;

    items.value.sort((a, b) => b.filename.localeCompare(a.filename));

    isLoading.value = false;
  });
});

const onView = (item) => {
  const filename = item.folders + "_" + item.filename;
  router.push({
    name: "application-log-preview",
    params: { logtype: "BatchJob", filename: filename },
  });
};
</script>
