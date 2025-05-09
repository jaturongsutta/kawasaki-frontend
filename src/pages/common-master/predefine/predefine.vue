<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Predefine</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <label>Predefine Group</label>
            <v-text-field v-model="formSearch.predefineGroup"></v-text-field>
          </v-col>
          <v-col>
            <label>Predefine Code</label>
            <v-text-field v-model="formSearch.predefineCd"></v-text-field>
          </v-col>
          <v-col>
            <label>Value(EN)</label>
            <v-text-field v-model="formSearch.valueEN"></v-text-field>
          </v-col>
          <v-col>
            <label>Value(TH)</label>
            <v-text-field v-model="formSearch.valueTH"></v-text-field>
          </v-col>
          <v-col>
            <label>Status</label>
            <v-select
              v-model="formSearch.isActive"
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
            <n-gbtn-edit
              @click="onEdit(item.Predefine_Group, item.Predefine_CD)"
            ></n-gbtn-edit>
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

    <v-dialog v-model="dialog" max-width="600px">
      <v-form ref="frmInfo">
        <v-card>
          <v-card-title>
            <span class="headline">{{ mode }} Predefine</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <label class="require-field">Predefine Group </label>
                  <v-text-field
                    v-model="form.predefineGroup"
                    :rules="[rules.required]"
                    :readonly="mode === 'Edit'"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Predefine Code </label>
                  <v-text-field
                    v-model="form.predefineCd"
                    :rules="[rules.required]"
                    :readonly="mode === 'Edit'"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <label class="require-field">Value(EN) </label>
                  <v-text-field
                    v-model="form.valueEn"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <label class="require-field">Value(TH) </label>
                  <v-text-field
                    v-model="form.valueTh"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <label>Description </label>
                  <v-text-field v-model="form.description"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label>Status </label>
                  <v-select
                    v-model="form.isActive"
                    :rules="[rules.required]"
                    :items="[...statusList]"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>
          <div class="d-flex justify-center py-3">
            <n-btn-save @click="saveClick" class="me-3"></n-btn-save>
            <n-btn-cancel text @click="dialog = false"></n-btn-cancel>
          </div>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/common-master/predefine.js";
import rules from "@/utils/rules";
import moment from "moment";
const Alert = inject("Alert");
const frmInfo = ref(null);
const formSearch = ref({});
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Predefine Group", key: "Predefine_Group", sortable: false },
  { title: "Predefine Code", key: "Predefine_CD", sortable: false },
  { title: "Value(EN)", key: "Value_EN", sortable: false },
  { title: "Value(TH)", key: "Value_TH", sortable: false },
  { title: "Status", key: "Status_Name", sortable: false },
  { title: "Updated By", key: "Updated_By", sortable: false },
  {
    title: "Updated Date",
    key: "Updated_Date",
    sortable: false,
    value: (item) => {
      return item.Updated_Date
        ? moment(item.Updated_Date).utc().format("DD/MM/YYYY HH:mm:ss")
        : "";
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
    formSearch.value.isActive = "Y";
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
    isActive: "Y",
  };
  items.value = [];
  totalItems.value = 0;
  onSearch();
};

const onAdd = () => {
  mode.value = "Add";
  console.log("Add");
  form.value = {
    predefineGroup: "",
    predefineCd: "",
    valueEn: "",
    valueTh: "",
    description: "",
    isActive: "Y",
  };
  dialog.value = true;
};

const onEdit = (predefineGroup, predefineCd) => {
  mode.value = "Edit";
  dialog.value = true;
  api.getById(predefineGroup, predefineCd).then((res) => {
    form.value = res.data;
  });
};

const saveClick = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;
    let res = null;
    if (mode.value === "Add") {
      console.log("Add");
      res = await api.saveAdd(form.value);
    } else {
      console.log("Edit");
      res = await api.saveEdit(form.value);
    }

    if (res.data.status === 0) {
      Alert.success();
      dialog.value = false;
      onSearch();
    } else {
      Alert.warning(res.data.message);
    }
  } catch (error) {
    Alert.error(error.message);
  }
};
</script>
