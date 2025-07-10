<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Reason Maching Process</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="2">
            <label>Predefine Group</label>
            <v-select
              v-model="formSearch.predefineGroup"
              :items="[{ title: 'All', value: null }, ...predefineGroupList]"
              dense
              @update:model-value="onPredefineGroupSearchChange"
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <label>Predefine</label>
            <v-select
              v-model="formSearch.predefineCd"
              :items="[{ title: 'All', value: null }, ...predefineSearchList]"
              dense
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <label>Process</label>
            <v-select
              v-model="formSearch.processCd"
              :items="[{ title: 'All', value: null }, ...predefineProcessList]"
              dense
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <label>Value (EN)</label>
            <v-text-field v-model="formSearch.valueEN" dense />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <label>Value (TH)</label>
            <v-text-field v-model="formSearch.valueTH" dense />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="2">
            <label>Status</label>
            <v-select
              v-model="formSearch.isActive"
              :items="[{ title: 'All', value: null }, ...statusList]"
              dense
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-center">
          <n-btn-search @click="onSearch" />
          <n-btn-reset @click="onReset" class="ml-3" />
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-text>
        <v-row class="mb-1 mt-1">
          <v-col cols="6">
            <n-btn-add label="Add" @click="onAdd" />
          </v-col>
          <v-col cols="6" class="text-right">
            <n-btn-export label="Export Reason (PDF)" @click="onExportPDF" />
          </v-col>
        </v-row>
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
              @click="
                onEdit(
                  item.Predefine_Group,
                  item.Predefine_CD,
                  item.Process_CD,
                  item.Predefine_Item_CD
                )
              "
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
            <span class="headline">{{ mode }} Reason Maching Process</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <label class="require-field">Predefine Group </label>
                  <v-select
                    v-model="form.predefineGroup"
                    :rules="[rules.required]"
                    :items="predefineGroupList"
                    @update:model-value="onPredefineGroupChange"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Predefine </label>
                  <v-select
                    v-model="form.predefineCd"
                    :rules="[rules.required]"
                    :items="predefineCdList"
                    @update:model-value="onPredefineCdChange"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Predefine Item </label>
                  <v-select
                    v-model="form.predefineItemCd"
                    :rules="[rules.required]"
                    :items="predefineItemList"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Process </label>
                  <v-select
                    v-model="form.processCd"
                    :rules="[rules.required]"
                    :items="predefineProcessList"
                  ></v-select>
                </v-col>
                <v-col cols="12">
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
      <n-loading :loading="isDialogLoading" />
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/common-master/predefine-item-process.js";
import rules from "@/utils/rules";
import moment from "moment";
const Alert = inject("Alert");
const frmInfo = ref(null);
const formSearch = ref({});
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);
const predefineGroupList = ref([]);
const predefineSearchList = ref([]);
const predefineCdList = ref([]);
const predefineItemList = ref([]);
const predefineProcessList = ref([]);
const previousEditItem = ref({});

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Predefine Group", key: "Predefine_Group", sortable: false },
  { title: "Predefine Name", key: "Predefine_Name", sortable: false },
  { title: "Process", key: "Process_CD", sortable: false },
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
let isDialogLoading = ref(false);
let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);

onMounted(() => {
  ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
    statusList.value = data;
    formSearch.value.isActive = "Y";
  });

  api.getDropDownPredefindGroup().then((data) => {
    predefineGroupList.value = data;
  });

  api.getDropDownMachineProcess().then((data) => {
    predefineProcessList.value = data;
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
  predefineSearchList.value = [];
  onSearch();
};

const onAdd = () => {
  mode.value = "Add";
  console.log("Add");
  form.value = {
    predefineGroup: "",
    predefineCd: "",
    predefineItemCd: "",
    processCd: "",
    isActive: "Y",
  };
  predefineCdList.value = [];
  predefineItemList.value = [];
  dialog.value = true;
};

const onExportPDF = async () => {
  try {
    isLoading.value = true;
    await api.exportPdf(formSearch.value);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    Alert.error("Failed to export PDF: " + error.message);
  } finally {
    isLoading.value = false;
  }
};

const onEdit = (predefineGroup, predefineCd, processCd, predefineItemCd) => {
  mode.value = "Edit";
  dialog.value = true;

  ddlApi.getPredefine(predefineGroup).then((data) => {
    predefineCdList.value = data;
  });
  api.getDropDownPredefindItem(predefineGroup, predefineCd).then((data) => {
    predefineItemList.value = data;
  });

  api.getById(processCd, predefineItemCd).then(async (res) => {
    form.value = res.data;
    previousEditItem.value = { ...form.value };
  });
};

const saveClick = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;
    isDialogLoading.value = true;
    let res = null;
    if (mode.value === "Add") {
      res = await api.saveAdd(form.value);
    } else {
      res = await api.saveEdit(previousEditItem.value, form.value);
    }

    isDialogLoading.value = false;
    if (res.data.status === 0) {
      Alert.success();
      dialog.value = false;
      onSearch();
    } else {
      Alert.warning(res.data.message);
    }
  } catch (error) {
    isDialogLoading.value = false;
    Alert.error(error.message);
  }
};

const onPredefineGroupSearchChange = (value) => {
  if (value) {
    ddlApi.getPredefine(value).then((data) => {
      predefineSearchList.value = data;
    });
  } else {
    predefineSearchList.value = [];
  }
};

const onPredefineGroupChange = (value) => {
  console.log("Selected Predefine Group:", value);
  if (value) {
    predefineCdList.value = [];
    predefineItemList.value = [];
    form.value.predefineCd = "";
    form.value.predefineItemCd = "";
    ddlApi.getPredefine(value).then((data) => {
      predefineCdList.value = data;
    });
  } else {
    predefineCdList.value = [];
  }
};

const onPredefineCdChange = (value) => {
  console.log("predefineGroup : ", form.value.predefineGroup);
  if (value) {
    form.value.predefineItemCd = "";
    api
      .getDropDownPredefindItem(form.value.predefineGroup, value)
      .then((data) => {
        predefineItemList.value = data;
      });
  } else {
    predefineItemList.value = [];
  }
};
</script>
