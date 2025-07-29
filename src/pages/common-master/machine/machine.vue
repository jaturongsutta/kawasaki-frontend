<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Master - Machine</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <label>Machine No</label>
            <v-text-field v-model="formSearch.machine_no"></v-text-field>
          </v-col>
          <v-col>
            <label>Process Code</label>
            <v-text-field v-model="formSearch.process_cd"></v-text-field>
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
            <n-gbtn-edit @click="onEdit(item.Machine_No, item.Process_CD)"></n-gbtn-edit>
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
                  <v-text-field v-model="form.Model_CD" :rules="[rules.required]"
                    :readonly="mode === 'Edit'"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Product Code </label>
                  <v-text-field v-model="form.Product_CD" :rules="[rules.required]"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Cycle Time (mins) </label>
                  <v-text-field v-model="form.Cycle_Time_Min" :rules="[rules.required]" type="number"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label>Part Name </label>
                  <v-text-field v-model="form.predefineCd"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Part No </label>
                  <v-text-field v-model="form.Part_No" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Part Upper </label>
                  <v-text-field v-model="form.Part_Upper" :rules="[rules.required]"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Part Lower </label>
                  <v-text-field v-model="form.Part_Lower" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Status </label>
                  <v-select v-model="form.Status" :rules="[rules.required]" :items="[...statusList]"></v-select>
                </v-col>
                <v-col cols="6" v-if="mode === 'Edit'">
                  <label class="require-field">Updated By </label>
                  <v-text-field v-model="form.Updated_By" :rules="[rules.required]"
                    :readonly="mode === 'Edit'"></v-text-field>
                </v-col>

                <v-col cols="6" v-if="mode === 'Edit'">
                  <label class="require-field">Updated Date </label>
                  <v-text-field v-model="form.Updated_Date" :rules="[rules.required]" :readonly="mode === 'Edit'"
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
import { useRouter } from "vue-router";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/machine.js";
import rules from "@/utils/rules";
import { getDateFormat } from "@/utils/utils";
import { usePageState } from '@/stores/search/master-machine'
const pageState = usePageState()

const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const formSearch = ref({
  machine_no: pageState.machineNo,
  process_cd: pageState.processCd,
  status: pageState.status
});
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Machine No", key: "Machine_No", sortable: false },
  { title: "Process Code", key: "Process_CD", sortable: false },
  { title: "Map Code", key: "Map_CD", sortable: false },
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

    pageState.setSearchData(data);
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
  router.push({ name: "machine-info" });
};

const onEdit = (machineNo, processCd) => {
  router.push({ name: `machine-info`, params: { id: machineNo, processCd: processCd } });
};

const saveClick = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;
    isDialogLoading.value = true;
    let res = null;
    if (mode.value === "Add") {
      console.log("Add");
      res = await api.add(form.value);
    } else {
      console.log("Edit");
      res = await api.update(form.value.Model_CD, form.value);
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
