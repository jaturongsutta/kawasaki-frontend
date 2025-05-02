<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Model</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <label>Model</label>
            <v-text-field v-model="formSearch.model_cd"></v-text-field>
          </v-col>
          <v-col>
            <label>Product Code</label>
            <v-text-field v-model="formSearch.product_cd"></v-text-field>
          </v-col>
          <v-col>
            <label>Status</label>
            <v-select v-model="formSearch.status" :items="[{ title: 'All', value: null }, ...statusList]"></v-select>
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
        <v-data-table-server v-model:page="currentPage" v-model:items-per-page="pageSize" :headers="headers"
          :items="items" :items-length="totalItems" @update:options="loadData">
          <template v-slot:[`item.action`]="{ item }">
            <n-gbtn-edit @click="onEdit(item)"></n-gbtn-edit>
          </template>
          <template v-slot:bottom>
            <n-pagination v-model:currentPage="currentPage" v-model:itemPerPage="pageSize"
              v-model:totalItems="totalItems"></n-pagination>
          </template>
        </v-data-table-server>
        <n-loading :loading="isLoading" />
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
      <v-form ref="frmInfo">
        <v-card>
          <v-card-title>
            <span class="headline">{{ mode }} Master - Model Information</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <label class="require-field">Model </label>
                  <v-text-field v-model="form.modelCd" :rules="[rules.required]"
                    :readonly="mode === 'Edit'"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Product Code </label>
                  <v-text-field v-model="form.productCd" :rules="[rules.required]"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Cycle Time (mins) </label>
                  <n-time v-model="form.cycleTime" :rules="[rules.required]"></n-time>
                  <!-- <v-text-field v-model="form.cycleTimeMins" v-maska="markNumberFormatOptions" reverse :rules="[rules.required,
                  v => (parseInt(v.replace(/,/g, '')) <= 1439) || 'Maximum is 1439 minutes']" type="text"></v-text-field> -->
                </v-col>
                <v-col cols="6">
                  <label>Part Name </label>
                  <v-text-field v-model="form.partName"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Part No </label>
                  <v-text-field v-model="form.partNo" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Part Upper </label>
                  <v-text-field v-model="form.partUpper" :rules="[rules.required]"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Part Lower </label>
                  <v-text-field v-model="form.partLower" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Status </label>
                  <v-select v-model="form.isActive" :rules="[rules.required]" :items="[...statusList]"></v-select>
                </v-col>
                <v-col cols="6" v-if="mode === 'Edit'">
                  <label class="require-field">Updated By </label>
                  <v-text-field v-model="form.updatedBy" :rules="[rules.required]"
                    :readonly="mode === 'Edit'"></v-text-field>
                </v-col>

                <v-col cols="6" v-if="mode === 'Edit'">
                  <label class="require-field">Updated Date </label>
                  <v-text-field v-model="form.updatedDate" :rules="[rules.required]" :readonly="mode === 'Edit'"
                    placeholder="DD/MM/YYYY HH:mm:ss"></v-text-field>
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
      <n-loading :loading="isDialogLoading" />
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, computed } from "vue";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/model.js";
import rules from "@/utils/rules";
import { getDateFormat, convertCommaToPureNumber, commaFormattedNumber } from "@/utils/utils";

const Alert = inject("Alert");
const frmInfo = ref(null);
const formSearch = ref({});
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Model", key: "Model_CD", sortable: false },
  { title: "Product Code", key: "Product_CD", sortable: false },
  {
    title: "Cycle Time (mins)", key: "Cycle_Time_Min", sortable: false, value: (item) => {
      return commaFormattedNumber(item.Cycle_Time_Min);
    },
  },
  { title: "Status", key: "Status", sortable: false },
  { title: "Updated By", key: "Updated_By", sortable: false },
  {
    title: "Updated Date",
    key: "Updated_Date",
    sortable: false,
    value: (item) => {
      return getDateFormat(item.Updated_Date);
    },
  },
];
let items = ref([]);

let isLoading = ref(false);
let isDialogLoading = ref(false);
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
  };
  dialog.value = true;
};

const onEdit = async (item) => {
  mode.value = "Edit";
  form.value = {
  };
  dialog.value = true;
  isDialogLoading.value = true;
  try {
    const res = await api.getById(item.Model_CD);
    isDialogLoading.value = false;
    if (res.status === 2) {
      Alert.error("Error ", res.message);
      return;
    }
    form.value = res.data;
    form.value.updatedDate = getDateFormat(form.value.updatedDate);
  }
  catch (e) {
    isDialogLoading.value = false;
    console.log('Error: ', e);
    Alert.error("Error ", e.message);
  }
};

const saveClick = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;
    isDialogLoading.value = true;
    let res = null;
    let params = { ...form.value }
    if (mode.value === "Add") {
      console.log("Add");
      res = await api.add(params);
    } else {
      console.log("Edit");
      res = await api.update(params.modelCd, params);
    }
    isDialogLoading.value = false;
    if (res.status === 0) {
      Alert.success();
      dialog.value = false;
      onSearch();
    } else {
      Alert.warning(res.message);
    }
  } catch (error) {
    isDialogLoading.value = false;
    Alert.error(error.message);
  }
};
</script>
