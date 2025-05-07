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
            ></v-select>
          </v-sheet>
          <v-sheet width="160" class="mr-3">
            <label>Plan Date From</label>
            <n-date v-model="date1"></n-date>
          </v-sheet>
          <v-sheet width="160" class="mr-3">
            <label>Plan Date To</label>
            <n-date v-model="date2"></n-date>
          </v-sheet>
          <v-sheet width="200" class="mr-3">
            <label>Model</label>
            <v-select
              v-model="formSearch.model"
              :items="[{ title: 'All', value: null }, ...lineModelList]"
            ></v-select>
          </v-sheet>
          <v-sheet width="160" class="mr-3">
            <label>Status</label>
            <v-select
              v-model="formSearch.isActive"
              :items="[{ title: 'All', value: null }, ...statusList]"
            ></v-select>
          </v-sheet>
          <v-sheet class="pt-5" width="120">
            <n-btn-search @click="onSearch" />
          </v-sheet>
        </v-row>
        <!-- <v-row>
          <v-col cols="8">
            <v-row>
              <v-col>
                <label>Line</label>
                <v-select
                  v-model="formSearch.isActive"
                  :items="[{ title: 'All', value: null }]"
                ></v-select>
              </v-col>
              <v-col>
                <label>Plan Date From</label>
                <n-date v-model="date1"></n-date>
              </v-col>
              <v-col>
                <label>Plan Date From</label>
                <n-date v-model="date2"></n-date>
              </v-col>

              <v-col>
                <label>Status</label>
                <v-select
                  v-model="formSearch.isActive"
                  :items="[{ title: 'All', value: null }]"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <div class="row">
              <div class="d-flex justify-center">
                <n-btn-search @click="onSearch" />
                <n-btn-reset @click="onReset" class="ml-3" />
              </div>
            </div>
          </v-col>
        </v-row> -->
        <v-row class="mb-3">
          <v-col>
            <hr />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3 style="color: #3366ff">
              Current Production Plan 03/04/2025 10:10:00
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
                <v-icon
                  icon="mdi-pencil-outline"
                  v-tooltip:end="'Edit'"
                  class="text-warning"
                ></v-icon>
              </template>
              <template v-slot:[`item.action2`]="{ item }">
                <v-icon
                  icon="mdi mdi-cancel"
                  style="color: red"
                  v-if="item.action2"
                ></v-icon>
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.status }}
                </div>
              </template>
              <template v-slot:[`item.production_date`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.production_date }}
                </div>
              </template>
              <template v-slot:[`item.start_time`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.start_time }}
                </div>
              </template>
              <template v-slot:[`item.finish_date`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.finish_date }}
                </div>
              </template>
              <template v-slot:[`item.model`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.model }}
                </div>
              </template>
              <template v-slot:[`item.shift`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.shift }}
                </div>
              </template>
              <template v-slot:[`item.shift_time`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.shift_time }}
                </div>
              </template>
              <template v-slot:[`item.ot`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.ot }}
                </div>
              </template>
              <template v-slot:[`item.cycle_time`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.cycle_time }}
                </div>
              </template>
              <template v-slot:[`item.shift`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.shift }}
                </div>
              </template>
              <template v-slot:[`item.total_time`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.total_time }}
                </div>
              </template>
              <template v-slot:[`item.target_fg`]="{ item }">
                <div :class="{ textRunning: item.status == 'Running' }">
                  {{ item.target_fg }}
                </div>
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
          <v-btn
            prepend-icon="mdi mdi-file-document-arrow-right-outline"
            class="bg-gradient-info export-btn mt-5"
          >
            <template v-slot:prepend>
              <v-icon color="write" size="large"></v-icon>
            </template>
            Export to Excel
          </v-btn>
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
                <n-gbtn-edit
                  :permission="false"
                  @click="onEdit(item.Menu_No)"
                ></n-gbtn-edit>

                <n-gbtn-delete
                  :permission="false"
                  v-if="item.buttonDel"
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

    <v-dialog v-model="dialog" max-width="800px">
      <v-form ref="frmInfo">
        <v-card>
          <v-card-title>
            <span class="headline">{{ mode }} Planning Information</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="4">
                  <label>Line </label>
                  <v-select
                    v-model="formInfo.line"
                    :items="[
                      { title: 'Cylinder Head 1' },
                      { title: 'Cylinder Head 2' },
                      { title: 'Cylinder Head 3' },
                      { title: 'Cylinder Head 4' },
                      { title: 'Cylinder Head 5' },
                      { title: 'Cylinder Head 6', value: '1' },
                    ]"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <label>Plan Date</label>
                  <n-date v-model="formInfo.plan_date"></n-date>
                </v-col>

                <v-col cols="4">
                  <label>Plan Start Time </label>
                  <n-time v-model="formInfo.plan_start_time"></n-time>
                </v-col>

                <v-col cols="4">
                  <label>Shift </label>
                  <v-select
                    v-model="formInfo.shift"
                    :items="[
                      { title: 'Team A', value: 'a' },
                      { title: 'Team B' },
                    ]"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <label>Shift Time</label>
                  <v-select
                    v-model="formInfo.shift_time"
                    :items="[{ title: 'Day (08:00 - 20:00)', value: 'a' }]"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <label>OT</label>
                  <v-select
                    v-model="formInfo.ot"
                    :items="[{ title: 'Yes OT', value: 'a' }]"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <label>Model</label>
                  <v-select
                    v-model="formInfo.model"
                    :items="[{ title: 'EX400', value: 'a' }]"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <label>Cycle Time(mins)</label>
                  <v-text-field
                    v-model="formInfo.cycle_time"
                    readonly
                    value="8.00"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Part Name</label>
                  <v-select
                    v-model="formInfo.partName"
                    :items="[{ title: 'Cylinder Head XX', value: 'a' }]"
                  ></v-select>
                </v-col>

                <v-col cols="4">
                  <label>Part No</label>
                  <v-text-field
                    v-model="formInfo.cycle_time"
                    readonly
                    value="1001-5031"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Part Upper</label>
                  <v-text-field readonly value="10001-00031"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Part Lower</label>
                  <v-text-field readonly value="10001-00231"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Man Power</label>
                  <v-text-field
                    v-model="formInfo.cycle_time"
                    value="1"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Planning ID</label>
                  <v-text-field readonly value="P2504-0001"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Status</label>
                  <v-text-field readonly value="Finished"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Update By</label>
                  <v-text-field readonly value="Planner A"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>Update Date</label>
                  <v-text-field
                    readonly
                    value="31/03/2025 13:45"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>
          <div class="d-flex justify-center py-3">
            <n-btn-save
              no-permission
              @click="saveClick"
              class="me-3"
            ></n-btn-save>
            <n-btn-cancel text @click="dialog = false"></n-btn-cancel>
          </div>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import rules from "@/utils/rules";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/plan.js";

