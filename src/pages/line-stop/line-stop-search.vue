<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Line Stop Search</h4>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-row justify="justify-start">
          <v-col cols="2">
            <label>Line</label>
            <v-select v-model="formSearch.lineCd" :items="lineList" @update:modelValue="getProcessList"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Process</label>
            <v-select v-model="formSearch.processCd"
              :items="[{ title: 'All', value: null }, ...processList]"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Date From</label>
            <n-date v-model="formSearch.dateFrom"></n-date>
          </v-col>
          <v-col cols="2">
            <label>Date To</label>
            <n-date v-model="formSearch.dateTo"></n-date>
          </v-col>
          <v-col cols="2">
            <label>Reason</label>
            <v-select v-model="formSearch.reasonCd" :items="[{ title: 'All', value: null }, ...reasonList]"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Status</label>
            <v-select v-model="formSearch.statusCd" :items="[{ title: 'All', value: null }, ...statusList]"></v-select>
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
          <div class="d-flex justify-center ma-5">
            <n-btn-add no-permission label="New Line Stop" @click="newClick(false)"></n-btn-add>
            <n-btn-add no-permission label="New Line Stop from PLC" class="ml-3" @click="newClick(true)"></n-btn-add>
          </div>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table v-model:page="currentPage" :headers="headersDetail" :items="items" :items-per-page="pageSize">
              <template v-slot:[`item.action`]="{ item }">
                <n-gbtn-edit :permission="false" @click="onEdit(item.id)"></n-gbtn-edit>

                <n-gbtn-delete :permission="false" v-if="item.status === '00' && item.ID_Ref === null"
                  @click="onDelete(item.id)"></n-gbtn-delete>
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
            <label>Total Line Stop Loss</label>
          </v-col>
          <v-col cols="2">
            <v-text-field readonly v-model="totalLineStopLoss" reverse placeholder="HH:mm:ss"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="pt-2">
            <label>% Loss</label>
          </v-col>
          <v-col cols="2">
            <v-text-field readonly v-model="percentLoss" reverse placeholder="0"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <n-loading :loading="isLoading" />
    </v-card>

    <v-dialog v-model="dialog" max-width="1024px">
      <New :is-p-l-c="isPLC" @on-add-successful="dialog = false; onSearch();"></New>
    </v-dialog>

  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import rules from "@/utils/rules";
import New from "@/components/line-stop/new.vue";
import * as api from "@/api/line-stop.js";
import * as ddlApi from "@/api/dropdown-list.js";
import { getDateFormat, getPaging, secondsToHHMMSS, secondsToMMSS } from "@/utils/utils.js";
import { useRouter } from "vue-router";


const router = useRouter();
const dialog = ref(false);
const Alert = inject("Alert");

const formSearch = ref({
  lineCd: '',
  dateFrom: '',
  dateTo: '',
  processCd: null,
  reasonCd: null,
  statusCd: null,
});

const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const lineList = ref([]);
const processList = ref([]);
const reasonList = ref([]);
const statusList = ref([]);
let items = ref([]);
let isLoading = ref(false);

const totalLineStopLoss = ref('');
const percentLoss = ref('');

const isPLC = ref(false);

const headersDetail = [
  { title: "", key: "action", sortable: false, nowrap: true },
  { title: "Line", key: "Line_CD", sortable: false },
  { title: "Process", key: "Process_CD", sortable: false },
  {
    title: "Date", key: "Line_Stop_Date", sortable: false, value: (item) => {
      return getDateFormat(item.Line_Stop_Date, "dd/MM/yyyy");
    }
  },
  {
    title: "Time", key: "Line_Stop_Time", sortable: false, value: (item) => {
      return getDateFormat(item.Line_Stop_Time, "HH:mm");
    }
  },
  {
    title: "Line Stop mins", key: "Loss_Time", sortable: false, value: (item) => {
      return secondsToMMSS(item.Loss_Time);
    }
  },
  { title: "Reason", key: "reason_name", sortable: false },
  { title: "Comment", key: "comment", sortable: false },
  { title: "Status", key: "status_name", sortable: false },
  { title: "Type", key: "Type", sortable: false },
  { title: "Update By", key: "Updated_By", sortable: false },
  {
    title: "Update Date", key: "Updated_Date", sortable: false, value: (item) => {
      return getDateFormat(item.Updated_Date);
    }
  },
];

onMounted(async () => {
  ddlApi.getPredefine("Stop_Status").then((data) => {
    statusList.value = data;
  });

  ddlApi.getPredefine("Stop_Reason").then((data) => {
    reasonList.value = data;
  });

  ddlApi.lineAll().then((data) => {
    lineList.value = data;
  });

  onSearch();
});

const onSearch = () => {
  currentPage.value = 1;
  loadData({ page: currentPage.value, itemsPerPage: pageSize.value });
}

const onReset = () => {
  formSearch.value = {
    isActive: "Y",
  };
  items.value = [];
  totalItems.value = 0;
  lineModelList.value = [];
  onSearch();
};

const onEdit = (id) => {
  router.push({ name: `line-stop-info`, params: { id: id } });
}

const onDelete = (id) => {
  console.log("onDelete : ", id);
  Alert.confirm("Are you sure you want to delete this Line Stop ?").then(
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

const loadData = async (paginate) => {
  const { page, itemsPerPage } = paginate;

  const searchOptions = getPaging({
    page, itemsPerPage
  });

  try {
    isLoading.value = true;
    const data = {
      ...formSearch.value,
      searchOptions,
    };

    const response = await api.search(data);

    items.value = response.data;
    totalItems.value = response.total_record;

    /* Total line stop loss calculate */
    totalLineStopLoss.value = secondsToHHMMSS(items.value.reduce((sum, row) => sum + row.Loss_Time, 0));


    /* Percent Loss calculate */
    percentLoss.value = calculateLossPercentage(items.value);

  } catch (error) {
    console.error("Error fetching API:", error);
    items.value = [];
    totalItems.value = 0;
  }
  isLoading.value = false;
};

const getProcessList = () => {
  formSearch.value.machineNo = null;
  api.getProcessDDL(formSearch.value.lineCd).then((v) => {
    processList.value = v.data;
  });
}

const calculateLossPercentage = (data) => {
  const totalLossTime = data.reduce((sum, item) => sum + Number(item.Loss_Time || 0), 0)
  const totalPlanTime = data.reduce((sum, item) => sum + Number(item.plan_total_time || 0), 0)

  if (totalPlanTime === 0) return 0
  const percentage = (totalLossTime / totalPlanTime) * 100

  return percentage.toFixed(2)
}

const newClick = (v) => {
  isPLC.value = v;
  dialog.value = true;
};

</script>
