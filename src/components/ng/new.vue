<template>
  <v-form ref="frmInfo">
    <v-card>
      <v-card-title>
        <span class="headline">{{ mode }} New NG</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="5">
              <label>Line </label>
              <v-select v-model="formInfo.line" :items="[
                { title: 'Cylinder Head 1' },
                { title: 'Cylinder Head 2' },
                { title: 'Cylinder Head 3' },
                { title: 'Cylinder Head 4' },
                { title: 'Cylinder Head 5' },
                { title: 'Cylinder Head 6', value: '1' },
              ]"></v-select>
            </v-col>
            <v-col cols="5">
              <label>Plan Date</label>
              <n-date v-model="formInfo.plan_date"></n-date>
            </v-col>
            <div class="row mt-6 ml-2">
              <div class="d-flex justify-center">
                <n-btn-search @click="onSearch" />
              </div>
            </div>

          </v-row>
          <!-- <v-row class="mb-3">
                  <v-col>
                    <hr />
                  </v-col>
                </v-row> -->
        </v-container>
      </v-card-text>

      <v-divider></v-divider>
      <!-- <div class="d-flex justify-center py-3">
              <n-btn-save no-permission @click="saveClick" class="me-3"></n-btn-save>
              <n-btn-cancel text @click="dialog = false"></n-btn-cancel>
            </div> -->

      <!-- <v-card class="mt-5"> -->
      <v-card-text>
        <v-row>
          <v-col>
            <v-data-table v-model:page="currentPage" :headers="headersDetail" :items="itemsDetail"
              :items-per-page="pageSize">
              <template v-slot:[`item.action`]="{ item }">
                <n-btn-search @click="onSelect('a')" />
              </template>

              <template v-slot:bottom>
                <n-pagination v-model:currentPage="currentPage" v-model:itemPerPage="pageSize"
                  v-model:totalItems="totalItemsDetail"></n-pagination>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- </v-card> -->
    </v-card>
  </v-form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import rules from "@/utils/rules";
import { useRouter } from "vue-router";

const dialog = ref(false);

const router = useRouter();

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
  { title: "Plan Date", key: "plan_date", sortable: false },
  { title: "Plan Start Time", key: "paln_time", sortable: false },
  { title: "Shift", key: "shift", sortable: false },
  { title: "Shift Time", key: "shift_date", sortable: false },
  { title: "Break1", key: "ot", sortable: false },
  { title: "Lunch Break", key: "model", sortable: false },
  { title: "Break2", key: "cycle_time", sortable: false },
  { title: "Break OT", key: "totol_time", sortable: false },
  { title: "Break OT", key: "target_fg", sortable: false },
  { title: "OT", key: "actual_fg", sortable: false },
  { title: "Model", key: "ng", sortable: false },
  { title: "Status", key: "status", sortable: false },
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

const onSelect = (id) => {
  router.push({ name: `ng-info`, params: { id: id } });
}

</script>

<style>
.textRunning {
  color: #3366ff;
  font-weight: bold;
}
</style>