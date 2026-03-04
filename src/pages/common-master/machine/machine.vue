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
        <n-btn label="Tool Life Alarm Setup" class="orange-gradient-btn ml-3" @click="onToolLifeSetup"></n-btn>
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

    <v-dialog v-model="dialog" max-width="900px">
      <v-form ref="frmInfo">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="headline">Tool Life Alarm Setup</span>
            <n-btn-add label="Add" @click="onAddTooLifeAlarm"></n-btn-add>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-data-table-server v-model:page="toolLifeCurrentPage" v-model:items-per-page="toolLifePageSize"
              :headers="toolLifeHeaders" :items="toolLifeItems" :items-length="toolLifeTotalItems"
              @update:options="loadToolLifeAlarm">
              <template v-slot:[`item.action`]="{ item }">
                <n-gbtn-edit :permission="false" @click="onToolLifeEdit(item)"></n-gbtn-edit>

                <n-gbtn-delete :permission="false" @click="onToolLifeDelete(item.ID)"></n-gbtn-delete>
              </template>

              <template v-slot:bottom>
                <n-pagination v-model:currentPage="toolLifeCurrentPage" v-model:itemPerPage="toolLifePageSize"
                  v-model:totalItems="toolLifeTotalItems"></n-pagination>
              </template>
            </v-data-table-server>
          </v-card-text>
        </v-card>
      </v-form>
      <n-loading :loading="isDialogLoading" />
    </v-dialog>

    <v-dialog v-model="addDialog" max-width="600px">
      <v-form ref="frmInfo">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="headline">{{ toolLifeMode }}: Tool Life Alarm Setup</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>

                <v-col cols="6">
                  <label class="require-field">Tool Life </label>
                  <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.toolLifeLimit" type="text"
                    inputmode="numeric" :rules="[rules.requiredMoreThanZero]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Warning Amt </label>
                  <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.warningAmt" type="text"
                    :rules="[rules.requiredMoreThanZero]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Alert Amt </label>
                  <v-text-field v-maska="markNumberFormatOptions" v-model="form.alertAmt" type="text"
                    inputmode="numeric" reverse :rules="[rules.requiredMoreThanZero]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Alarm Amt </label>
                  <v-text-field v-maska="markNumberFormatOptions" type="text" v-model="form.alarmAmt" reverse
                    :rules="[rules.requiredMoreThanZero]"></v-text-field>
                </v-col>

                <v-col cols="6" v-if="toolLifeMode === 'Edit'">
                  <label>Updated By </label>
                  <v-text-field v-model="form.updatedBy" :readonly="toolLifeMode === 'Edit'"></v-text-field>
                </v-col>

                <v-col cols="6" v-if="toolLifeMode === 'Edit'">
                  <label>Updated Date </label>
                  <v-text-field v-model="form.updatedDate" :readonly="toolLifeMode === 'Edit'"
                    placeholder="DD/MM/YYYY HH:mm:ss"></v-text-field>
                </v-col>

              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>
          <div class="d-flex justify-center py-3">
            <n-btn-save @click="saveClick" class="me-3"></n-btn-save>
            <n-btn-cancel text @click="addDialog = false"></n-btn-cancel>
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
import { getDateFormat, markNumberFormatOptions, convertCommaToPureNumber, commaFormattedNumber } from "@/utils/utils";
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
const addDialog = ref(false);
const statusList = ref([]);
const toolLifeMode = ref('Add');
const selectedToolLifeId = ref('');

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

const toolLifeHeaders = [
  { title: "Action", key: "action", sortable: false, nowrap: true },
  {
    title: "Tool Life Limit", key: "Tool_Life_Limit", sortable: false, value: (item) => {
      return commaFormattedNumber(item.Tool_Life_Limit);
    }
  },
  {
    title: "Warning Amt", key: "Warning_Amt", sortable: false, value: (item) => {
      return commaFormattedNumber(item.Warning_Amt);
    }
  },
  {
    title: "Alert Amt", key: "Alert_Amt", sortable: false, value: (item) => {
      return commaFormattedNumber(item.Alert_Amt);
    }
  },
  {
    title: "Alarm Amt", key: "Alarm_Amt", sortable: false, value: (item) => {
      return commaFormattedNumber(item.Alarm_Amt);
    }
  },

  {
    title: "Updated Date",
    key: "Updated_Date",
    sortable: false,
    value: (item) => {
      return getDateFormat(item.Updated_Date);
    },
  },
  { title: "Updated By", key: "Updated_By", sortable: false },
];

