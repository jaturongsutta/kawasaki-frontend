<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>NG Rejection Search</h4>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-row justify="justify-start">
          <v-col cols="2">
            <label>Line</label>
            <v-select v-model="formSearch.lineCd" :items="lineList" item-value="lineCd" item-title="lineCd"
              @update:modelValue="getLineModelList"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Plan Date From</label>
            <n-date v-model="formSearch.dateFrom"></n-date>
          </v-col>
          <v-col cols="2">
            <label>Plan Date To</label>
            <n-date v-model="formSearch.dateTo"></n-date>
          </v-col>

          <v-col cols="2">
            <label>Model</label>
            <v-select v-model="formSearch.modelCd" :items="lineModelList" item-value="modelCd"
              item-title="modelCd"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Reason</label>
            <v-select v-model="formSearch.reasonCd" :items="reasonList" item-value="reasonCd"
              item-title="reasonName"></v-select>
          </v-col>

          <v-col cols="2">
            <label>Status</label>
            <v-select v-model="formSearch.statusCd" :items="statusList" item-value="statusCd"
              item-title="statusName"></v-select>
          </v-col>
        </v-row>
        <div class="row mt-1 mb-1">
          <div class="d-flex justify-center">
            <n-btn-search @click="onSearch" />
            <n-btn-reset @click="onReset" class="ml-3" />
          </div>
        </div>
        <n-loading :loading="isLoading" />
      </v-card-text>
    </v-card>
    <v-card class="mt-5">
      <v-card-text>
        <v-row>
          <n-btn-add no-permission label="New NG" class="ma-5" @click="newPlanClick"></n-btn-add>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table v-model:page="currentPage" :headers="headersDetail" :items="items" :items-per-page="pageSize">
              <template v-slot:[`item.action`]="{ item }">
                <n-gbtn-edit :permission="false" @click="onEdit(item.Menu_No)"></n-gbtn-edit>

                <n-gbtn-delete :permission="false" v-if="item.buttonDel"></n-gbtn-delete>
              </template>

              <template v-slot:bottom>
                <n-pagination v-model:currentPage="currentPage" v-model:itemPerPage="pageSize"
                  v-model:totalItems="totalItems"></n-pagination>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-divider class="mb-8"></v-divider>
        <v-row>
          <v-col cols="2" class="pt-2">
            <label>Total Rejection Quantity</label>
          </v-col>
          <v-col cols="2">
            <v-text-field readonly></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="pt-2">
            <label>Total Rejection Loss</label>
          </v-col>
          <v-col cols="2">
            <v-text-field readonly></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="1180px">
      <New></New>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import rules from "@/utils/rules";
import New from "@/components/ng/new.vue";
import * as api from "@/api/ng.js";
import { getPaging } from "@/utils/utils.js";

const dialog = ref(false);

const formSearch = ref({
  lineCd: '',
  dateFrom: '',
  dateTo: '',
  modelCd: '',
  reasonCd: '',
  statusCd: '',
});

const formInfo = ref({
  line: "1",
  plan_date: "2025-01-01",
  plan_start_time: "08:00",
  shift: "a",
  model: "EX400",
  shift_time: "a",
  ot: "a",
  partName: "a",
});
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);

const totalItemsDetail = ref(8);

const lineList = ref([]);
const lineModelList = ref([]);
const reasonList = ref([]);
const statusList = ref([]);
let items = ref([]);
let isLoading = ref(false);

const headersDetail = [
  { title: "", key: "action", sortable: false, nowrap: true },
  { title: "Line", key: "Line_CD", sortable: false },
  { title: "Date", key: "NG_Date", sortable: false },
  { title: "Time", key: "NG_Time", sortable: false },
  { title: "Model", key: "Model_CD", sortable: false },
  { title: "Part No", key: "Part_No", sortable: false },
  { title: "Quantity", key: "Quantity", sortable: false },
  { title: "Reason", key: "Reason_Name", sortable: false },
  { title: "Comment", key: "Comment", sortable: false },
  { title: "Status", key: "Status_Name", sortable: false },
  { title: "Update By", key: "Updated_by", sortable: false },
  { title: "Update Date", key: "Updated_date", sortable: false },
];

onMounted(async () => {
  api.getLineList().then((data) => {
    lineList.value = data.data;
  });

  api.getReasonList().then((data) => {
    reasonList.value = data.data;
  });

  api.getStatusList().then((data) => {
    statusList.value = data.data;
  });

});

const getLineModelList = (lineCd) => {
  formSearch.value.modelCd = '';
  api.getLineModelList(lineCd).then((data) => {
    lineModelList.value = data.data;
  });
}

const onSearch = () => {
  currentPage.value = 1;
  loadData({ page: currentPage.value, itemsPerPage: pageSize.value });
}

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


const newPlanClick = () => {
  dialog.value = true;
};
</script>

<style>
.textRunning {
  color: #3366ff;
  font-weight: bold;
}
</style>
