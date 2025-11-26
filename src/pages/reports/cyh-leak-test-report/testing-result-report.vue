<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Testing Result Report</h4>
      </v-card-title>
      <v-card-text>
        <v-form ref="frmSearch">
          <v-row>
            <!-- <v-col cols="12" sm="6" md="3">
              <label>Line</label>
              <v-select v-model="form.lineCd" :items="lineList" :rules="[rules.required]" />
            </v-col> -->
            <v-col cols="12" sm="6" md="2">
              <label>Plan Start Date</label>
              <n-date v-model="formSearch.planDateStart" @update:modelValue="formSearch.planDateEnd = null"></n-date>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <label>Plan End Date</label>
              <n-date v-model="formSearch.planDateEnd" :min-date="formSearch.planDateStart"></n-date>
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <label>Machine</label>
              <v-select v-model="formSearch.machineNo" :items="monthList" item-title="title" item-value="value" />
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <label>Work Type</label>
              <v-select v-model="formSearch.workType" :items="yearList" item-title="title" item-value="value" />
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <label>M/C Date</label>
              <v-text-field v-model="formSearch.mcDate"></v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-2 mb-1">
            <n-btn-search @click="onSearch" />
            <n-btn-reset class="ml-3" @click="onClear"> </n-btn-reset>
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
      </v-card-text>
      <n-loading :loading="isLoading" />
    </v-card>
    <n-loading :loading="isLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import * as ddlApi from "@/api/dropdown-list"; // Assuming ddlApi is the correct import for dropdown data
import * as api from "@/api/reports";
import rules from "@/utils/rules";
import {  getPaging } from "@/utils/utils.js";
const Alert = inject("Alert");

const frmSearch = ref(null);

// Form data
const form = ref({
  lineCd: "",
  month: "",
  year: "",
});

const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
let items = ref([]);

const headersDetail = [
   { title: "Machine", key: "Machine_No", sortable: false },
  { title: "Start Date", key: "Start_Date", sortable: false },
  { title: "End Date", key: "End_Date", sortable: false },

  { title: "Plan Year", key: "Plan_Year", sortable: false },
  { title: "Plan Month", key: "Plan_Month", sortable: false },
  { title: "Plan Day", key: "Plan_Day", sortable: false },

  { title: "Shift", key: "Shift", sortable: false },
  { title: "Machine Type", key: "Machine_Type", sortable: false },

  { title: "M/C Date", key: "MC_Date", sortable: false },
  { title: "Original M/C Date", key: "Original_MC_Date", sortable: false },

  { title: "M/C No", key: "MC_No", sortable: false },
  { title: "M/C Day", key: "MC_Day", sortable: false },
  { title: "M/C Month", key: "MC_Month", sortable: false },
  { title: "M/C Year", key: "MC_Year", sortable: false },
  { title: "M/C Line", key: "MC_Line", sortable: false },
  { title: "M/C Shift", key: "MC_Shift", sortable: false },

  { title: "Work Type", key: "Work_Type", sortable: false },
  { title: "Model", key: "Model_CD", sortable: false },
  { title: "Part No.", key: "Part_No", sortable: false },

  { title: "G/S", key: "GS_No", sortable: false },
  { title: "FG", key: "FG", sortable: false },

  { title: "P1, OH, CH1", key: "P1_CH1", sortable: false },
  { title: "P2, WJ, CH2", key: "P2_CH2", sortable: false },
  { title: "P3, CC, CH3", key: "P3_CH3", sortable: false },
  { title: "P4, -, CH4", key: "P4_CH4", sortable: false },
  { title: "P5, T/B, CH5", key: "P5_CH5", sortable: false },

  { title: "P1, OH, CH1 Value", key: "P1_CH1_Value", sortable: false },
  { title: "P2, WJ, CH2 Value", key: "P2_CH2_Value", sortable: false },
  { title: "P3, CC, CH3 Value", key: "P3_CH3_Value", sortable: false },
  { title: "P4, -, CH4 Value", key: "P4_CH4_Value", sortable: false },
  { title: "P5, T/B, CH5 Value", key: "P5_CH5_Value", sortable: false },

  { title: "C/A Date", key: "CA_Date", sortable: false },
  { title: "Mold No", key: "Mold_No", sortable: false },
  { title: "C/A No", key: "CA_No", sortable: false },

  { title: "Casting Day", key: "Casting_Day", sortable: false },
  { title: "Casting Month", key: "Casting_Month", sortable: false },
  { title: "Casting Year", key: "Casting_Year", sortable: false },
  { title: "Mold Number", key: "Mold_Number", sortable: false },
];

// Loading states
const isLoading = ref(false);

// Dropdown lists
const lineList = ref([]);

const monthList = ref([]);

const yearList = ref([]);


const formSearch = ref({
  planDateStart:'',
  planDateEnd:'',
  machineNo: '',
  workType: '',
  mcDate: '',
});

onMounted(async () => {

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

    // pageState.setSearchData(data);
    const response = await api.searchCYHTestingResult(data);
console.log("response => ",response)
    items.value = response.data;
    totalItems.value = response.total_record;
    
    // /* Total line stop loss calculate */
    // totalLineStopLoss.value = minutesToHHMMSS(items.value.reduce((sum, row) => sum + row.Loss_Time, 0));


    // /* Percent Loss calculate */
    // percentLoss.value = calculateLossPercentage(items.value);

  } catch (error) {
    console.error("Error fetching API:", error);
    items.value = [];
    totalItems.value = 0;
  }
  isLoading.value = false;
};

// Methods
const onExport = async () => {
  try {
    // Validate required fields
    const { valid } = await frmSearch.value.validate();
    if (!valid) {
      return;
    }

    // Use selected month and year from form
    const month = form.value.month || "07";
    const year = form.value.year || "2025";

    isLoading.value = true;

    // Call the API function
    const response = await api.exportEfficiencyReport({
      lineCd: form.value.lineCd,
      month,
      year,
    });

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
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const dateStr = `${yy}_${mm}_${dd}`;
    link.download = `report-efficiency-${form.value.lineCd}-${month}-${year}(${dateStr}).xlsx`;
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

const onClear = () => {
  const currentDate = new Date();
  form.value = {
    lineCd: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  };
};

onMounted(() => {
  // Load initial data or dropdown lists if needed
  // You can add API calls here to populate dropdown lists

  monthList.value = ddlApi.getMonth();

  yearList.value = ddlApi.getYear();

  ddlApi.line().then((data) => {
    lineList.value = data;
  });

  // default month and year current month and year
  const currentDate = new Date();
  form.value.month = (currentDate.getMonth() + 1).toString(); // Months are 0-indexed
  form.value.year = currentDate.getFullYear();
});
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
