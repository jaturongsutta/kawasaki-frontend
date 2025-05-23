<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Master - Line</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <label>Line Code</label>
            <v-text-field v-model="formSearch.line_cd"></v-text-field>
          </v-col>
          <v-col>
            <label>Line Name</label>
            <v-text-field v-model="formSearch.line_name"></v-text-field>
          </v-col>
          <v-col>
            <label>Status</label>
            <v-select
              v-model="formSearch.status"
              :items="[{ title: 'All', value: null }, ...statusList]"
            ></v-select>
          </v-col>
        </v-row>

        <div class="row">
          <div class="d-flex justify-center">
            <n-btn-search @click="onSearch" />
            <n-btn-reset @click="onReset" class="ml-3" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-text>
        <n-btn-add label="Add" @click="onAdd" class="mb-3"></n-btn-add>
        <v-data-table-server
          v-model:page="currentPage"
          v-model:items-per-page="pageSize"
          :headers="headers"
          :items="items"
          :items-length="totalItems"
          @update:options="loadData"
        >
          <template v-slot:[`item.action`]="{ item }">
            <n-gbtn-edit @click="onEdit(item.Line_CD)"></n-gbtn-edit>
          </template>
          <template v-slot:bottom>
            <n-pagination
              v-model:currentPage="currentPage"
              v-model:itemPerPage="pageSize"
              v-model:totalItems="totalItems"
            ></n-pagination>
          </template>
        </v-data-table-server>
        <n-loading :loading="isLoading" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/line.js";
import rules from "@/utils/rules";
import moment from "moment";

import { getCurrrentDate, getDateFormat } from "@/utils/utils.js";
const Alert = inject("Alert");
const router = useRouter();
let formSearch = ref({
  line: null,
  status: "Y",
});
let form = ref({});

let statusList = ref([]);
let lineList = ref([]);

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Pk Code", key: "PK_CD", sortable: false },
  { title: "Line Code", key: "Line_CD", sortable: false },
  { title: "Line Name", key: "Line_Name", sortable: false },
  { title: "Status", key: "Status_Name", sortable: false },
  { title: "Updated By", key: "UPDATED_BY", sortable: false },
  {
    title: "Updated Date",
    key: "UPDATED_DATE",
    sortable: false,
    value: (item) => {
      return item.UPDATED_DATE ? getDateFormat(item.UPDATED_DATE) : "";
    },
  },
];
let items = ref([]);

let isLoading = ref(false);

let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);

onMounted(() => {
  ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
    statusList.value = data;
  });
});

const onSearch = async () => {
  currentPage.value = 1;
  loadData({ page: currentPage.value, itemsPerPage: pageSize.value });
};

const loadData = async (paginate) => {
  const { page, itemsPerPage } = paginate;

  const searchOptions = getPaging({ page, itemsPerPage });

  try {
    isLoading.value = true;
    const data = {
      ...formSearch.value,
      searchOptions,
    };

    const response = await api.search(data);

    items.value = response.data;
    totalItems.value = response.total_record;
  } catch (error) {
    console.error("Error fetching API:", error);
    items.value = [];
    totalItems.value = 0;
  }
  isLoading.value = false;
};

const onReset = () => {
  formSearch.value = {
    line: null,
    status: "Y",
  };
  onSearch();
};

const onAdd = () => {
  router.push({ name: "line-info" });
};

const onEdit = (id) => {
  router.push({ name: "line-info", params: { id: id } });
};

const onDelete = (id) => {
  Alert.confirm("Are you sure you want to delete this line ?").then(
    ({ isConfirmed }) => {
      if (isConfirmed) {
        isLoading.value = true;
        api
          .remove(id)
          .then((res) => {
            isLoading.value = false;
            if (res.status === 0) {
              Alert.success("Delete successfully");
              onSearch();
            } else if (res.status === 1) {
              Alert.warning(res.message);
            } else {
              Alert.error(res.message);
            }
          })
          .catch((error) => {
            isLoading.value = false;
            console.error("Error fetching API:", error);
            Alert.error(error.message);
          });
      }
    }
  );
};
</script>
