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
            <v-select v-model="formSearch.lineCd" :items="lineList" @update:modelValue="getLineModelList"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Date From</label>
            <n-date v-model="formSearch.dateFrom"></n-date>
          </v-col>
          <v-col cols="2">
            <label>Date To</label>
            <n-date v-model="formSearch.dateTo" :min-date="formSearch.dateFrom"></n-date>
          </v-col>

          <v-col cols="2">
            <label>Model</label>
            <v-select v-model="formSearch.modelCd"
              :items="[{ title: 'All', value: null }, ...lineModelList]"></v-select>
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
          <n-btn-add no-permission label="New NG" class="ma-5" @click="newNGClick"></n-btn-add>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table-server v-model:page="currentPage" :headers="headersDetail" :items="items"
              :items-per-page="pageSize">
              <template v-slot:[`item.action`]="{ item }">
                <n-gbtn-edit :permission="false" @click="onEdit(item.id)"></n-gbtn-edit>

                <n-gbtn-delete :permission="false" v-if="item.status === '00' && item.ID_Ref === null"
                  @click="onDelete(item.id)"></n-gbtn-delete>
              </template>

              <template v-slot:bottom>
                <n-pagination v-model:currentPage="currentPage" v-model:itemPerPage="pageSize"
                  v-model:totalItems="totalItems"></n-pagination>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
        <v-divider class="mb-8"></v-divider>
        <v-row>
          <v-col cols="2" class="pt-2">
            <label>Total Rejection Quantity</label>
          </v-col>
          <v-col cols="2">
            <v-text-field readonly v-model="rejectionQuantity" reverse placeholder="0"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="pt-2">
            <label>Total Rejection Loss</label>
          </v-col>
          <v-col cols="2">
            <v-text-field readonly v-model="rejectionLoss" reverse placeholder="HH:mm"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <n-loading :loading="isLoading" />
    </v-card>

    <v-dialog v-model="dialog" max-width="1024px">
      <New></New>
    </v-dialog>

  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import rules from "@/utils/rules";
import New from "@/components/ng/new.vue";
import * as api from "@/api/ng.js";
import * as ddlApi from "@/api/dropdown-list.js";
import { getDateFormat, getPaging } from "@/utils/utils.js";
import { useRouter } from "vue-router";
import NgInfo from "./ng-info.vue";

const router = useRouter();
const dialog = ref(false);
const Alert = inject("Alert");

const formSearch = ref({
  lineCd: '',
  dateFrom: '',
  dateTo: '',
  modelCd: null,
  reasonCd: null,
  statusCd: null,
});

const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const lineList = ref([]);
const lineModelList = ref([]);
const reasonList = ref([]);
const statusList = ref([]);
let items = ref([]);
let isLoading = ref(false);

const rejectionQuantity = ref('');
const rejectionLoss = ref('');

const headersDetail = [
  { title: "", key: "action", sortable: false, nowrap: true },
  { title: "Line", key: "Line_CD", sortable: false },
  {
    title: "Date", key: "NG_Date", sortable: false, value: (item) => {
      return getDateFormat(item.NG_Date, "dd/MM/yyyy");
    }
  },
  {
    title: "Time", key: "NG_Time", sortable: false, value: (item) => {
      return getDateFormat(item.NG_Time, "HH:mm");
    }
  },
  { title: "Model", key: "Model_CD", sortable: false },
  { title: "Part No", key: "part_no", sortable: false },
  { title: "Quantity", key: "quantity", sortable: false },
  { title: "Reason", key: "reason_name", sortable: false },
  { title: "Comment", key: "comment", sortable: false },
  { title: "Status", key: "status_name", sortable: false },
  { title: "Update By", key: "Updated_By", sortable: false },
  {
    title: "Update Date", key: "Updated_Date", sortable: false, value: (item) => {
      return getDateFormat(item.Updated_Date);
    }
  },
];

onMounted(async () => {
  ddlApi.getPredefine("NG_Status").then((data) => {
    statusList.value = data;
  });

  ddlApi.getPredefine("NG_Reason").then((data) => {
    reasonList.value = data;
  });

  ddlApi.lineAll().then((data) => {
    lineList.value = data;
  });

  onSearch();
});

const getLineModelList = (lineCd) => {
  formSearch.value.modelCd = null;
  ddlApi.lineModel(lineCd).then((data) => {
    lineModelList.value = data;
  });
}

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
  router.push({ name: `ng-info`, params: { id: id } });
}

const onDelete = (id) => {
  console.log("onDelete : ", id);
  Alert.confirm("Are you sure you want to delete this NG ?").then(
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


    rejectionQuantity.value = items.value.reduce((sum, row) => sum + row.quantity, 0)

    const totalSeconds = items.value.reduce((sum, row) => {
      const cycleTime = new Date(row.Cycle_Time)
      const seconds = cycleTime.getUTCHours() * 3600 + cycleTime.getUTCMinutes() * 60 + cycleTime.getUTCSeconds()
      return sum + (seconds * row.quantity)
    }, 0)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60;

    const pad = n => String(n).padStart(2, '0');
    rejectionLoss.value = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } catch (error) {
    console.error("Error fetching API:", error);
    items.value = [];
    totalItems.value = 0;
  }
  isLoading.value = false;
};

const newNGClick = () => {
  dialog.value = true;
};

</script>
