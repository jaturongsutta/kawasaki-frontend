<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Testing Result Report</h4>
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

            <v-col cols="12" sm="6" md="2">
              <label>Machine</label>
              <v-select v-model="formSearch.machineNo" :items="[{ title: 'All', value: null }, ...machineList]"
                item-title="title" item-value="value" />
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <label>Work Type</label>
              <v-select v-model="formSearch.workType" :items="worktypeList" item-title="title" item-value="value" />
            </v-col>
            <v-col cols="12" sm="12" md="2">
              <label>M/C Date</label>
              <v-text-field v-model="formSearch.mcDate"></v-text-field>
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

                    <div v-if="col.key === 'FG'" :style="{
                      background: item.FG == 1 ? '#4CAF50' : '#F44336',
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: '600',
                      borderRadius: '4px',
                      padding: '4px 0'
                    }">
                      {{ item.FG }}
                    </div>

                    <div v-else-if="['NG_P1', 'NG_P2', 'NG_P3', 'NG_P4', 'NG_TB'].includes(col.key)" :style="{
                      background: item[col.key] == 1 ? '#4CAF50'
                        : item[col.key] == 2 ? '#F44336'
                          : 'transparent',
                      color: item[col.key] == 1 || item[col.key] == 2 ? 'white' : 'inherit',
                      textAlign: 'center',
                      fontWeight: item[col.key] == 1 || item[col.key] == 2 ? '600' : 'normal',
                      borderRadius: '4px',
                      padding: '4px 0'
                    }">
                      {{ item[col.key] }}
                    </div>

                    <div v-else>
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
  { title: "Machine", key: "Machine_No", sortable: false },

  {
    title: "Start Date", key: "Start_Date", sortable: false, width: 200,
    format: (item) => getDateFormat(item.Start_Date, 'yyyy MMM dd HH:mm:ss')
  },
  {
    title: "End Date", key: "End_Date", sortable: false, width: 200,
    format: (item) => getDateFormat(item.End_Date, 'yyyy MMM dd HH:mm:ss')
  },

  { title: "Plan Year", key: "plan_year", sortable: false },
  { title: "Plan Month", key: "plan_month", sortable: false },
  { title: "Plan Day", key: "plan_day", sortable: false },

  { title: "Shift", key: "Shift_Period", sortable: false },
  { title: "Machine Type", key: "Machine_Type", sortable: false },

  { title: "M/C Date", key: "MC_Date", sortable: false },
  { title: "Original M/C Date", key: "ori_MC_Date", sortable: false },

  { title: "M/C No", key: "MC_No", sortable: false },
  { title: "M/C Day", key: "MC_Day", sortable: false },
  { title: "M/C Month", key: "MC_Month", sortable: false },
  { title: "M/C Year", key: "MC_Year", sortable: false },
  { title: "M/C Line", key: "MC_Line", sortable: false },
  { title: "M/C Shift", key: "MC_Shift", sortable: false },

  { title: "Work Type", key: "Work_Type", sortable: false },
  { title: "Model", key: "Model_CD", sortable: false },

  { title: "Part No.", key: "part", sortable: false },

  { title: "G/S", key: "GS_No", sortable: false },
  { title: "FG", key: "FG", sortable: false },

  // ---- NG CH1–CH5 (ตาม JSON: NG_P1, NG_P2...) ----
  { title: "P1, OH, CH1", key: "NG_P1", sortable: false },
  { title: "P2, WJ, CH2", key: "NG_P2", sortable: false },
  { title: "P3, CC, CH3", key: "NG_P3", sortable: false },
  { title: "P4, -, CH4", key: "NG_P4", sortable: false },
  { title: "P5, T/B, CH5", key: "NG_TB", sortable: false },

  // ---- NG Values ----
  { title: "P1, OH, CH1 Value", key: "NG_P1_Value", sortable: false },
  { title: "P2, WJ, CH2 Value", key: "NG_P2_Value", sortable: false },
  { title: "P3, CC, CH3 Value", key: "NG_P3_Value", sortable: false },
  { title: "P4, -, CH4 Value", key: "NG_P4_Value", sortable: false },
  { title: "P5, T/B, CH5 Value", key: "NG_TB_Value", sortable: false },

  // ---- C/A & Casting ----
  { title: "C/A Date", key: "Casting_Date", sortable: false },
  { title: "Mold No", key: "Mold_No", sortable: false },
  { title: "C/A No", key: "Casting_No", sortable: false },

  { title: "Casting Day", key: "Casting_Day", sortable: false },
  { title: "Casting Month", key: "Casting_Month", sortable: false },
  { title: "Casting Year", key: "Casting_Year", sortable: false },
  { title: "Mold Number", key: "Mold_Number", sortable: false },
];

const formSearch = ref({
  planDateStart: getFirstDayOfMonth(),
  planDateEnd: getLastDateOfMonth(),
  machineNo: null,
  workType: null,
  mcDate: null,
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

    const response = await api.searchCYHTestingResult(data);
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
    mcDate: null,
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
    const response = await api.exportCYHTestingResultReport(formSearch.value);

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

    link.download = `Report1-Testing-Result-${timestamp}.xlsx`;
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
