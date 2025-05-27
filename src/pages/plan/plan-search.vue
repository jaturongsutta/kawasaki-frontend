<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Plan</h4>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-row justify="justify-start" class="ml-1">
          <v-sheet width="200" class="mr-3">
            <label>Line</label>
            <v-select
              v-model="formSearch.line"
              :items="lineList"
              @update:model-value="lineChange"
              placeholder="Please Select"
            ></v-select>
          </v-sheet>
          <v-sheet width="160" class="mr-3">
            <label>Plan Date From</label>
            <n-date v-model="formSearch.dateFrom"></n-date>
          </v-sheet>
          <v-sheet width="160" class="mr-3">
            <label>Plan Date To</label>
            <n-date v-model="formSearch.dateTo"></n-date>
          </v-sheet>
          <v-sheet width="200" class="mr-3">
            <label>Model</label>
            <v-select
              v-model="formSearch.lineModel"
              :items="[{ title: 'All', value: null }, ...lineModelList]"
            ></v-select>
          </v-sheet>
          <v-sheet width="160" class="mr-3">
            <label>Status</label>
            <v-select
              v-model="formSearch.status"
              :items="[{ title: 'All', value: null }, ...statusList]"
            ></v-select>
          </v-sheet>
          <v-sheet class="pt-5" width="240">
            <n-btn-search @click="onSearch" />
            <n-btn-reset @click="onReset" class="ml-3" />
          </v-sheet>
        </v-row>

        <v-row class="mb-3">
          <v-col>
            <hr />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3 style="color: #3366ff">
              Current Production Plan {{ currentPlanTime }}
            </h3>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-data-table
              v-model:page="currentPage"
              :headers="headersPlanCurrent"
              :items="itemsPlanCurrent"
              :items-per-page="pageSize"
              hide-default-footer
            >
              <template v-slot:[`item.action`]="{ item }">
                <n-gbtn-edit
                  @click="onPlanCurrentEditClick(item.id)"
                ></n-gbtn-edit>
              </template>
              <template v-slot:[`item.action2`]="{ item }">
                <n-gbtn-stop
                  @click="onStopPlanClick(item)"
                  v-if="['10', '20'].includes(item.status)"
                ></n-gbtn-stop>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-5">
      <v-card-text>
        <v-row>
          <n-btn-add
            no-permission
            label="New Plan"
            class="ma-5"
            @click="newPlanClick"
          ></n-btn-add>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              v-model:page="currentPage"
              :headers="headersDetail"
              :items="itemsDetail"
              :items-per-page="pageSize"
            >
              <template v-slot:[`item.action`]="{ item }">
                <n-gbtn-edit @click="onEditPlan(item.id)"></n-gbtn-edit>

                <n-gbtn-delete
                  v-if="item.status === '00'"
                  @click="onDelete(item.id)"
                ></n-gbtn-delete>
              </template>

              <template v-slot:bottom>
                <n-pagination
                  v-model:currentPage="currentPage"
                  v-model:itemPerPage="pageSize"
                  v-model:totalItems="totalItemsDetail"
                ></n-pagination>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, inject } from "vue";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/plan.js";

import { getPaging, getDateFormat } from "@/utils/utils.js";
import moment from "moment";
import router from "@/router";
import { usePageState } from "@/stores/search/plan";
const pageState = usePageState();
const Alert = inject("Alert");

const formSearch = ref({
  line: pageState.line,
  dateFrom: pageState.dateFrom,
  dateTo: pageState.dateTo,
  lineModel: pageState.lineModel,
  status: pageState.status,
});

const isLoading = ref(false);

const currentPlanTime = ref();
const currentPage = ref(1);
const pageSize = ref(20);

const lineList = ref([]);
const lineModelList = ref([]);
const statusList = ref([]);

const totalItemsDetail = ref(0);

const headersPlanCurrent = [
  { title: "", key: "action", sortable: false },
  { title: "", key: "action2", sortable: false },
  {
    title: "Status",
    key: "status_name",
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
    sortable: false,
  },
  {
    title: "Production Date",
    key: "Plan_Date",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
    value: (item) => {
      return getDateFormat(item.Plan_Date, "dd/MM/yyyy");
    },
  },
  {
    title: "Start Time",
    key: "Plan_Start_Time",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
    value: (item) => {
      return getDateFormat(item.Plan_Start_Time, "HH:mm");
    },
  },
  {
    title: "Model",
    key: "Model_CD",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Shift",
    key: "Team_Name",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Shift Time",
    key: "Shift_Period_Name",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Break1",
    key: "B1",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Lunch Break",
    key: "B2",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Break2",
    key: "B3",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Break OT",
    key: "B4",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "OT",
    key: "OT",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Cycle Time",
    key: "Cycle_Times",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Total Time(mins)",
    key: "plan_total_time",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Target FG",
    key: "plan_fg_amt",
    sortable: false,
    cellProps: (cell) => ({
      class: cell.item.status_name === "Running" ? "textRunning" : "",
    }),
  },
  {
    title: "Actual FG",
    key: "actual_fg_amt",
    sortable: false,
    cellProps: (cell) => {
      if (cell.item.actual_fg_amt < cell.item.plan_fg_amt) {
        return {
          class: "text-red",
        };
      } else if (cell.item.actual_fg_amt > cell.item.plan_fg_amt) {
        return {
          class: "text-green",
        };
      } else if (cell.item.status_name === "Running") {
        return {
          class: "textRunning",
        };
      }
    },
  },
];

