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
            <v-select v-model="formSearch.line" :items="[
              { title: 'All', value: null },
              { title: 'Cylinder Head 1' },
              { title: 'Cylinder Head 2' },
              { title: 'Cylinder Head 3' },
              { title: 'Cylinder Head 4' },
              { title: 'Cylinder Head 5' },
              { title: 'Cylinder Head 6', value: '1' },
            ]"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Plan Date From</label>
            <n-date v-model="date1"></n-date>
          </v-col>
          <v-col cols="2">
            <label>Plan Date To</label>
            <n-date v-model="date2"></n-date>
          </v-col>

          <v-col cols="2">
            <label>Model</label>
            <v-select v-model="formSearch.line" :items="[
              { title: 'All', value: null },
              { title: 'Cylinder Head 1' },
              { title: 'Cylinder Head 2' },
              { title: 'Cylinder Head 3' },
              { title: 'Cylinder Head 4' },
              { title: 'Cylinder Head 5' },
              { title: 'Cylinder Head 6', value: '1' },
            ]"></v-select>
          </v-col>
          <v-col cols="2">
            <label>Reason</label>
            <v-select v-model="formSearch.line" :items="[
              { title: 'All', value: null },
              { title: 'Cylinder Head 1' },
              { title: 'Cylinder Head 2' },
              { title: 'Cylinder Head 3' },
              { title: 'Cylinder Head 4' },
              { title: 'Cylinder Head 5' },
              { title: 'Cylinder Head 6', value: '1' },
            ]"></v-select>
          </v-col>

          <v-col cols="2">
            <label>Status</label>
            <v-select v-model="formSearch.isActive" :items="[{ title: 'All', value: null }]"></v-select>
          </v-col>
        </v-row>
        <div class="row mt-1 mb-1">
          <div class="d-flex justify-center">
            <n-btn-search @click="onSearch" />
            <n-btn-reset @click="onReset" class="ml-3" />
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-card class="mt-5">
      <v-card-text>
        <v-row>
          <n-btn-add no-permission label="New NG" class="ma-5" @click="newPlanClick"></n-btn-add>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table v-model:page="currentPage" :headers="headersDetail" :items="itemsDetail"
              :items-per-page="pageSize">
              <template v-slot:[`item.action`]="{ item }">
                <n-gbtn-edit :permission="false" @click="onEdit(item.Menu_No)"></n-gbtn-edit>

                <n-gbtn-delete :permission="false" v-if="item.buttonDel"></n-gbtn-delete>
              </template>

              <template v-slot:bottom>
                <n-pagination v-model:currentPage="currentPage" v-model:itemPerPage="pageSize"
                  v-model:totalItems="totalItemsDetail"></n-pagination>
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

const dialog = ref(false);

const formSearch = ref({ line: "1" });
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
const totalItems = ref(2);

const totalItemsDetail = ref(8);

const headersDetail = [
  { title: "", key: "action", sortable: false, nowrap: true },
  { title: "Line", key: "plan_date", sortable: false },
  { title: "Date", key: "paln_time", sortable: false },
  { title: "Time", key: "shift", sortable: false },
  { title: "Model", key: "shift_date", sortable: false },
  { title: "Part No", key: "ot", sortable: false },
  { title: "Quantity", key: "model", sortable: false },
  { title: "Reason", key: "cycle_time", sortable: false },
  { title: "Comment", key: "totol_time", sortable: false },
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