import { getPaging, getDateFormat } from "@/utils/utils.js";

const dialog = ref(false);

const formSearch = ref({});
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
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(2);

const lineList = ref([]);
const lineModelList = ref([]);
const statusList = ref([]);

const totalItemsDetail = ref(8);

const headersPlanCurrent = [
  { title: "", key: "action", sortable: false },
  { title: "", key: "action2", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Production Date", key: "production_date", sortable: false },
  { title: "Start Time", key: "start_time", sortable: false },
  { title: "Finish Time", key: "finish_date", sortable: false },
  { title: "Model", key: "model", sortable: false },
  { title: "Shift", key: "shift", sortable: false },
  { title: "Shift Time", key: "shift_time", sortable: false },
  { title: "OT", key: "ot", sortable: false },
  { title: "Cycle Time(mins)", key: "cycle_time", sortable: false },
  { title: "Total Time()mins", key: "total_time", sortable: false },
  { title: "Target FG", key: "target_fg", sortable: false },
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
    console.log("Fetching data every 5 seconds");
    if (formSearch.value.line) {
      loadPlanCurrent(formSearch.value.line);
    }
  }, 5000); // 5000ms = 5 seconds
});

onUnmounted(() => {
  // Clear the interval when the component is unmounted
  if (intervalId.value) {
    clearInterval(intervalId.value);
    console.log("Interval cleared");
  }
});

const newPlanClick = () => {
  dialog.value = true;
};

const loadPlanCurrent = (line) => {
  api.getPalnListCurrent(line).then((data) => {
    itemsPlanCurrent.value = data;
  });
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

    const response = await api.search(data);

    itemsDetail.value = response.data;
    totalItems.value = response.total_record;
  } catch (error) {
    console.error("Error fetching API:", error);
    itemsDetail.value = [];
    totalItems.value = 0;
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
</script>

<style>
.textRunning {
  color: #3366ff;
  font-weight: bold;
}
</style>