const itemsPlanCurrent = ref([]);

const headersDetail = [
  { title: "", key: "action", sortable: false, nowrap: true },
  {
    title: "Plan Date",
    key: "Plan_Date",
    sortable: false,
    value: (item) => {
      return getDateFormat(item.Plan_Date, "dd/MM/yyyy");
    },
  },
  {
    title: "Plan Start Time",
    key: "Plan_Start_Time",
    sortable: false,
    value: (item) => {
      return getDateFormat(item.Plan_Start_Time, "HH:mm");
    },
  },
  { title: "Shift", key: "Team_Name", sortable: false },
  { title: "Shift Period", key: "Shift_Period_Name", sortable: false },
  { title: "Break1", key: "B1", sortable: false },
  { title: "Lunch Break", key: "B2", sortable: false },
  { title: "Break2", key: "B3", sortable: false },
  { title: "Break OT", key: "B4", sortable: false },
  { title: "OT", key: "OT", sortable: false },
  { title: "Model", key: "Model_CD", sortable: false },
  { title: "Cycle Time", key: "Cycle_Times", sortable: false },
  { title: "Total Time(mins)", key: "plan_total_time", sortable: false },
  { title: "Target FG", key: "plan_fg_amt", sortable: false },
  { title: "Actual FG", key: "actual_fg_amt", sortable: false },
  { title: "NG", key: "ng_amt", sortable: false },
  { title: "Line Stop", key: "line_stop_amt", sortable: false },
  { title: "Status", key: "status_name", sortable: false },
  { title: "Update By", key: "updated_by", sortable: false },
  {
    title: "Update Date",
    key: "updated_date",
    sortable: false,
    value: (item) => {
      return getDateFormat(item.updated_date);
    },
  },
];

const itemsDetail = ref([]);
const intervalId = ref(null); // To store the interval ID

onMounted(() => {
  ddlApi.line().then((data) => {
    console.log("lineList", data);
    lineList.value = data;
  });

  ddlApi.lineModel("").then((data) => {
    lineModelList.value = data;
  });

  ddlApi.getPredefine("Plan_Status").then((data) => {
    statusList.value = data;
  });

  // Start interval to fetch data every 5 seconds
  intervalId.value = setInterval(() => {
    loadPlanCurrent(formSearch.value.line);
  }, 5000); // 5000ms = 5 seconds

  loadPlanCurrent(formSearch.value.line);
  onSearch();
});

onUnmounted(() => {
  // Clear the interval when the component is unmounted
  if (intervalId.value) {
    clearInterval(intervalId.value);
    console.log("Interval cleared");
  }
});

const onReset = () => {
  formSearch.value = {
    line: null,
    dateFrom: null,
    dateTo: null,
    lineModel: null,
    status: null,
  };
  onSearch();
};

const newPlanClick = () => {
  // dialog.value = true;

  router.push({
    name: "planning-info",
  });
};

const loadPlanCurrent = (line) => {
  if (formSearch.value.line) {
    api.getPalnListCurrent(line).then((data) => {
      itemsPlanCurrent.value = data;
      currentPlanTime.value = moment().format("YYYY-MM-DD HH:mm:ss");
    });
  }
};

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

    itemsDetail.value = response.data;
    totalItemsDetail.value = response.total_record;
  } catch (error) {
    console.error("Error fetching API:", error);
    itemsDetail.value = [];
    totalItemsDetail.value = 0;
  }
  isLoading.value = false;
};

const lineChange = (value) => {
  console.log("lineChange", value);
  lineModelList.value = [];
  ddlApi.lineModel(value).then((data) => {
    lineModelList.value = data;
  });
  loadPlanCurrent(value);
};

const onPlanCurrentEditClick = (id) => {
  router.push({
    name: "planning-info",
    params: {
      id: id,
    },
  });
};

const onEditPlan = (id) => {
  router.push({
    name: "planning-info",
    params: {
      id: id,
    },
  });
};

const onStopPlanClick = (item) => {
  console.log("onStopPlanClick", item);
  Alert.confirm("กรุณายืนยัน การหยุดแผนผลิต นี้").then(({ isConfirmed }) => {
    if (isConfirmed) {
      isLoading.value = true;
      api
        .stopPlan(item.id)
        .then((response) => {
          if (response.status === 0) {
            Alert.success("Stop plan success");
          } else {
            Alert.warning("Stop plan failed");
          }
        })
        .catch((error) => {
          console.error("Error deleting line:", error);
          Alert.error("Error deleting line");
        })
        .finally(() => {
          isLoading.value = false;
        });
    }
  });
};

const onDelete = (id) => {
  Alert.confirm("Are you sure you want to delete this plan ?").then(
    ({ isConfirmed }) => {
      if (isConfirmed) {
        isLoading.value = true;
        api
          .deletePlan(id)
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
</script>

<style>
.textRunning {
  color: #3366ff;
  font-weight: bold;
}
.text-red {
  color: red;
  font-weight: bold;
}
.text-green {
  color: green;
  font-weight: bold;
}
</style>