let items = ref([]);
let toolLifeItems = ref([]);

let isLoading = ref(false);
let isDialogLoading = ref(false);
let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);

let toolLifeCurrentPage = ref(1);
let toolLifePageSize = ref(20);
let toolLifeTotalItems = ref(0);

onMounted(() => {
  ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
    statusList.value = data;
  });
  onLoadToolLife();
});

const onLoadToolLife = async () => {
  toolLifeCurrentPage.value = 1;
  loadToolLifeAlarm({ page: toolLifeCurrentPage.value, itemsPerPage: toolLifePageSize.value });
}

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

const loadToolLifeAlarm = async (paginate) => {
  const { page, itemsPerPage } = paginate;

  const searchOptions = getPaging({ page, itemsPerPage });

  try {
    isDialogLoading.value = true;
    const data = {
      searchOptions,
    };

    const response = await api.getToolLifeAlarm(data);

    toolLifeItems.value = response.data;
    toolLifeTotalItems.value = response.total_record;
  } catch (error) {
    console.error("Error fetching API:", error);
    itetoolLifeItemsms.value = [];
    toolLifeTotalItems.value = 0;
  }
  isDialogLoading.value = false;
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

const onAddTooLifeAlarm = () => {
  console.log("onadd toollife");
  toolLifeMode.value = 'Add';
  form.value = {};
  addDialog.value = true;
}

const onEdit = (machineNo, processCd) => {
  router.push({ name: `machine-info`, params: { id: machineNo, processCd: processCd } });
};

const onToolLifeEdit = (item) => {
  toolLifeMode.value = 'Edit';

  form.value.toolLifeLimit = item.Tool_Life_Limit;
  form.value.warningAmt = item.Warning_Amt;
  form.value.alertAmt = item.Alert_Amt;
  form.value.alarmAmt = item.Alarm_Amt;
  form.value.updatedBy = item.Updated_By;
  form.value.updatedDate = getDateFormat(item.Updated_Date);

  selectedToolLifeId.value = item.ID;

  addDialog.value = true;
};

const onToolLifeDelete = (id) => {
  console.log("onDelete : ", id);
  Alert.confirm("Are you sure you want to delete this tool life alarm ?").then(
    ({ isConfirmed }) => {
      if (isConfirmed) {
        isDialogLoading.value = true;
        api
          .removeToolLifeAlarm(id)
          .then((res) => {
            isDialogLoading.value = false;
            if (res.status === 0) {
              addDialog.value = false;
              Alert.success("Delete successfully");
              onLoadToolLife();
            } else if (res.status === 1) {
              Alert.warning(res.message);
            } else {
              Alert.error(res.message);
            }
          })
          .catch((error) => {
            isDialogLoading.value = false;
            console.error("Error fetching API:", error);
            Alert.error(error.message);
          });
      }
    }
  );

};



const saveClick = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;
    isDialogLoading.value = true;
    let res = null;

    let params = { ...form.value }
    params.toolLifeLimit = convertCommaToPureNumber(params.toolLifeLimit);
    params.warningAmt = convertCommaToPureNumber(params.warningAmt);
    params.alarmAmt = convertCommaToPureNumber(params.alarmAmt);
    params.alertAmt = convertCommaToPureNumber(params.alertAmt);

    if (toolLifeMode.value === "Add") {
      console.log("Add");
      res = await api.addToolLifeAlarm(params);
    } else {
      console.log("Edit");
      res = await api.updateToolLifeAlarm(selectedToolLifeId.value, params);
    }
    isDialogLoading.value = false;
    if (res.status === 0) {
      isDialogLoading.value = false;
      onLoadToolLife();
      await Alert.success();
      addDialog.value = false;

    } else {
      Alert.warning(res.message);
    }
  } catch (error) {
    isDialogLoading.value = false;
    Alert.error(error.message);
  }
};

const onToolLifeSetup = () => {
  // mode.value = "Add";
  // console.log("Add");
  // form.value = {
  // };
  dialog.value = true;
};

</script>
<style scoped>
.orange-gradient-btn {
  background-image: linear-gradient(310deg, #f57c00, #ffb74d 100%);
  color: #fff;
}
</style>