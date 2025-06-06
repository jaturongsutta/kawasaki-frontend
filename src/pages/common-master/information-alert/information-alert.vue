<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Master - Information Alert</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <label>Line</label>
            <v-select v-model="formSearch.lineCd" :items="lineList"></v-select>
          </v-col>
          <v-col>
            <label>Date From</label>
            <n-date v-model="formSearch.dateFrom"
              @update:modelValue="formSearch.dateTo = null"></n-date>
          </v-col>
          <v-col>
            <label>Date To</label>
            <n-date v-model="formSearch.dateTo" :min-date="formSearch.dateFrom"></n-date>
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
            <span class="headline">{{ mode }} Master - Information Alert</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6" v-if="mode === 'Edit'">
                  <label class="require-field">Id </label>
                  <v-text-field v-model="form.id" readonly></v-text-field>
                </v-col>
                <v-col :cols="mode === 'Edit' ? 6 : 12">
                  <label class="require-field">Line </label>
                  <v-select v-model="form.lineCd" :items="lineList" :rules="[rules.required]"></v-select>
                </v-col>

                <v-col cols="12">
                  <label class="require-field">Information Alert </label>
                  <v-textarea v-model="form.infoAlert" auto-grow rows="3" :rules="[rules.required]" />
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Start Date </label>
                  <n-date v-model="form.alertStartDate" :rules="[rules.required]"
                    @update:modelValue="form.alertEndDate = null;"></n-date>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Start Time </label>
                  <n-time v-model="form.alertStartTime" :rules="[rules.required]" />
                </v-col>

                <v-col cols="6">
                  <label class="require-field">End Date</label>
                  <n-date v-model="form.alertEndDate" :rules="[rules.required]"
                    :min-date="form.alertStartDate"></n-date>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">End Time </label>
                  <n-time v-model="form.alertEndTime" :rules="[rules.required]" />
                </v-col>
                <v-col cols="12">
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
import { onMounted, ref, inject } from "vue";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/information-alert.js";
import rules from "@/utils/rules";
import { getDateFormat } from "@/utils/utils";

const Alert = inject("Alert");
const frmInfo = ref(null);
const formSearch = ref({});
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Line", key: "Line_CD", sortable: false },
  { title: "Information Alert", key: "Info_Alert", sortable: false },
  {
    title: "Start Date", key: "Alert_Start_Date", sortable: false, value: (item) => {
      return getDateFormat(item.Alert_Start_Date, "dd/MM/yyyy");
    }
  },
  {
    title: "Start Time", key: "Alert_Start_Time", sortable: false, value: (item) => {
      return getDateFormat(item.Alert_Start_Time, "HH:mm");
    }
  },
  {
    title: "End Date", key: "Alert_End_Date", sortable: false, value: (item) => {
      return getDateFormat(item.Alert_End_Date, "dd/MM/yyyy");
    }
  },
  {
    title: "End Time", key: "Alert_End_Time", sortable: false, value: (item) => {
      return getDateFormat(item.Alert_End_Time, "HH:mm");
    }
  },
  { title: "Status", key: "Status_Name", sortable: false },
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

const lineList = ref([]);

let isLoading = ref(false);
let isDialogLoading = ref(false);
let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);

onMounted(() => {
  ddlApi.lineAll().then((data) => {
    lineList.value = data;
  });

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
    const res = await api.getById(item.ID);
    isDialogLoading.value = false;
    if (res.status === 2) {
      Alert.error("Error ", res.message);
      return;
    }
    form.value = res.data;
    form.value.alertStartDate = getDateFormat(form.value.alertStartDate, 'yyyy-MM-dd');
    form.value.alertEndDate = getDateFormat(form.value.alertEndDate, 'yyyy-MM-dd');
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
    params.alertStartTime = `${params.alertStartTime}:00`;
    params.alertEndTime = `${params.alertEndTime}:00`;

    if (mode.value === "Add") {
      console.log("Add");
      res = await api.add(params);
    } else {
      console.log("Edit");
      res = await api.update(params.id, params);
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
