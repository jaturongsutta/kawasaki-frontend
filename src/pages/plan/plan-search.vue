<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>Plan</h4>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-row></v-row>
        <v-row>
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
        </v-row>
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
              :headers="headers"
              :items="items"
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
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-5">
      <v-card-text>
        <v-row>
          <n-btn-add no-permission label="New Plan" class="ma-5"></n-btn-add>
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
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const formSearch = ref({});
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(2);

const totalItemsDetail = ref(8);

const headers = [
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

const items = ref([
  {
    action2: true,
    status: "Running",
    production_date: "03/04/2025",
    start_time: "08:00",
    finish_date: "20:00",
    model: "EX400",
    shift: "Team A",
    shift_time: "Day(08:00 - 20:00)",
    ot: "Yes OT",
    cycle_time: "8",
    total_time: "620",
    target_fg: "77",
  },
  {
    action2: false,
    status: "Next Production",
    production_date: "03/04/2025",
    start_time: "20:00",
    finish_date: "08:00",
    model: "EX400",
    shift: "Team B",
    shift_time: "Night(20:00 - 08:00)",
    ot: "No OT",
    cycle_time: "8",
    total_time: "460",
    target_fg: "52",
  },
]);

const headersDetail = [
  { title: "", key: "action", sortable: false, nowrap: true },
  { title: "Plan Date", key: "plan_date", sortable: false },
  { title: "Plan Start Time", key: "paln_time", sortable: false },
  { title: "Shift", key: "shift", sortable: false },
  { title: "Shift Time", key: "shift_date", sortable: false },
  { title: "OT", key: "ot", sortable: false },
  { title: "Model", key: "model", sortable: false },
  { title: "Cycle Time(mins)", key: "cycle_time", sortable: false },
  { title: "Total Time()mins", key: "totol_time", sortable: false },
  { title: "Target FG", key: "target_fg", sortable: false },
  { title: "Actual FG", key: "actual_fg", sortable: false },
  { title: "NG", key: "ng", sortable: false },
  { title: "Line/MC Stop", key: "line_mc_stop", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Update By", key: "update_by", sortable: false },
  { title: "Update Date", key: "update_date", sortable: false },
];

const itemsDetail = ref([
  {
    plan_date: "01/04/2025",
    paln_time: "08:00",
    shift: "Team A",
    shift_date: "Day(08:00 - 20:00)",
    ot: "Yes OT",
    model: "EX400",
    cycle_time: "8",
    totol_time: "620",
    target_fg: "77",
    actual_fg: "70",
    ng: "2",
    line_mc_stop: "0",
    status: "Finish",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },
  {
    plan_date: "01/04/2025",
    paln_time: "20:00",
    shift: "Team B",
    shift_date: "Night(08:00 - 20:00)",
    ot: "No OT",
    model: "EX400",
    cycle_time: "8",
    totol_time: "460",
    target_fg: "57",
    actual_fg: "35",
    ng: "0",
    line_mc_stop: "1",
    status: "Plan Stopped",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },
  {
    plan_date: "01/04/2025",
    paln_time: "08:00",
    shift: "Team A",
    shift_date: "Day(08:00 - 20:00)",
    ot: "Yes OT",
    model: "EX200",
    cycle_time: "7",
    totol_time: "620",
    target_fg: "77",
    actual_fg: "70",
    ng: "2",
    line_mc_stop: "0",
    status: "Finish",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },
  {
    plan_date: "01/04/2025",
    paln_time: "20:00",
    shift: "Team B",
    shift_date: "Night(08:00 - 20:00)",
    ot: "No OT",
    model: "EX200",
    cycle_time: "7",
    totol_time: "460",
    target_fg: "57",
    actual_fg: "35",
    ng: "0",
    line_mc_stop: "1",
    status: "Finish",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },

  {
    plan_date: "01/04/2025",
    paln_time: "20:00",
    shift: "Team B",
    shift_date: "Night(08:00 - 20:00)",
    ot: "No OT",
    model: "EX400",
    cycle_time: "8",
    totol_time: "460",
    target_fg: "57",
    actual_fg: "",
    ng: "",
    line_mc_stop: "",
    status: "Running",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },
  {
    buttonDel: true,
    plan_date: "01/04/2025",
    paln_time: "08:00",
    shift: "Team A",
    shift_date: "Day(08:00 - 20:00)",
    ot: "Yes OT",
    model: "EX400",
    cycle_time: "8",
    totol_time: "620",
    target_fg: "77",
    actual_fg: "",
    ng: "",
    line_mc_stop: "",
    status: "New",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },
  {
    buttonDel: true,
    plan_date: "01/04/2025",
    paln_time: "20:00",
    shift: "Team B",
    shift_date: "Night(08:00 - 20:00)",
    ot: "No OT",
    model: "EX400",
    cycle_time: "8",
    totol_time: "460",
    target_fg: "57",
    actual_fg: "",
    ng: "",
    line_mc_stop: "",
    status: "New",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },
  {
    buttonDel: true,
    plan_date: "01/04/2025",
    paln_time: "08:00",
    shift: "Team A",
    shift_date: "Day(08:00 - 20:00)",
    ot: "Yes OT",
    model: "EX400",
    cycle_time: "8",
    totol_time: "620",
    target_fg: "77",
    actual_fg: "",
    ng: "",
    line_mc_stop: "",
    status: "New",
    update_by: "Planner A",
    update_date: "31/03/2025 13:45",
  },
]);
</script>
