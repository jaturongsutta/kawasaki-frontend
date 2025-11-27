<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Machine Running Report</h4>
      </v-card-title>
      <v-card-text>
        <v-form ref="frmSearch">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <label>Plan Start Date</label>
              <n-date v-model="formSearch.planDateStart" @update:modelValue="formSearch.planDateEnd = null"></n-date>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <label>Plan End Date</label>
              <n-date v-model="formSearch.planDateEnd" :min-date="formSearch.planDateStart"></n-date>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <label>Machine</label>
              <v-select v-model="formSearch.machineNo" :items="[{ title: 'All', value: null }, ...machineList]"
                item-title="title" item-value="value" />
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <label>Work Type</label>
              <v-select v-model="formSearch.workType" :items="worktypeList" item-title="title" item-value="value" />
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-2 mb-1">
            <n-btn-search @click="onSearch" />
            <n-btn-reset class="ml-3" @click="onReset"> </n-btn-reset>
            <n-btn-export @click="onExport" class="ml-3"> </n-btn-export>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="mt-5">
      <v-card-text>
        <v-row>
          <v-col>
            <v-data-table-server v-model:page="currentPage" v-model:items-per-page="pageSize" :headers="headersDetail"
              :items="items" :items-length="totalItems" @update:options="loadData">
              <template #header="{ columns }">
                <tr>
                  <th v-for="col in columns" :key="col.key" :style="{
                    width: (col.width || 120) + 'px',
                    minWidth: (col.width || 120) + 'px',
                  }">
                    {{ col.title }}
                  </th>
                </tr>
              </template>


              <template #item="{ item, columns }">
                <tr>
                  <td v-for="col in columns" :key="col.key" :style="{
                    width: (col.width || 120) + 'px',
                    minWidth: (col.width || 120) + 'px',
                  }">
                    <div>
                      {{ col.format ? col.format(item) : item[col.key] }}
                    </div>
                  </td>
                </tr>
              </template>
              <template v-slot:bottom>
                <n-pagination v-model:currentPage="currentPage" v-model:itemPerPage="pageSize"
                  v-model:totalItems="totalItems"></n-pagination>
              </template>
            </v-data-table-server>
          </v-col>
        </v-row>
      </v-card-text>
      <n-loading :loading="isLoading" />
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import * as api from "@/api/reports";
import { getDateFormat, getFirstDayOfMonth, getPaging } from "@/utils/utils.js";
import { getLastDateOfMonth } from "@/utils/date";
const Alert = inject("Alert");

const frmSearch = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
let items = ref([]);
// Loading states
const isLoading = ref(false);
// Dropdown lists
const machineList = ref([]);
const worktypeList = ref([]);

const headersDetail = [
  { title: "Machine Type", key: "Machine_Type", sortable: false },
  { title: "Machine", key: "Machine_No", sortable: false },
  { title: "Model", key: "Model_cd", sortable: false },
  { title: "M/C Date", key: "MC_Date", sortable: false },
  {
    title: "Start Date", key: "Start_Date", sortable: false, width: 200,
    format: (item) => getDateFormat(item.Start_Date, 'yyyy MMM dd HH:mm:ss')
  },
  {
    title: "End Date", key: "End_Date", sortable: false, width: 200,
    format: (item) => getDateFormat(item.End_Date, 'yyyy MMM dd HH:mm:ss')
  },
  { title: "Process Duration", key: "process_duration", sortable: false },
  { title: "Wait OCR Scan", key: "Wait_OCR", sortable: false },
  { title: "Test Time", key: "Test_Time", sortable: false },
];

const formSearch = ref({
  planDateStart: getFirstDayOfMonth(),
  planDateEnd: getLastDateOfMonth(),
  machineNo: null,
  workType: null,
});

onMounted(async () => {
  api.getMachine().then((v) => {
    machineList.value = v.data;
  });

  api.getWorktype().then((v) => {
    worktypeList.value = v.data;
  });
  onSearch();
});

const onSearch = () => {
  console.log("onsearch ")
  currentPage.value = 1;
  loadData({ page: currentPage.value, itemsPerPage: pageSize.value });
}

const loadData = async (paginate) => {
  console.log("loaddata")
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

    const response = await api.searchMachineRunning(data);
    console.log("response => ", response)
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
    planDateStart: getFirstDayOfMonth(),
    planDateEnd: getLastDateOfMonth(),
    machineNo: null,
    workType: null,
  };
  items.value = [];
  totalItems.value = 0;
  onSearch();
};

// Methods
const onExport = async () => {
  try {
    // Validate required fields
    const { valid } = await frmSearch.value.validate();
    if (!valid) {
      return;
    }

    isLoading.value = true;

    // Call the API function
    const response = await api.exportCYHMachineRunningReport(formSearch.value);

    // Create blob and download file
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Create temporary link to download
    const link = document.createElement("a");
    link.href = url;
    // Add current date in yyyy-MM-dd format
    const now = new Date();

    const YY = String(now.getFullYear()).slice(-2);
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    const timestamp = `${YY}${MM}${DD}${hh}${mm}${ss}`;

    link.download = `Report4-Machine-Running-${timestamp}.xlsx`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    Alert.success("Excel file exported successfully");
  } catch (error) {
    console.error("Export error:", error);
    Alert.error(
      "Failed to export Excel file: " +
      (error.response?.data?.message || error.message)
    );
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.v-card-title h4 {
  font-weight: 600;
  color: #333;
}

label {
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
