<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>User</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <label>Username</label>
            <v-text-field v-model="formSearch.username"></v-text-field>
          </v-col>
          <v-col>
            <label>First Name</label>
            <v-text-field v-model="formSearch.firstName"></v-text-field>
          </v-col>
          <v-col>
            <label>Last Name</label>
            <v-text-field v-model="formSearch.lastName"></v-text-field>
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
        <n-btn-add label="Add" @click="onAdd"></n-btn-add>
        <v-data-table-server
          v-model:page="currentPage"
          v-model:items-per-page="pageSize"
          :headers="headers"
          :items="items"
          :items-length="totalItems"
          @update:options="loadData"
        >
          <template v-slot:[`item.action`]="{ item }">
            <n-gbtn-edit @click="onEdit(item.USER_ID)"></n-gbtn-edit>
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
import * as api from "@/api/common-master/user.js";
import moment from "moment";
const router = useRouter();
let formSearch = ref({});

let statusList = ref([]);

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Username", key: "Username", sortable: true },
  { title: "First Name", key: "First_Name", sortable: true },
  { title: "Last Name", key: "Last_Name", sortable: true },
  { title: "Position Name", key: "Position_Name", sortable: true },
  { title: "Status", key: "Status_Name", sortable: true },
  // { title: "Created By", key: "Created_By", sortable: true },
  // {
  //   title: "Created Date",
  //   key: "Created_Date",
  //   sortable: true,
  //   value: (item) => {
  //     return item.Created_Date
  //       ? moment.utc(item.Created_Date).format("DD/MM/YYYY HH:mm:ss")
  //       : "";
  //   },
  // },
  { title: "Updated By", key: "Updated_By", sortable: true },
  {
    title: "Updated Date",
    key: "Updated_Date",
    sortable: true,
    value: (item) => {
      return item.Updated_Date
        ? moment.utc(item.Updated_Date).format("DD/MM/YYYY HH:mm:ss")
        : "";
    },
  },
];
let items = ref([]);

let isLoading = ref(false);
let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);

const mode = ref("Add");

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
  formSearch.value = {};
  items.value = [];
  totalItems.value = 0;
  onSearch();
};

const onAdd = () => {
  router.push({ name: "user-info", params: { id: null } });
};

const onEdit = (id) => {
  router.push({ name: "user-info", params: { id } });
};
</script>
