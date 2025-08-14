<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Report - Efficiency</h4>
      </v-card-title>
      <v-card-text>
        <v-form ref="frmSearch">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <label>Line</label>
              <v-select
                v-model="form.lineCd"
                :items="lineList"
                :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <label>Month</label>
              <v-select
                v-model="form.month"
                :items="monthList"
                item-title="title"
                item-value="value"
              />
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <label>Year</label>
              <v-select
                v-model="form.year"
                :items="yearList"
                item-title="title"
                item-value="value"
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-center mt-4">
            <n-btn-export @click="onExport" class="mr-3"> </n-btn-export>
            <n-btn-reset @click="onClear"> </n-btn-reset>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <n-loading :loading="isLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import * as ddlApi from "@/api/dropdown-list"; // Assuming ddlApi is the correct import for dropdown data
import * as api from "@/api/reports";
import rules from "@/utils/rules";

const Alert = inject("Alert");

const frmSearch = ref(null);

// Form data
const form = ref({
  lineCd: "",
  month: "",
  year: "",
});

// Loading states
const isLoading = ref(false);

// Dropdown lists
const lineList = ref([]);

const monthList = ref([]);

const yearList = ref([]);

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
