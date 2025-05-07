<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>{{ pageMode === "add" ? "New" : "Edit" }} : NG Rejection</h4>
      </v-card-title>
      <v-divider class="mb-8"></v-divider>
      <v-card-text>
        <v-form ref="frmInfo">
          <v-row class="align-center">
            <v-col md="3">
              <label>Line</label>
              <v-text-field v-model="item.Line_CD" readonly :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Plan Date</label>
              <v-text-field v-model="item.Plan_Date" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Plan Start Time</label>
              <v-text-field v-model="item.Plan_Start_Time" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Shift</label>
              <v-text-field v-model="item.Team_Name" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Shift Period</label>
              <v-text-field v-model="item.Shift_Period_Name" readonly></v-text-field>
            </v-col>
            <v-col cols="9">
              <v-row class="pt-5">
                <v-col cols="2">
                  <v-checkbox label="Break 1" color="success" value="success" readonly></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox label="Lunch Break" color="success" value="success" readonly></v-checkbox>
                </v-col>
                <v-col cols="2">
                  <v-checkbox label="Break 2" color="success" value="success" readonly></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox label="Break OT" color="success" value="success" readonly></v-checkbox>
                </v-col>
                <v-col cols="2">
                  <v-checkbox label="OT" color="success" value="success" readonly></v-checkbox>
                </v-col>
              </v-row>
            </v-col>

            <v-col md="3">
              <label>Model</label>
              <v-text-field v-model="item.Model_CD" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Part No</label>
              <v-text-field v-model="item.part_no" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Part Upper</label>
              <v-text-field v-model="item.Part_Upper" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Part Lower</label>
              <v-text-field v-model="item.Part_Lower" readonly></v-text-field>
            </v-col>

            <v-col cols="3">
              <label>Process</label>
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
            <v-col cols="3">
              <label>NG Date</label>
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
            <v-col cols="3">
              <label class="require-field">NG Time</label>
              <v-text-field v-model="item.machineName" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="3">
              <label class="require-field">Quantity</label>
              <v-text-field v-model="item.machineName" :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="3">
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
            <v-col :cols="pageMode === 'add' ? '6' : '9'">
              <label class="require-field">Comment</label>
              <v-text-field v-model="item.machineName" :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col :cols="pageMode === 'add' ? '3' : '6'">
              <label>Status</label>
              <v-select v-model="item.isActive" :items="[{ title: 'All', value: null }, ...statusList]"
                :rules="[rules.required]"></v-select>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
              <label>Updated By</label>
              <v-text-field v-model="item.updatedBy" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
              <label>Updated Date</label>
              <v-text-field v-model="item.updatedDate" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mt-8 mb-6"></v-divider>
          <v-row>
            <v-col>
              <div class="d-flex justify-center mb-3">
                <n-btn-save />
                <n-btn-cancel @click="router.go(-1)" class="ml-3" />
              </div>
            </v-col>
          </v-row>
          <n-loading :loading="isLoading" />
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/machine.js";
import rules from "@/utils/rules";
import { getDateFormat, getTimeFormat } from "@/utils/utils";

const route = useRoute();
const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const dialog = ref(false);
const statusList = ref([]);
const formSearch = ref({ line: "1" });

let item = ref({
  "B1": "",
  "B2": "",
  "B3": "",
  "B4": "",
  "Cycle_Times": "",
  "Line_CD": "",
  "Model_CD": "",
  "OT": "",
  "Part_Lower": "",
  "Part_Upper": "",
  "Plan_Date": "",
  "Plan_Start_Time": "",
  "Shift_Period_Name": "",
  "Team_Name": "",
  "actual_fg_amt": "",
  "id": "",
  "line_stop": "",
  "ng_amt": "",
  "part_no": "",
  "plan_fg_amt": "",
  "plan_total_time": "",
  "status": "",
  "status_name": "",
  "updated_by": "",
  "updated_date": ""
});

let isLoading = ref(false);
let isDialogLoading = ref(false);
let pageMode = ref("add");

onMounted(() => {
  ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
    statusList.value = data;
  });

  if (route.params.id) {
    console.log("edit ")
    pageMode.value = "edit";
    // loadData();
  }
  const v = localStorage.getItem("ng-new");
  if (v) {
    const d = JSON.parse(v);
    item.value = d;
    item.value.Plan_Date = getDateFormat(item.value.Plan_Date);
    item.value.Plan_Start_Time = getTimeFormat(item.value.Plan_Start_Time);
    console.log('item is ', d);
    // localStorage.setItem("ng-new", '');
  }


});

const onSearch = async () => {
  console.log("search ")
  // loadData();
};

const loadData = async () => {
  try {
    isLoading.value = true;
    let id = pageMode.value === 'edit' ? route.params.id : item.value.machineNo;
    const response = await api.getById(id);

    if (response.status === 2) {
      Alert.error("Error ", response.message);
      return;
    }
    item.value = response.data;
    item.value.Plan_Date = getDateFormat(item.value.Plan_Date);
    item.value.Plan_Start_Time = getTimeFormat(item.value.Plan_Start_Time);

  } catch (error) {
    console.error("Error fetching API:", error);
    item.value = {}
  }
  isLoading.value = false;
};

const saveClick = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;
    isLoading.value = true;
    isDialogLoading.value = true;
    let res = null;
    if (pageMode.value === "add") {
      console.log("Add");
      res = await api.add(item.value);
    } else {
      console.log("Edit");
      res = await api.update(item.value.processCd, item.value);
    }
    isLoading.value = false;
    isDialogLoading.value = false;
    if (res.status === 0) {
      dialog.value = false;
      if (pageMode.value === 'edit') {
        Alert.success();
        onSearch();
      }
      else {
        await Alert.success();
        router.back();
      }
    } else {
      Alert.warning(res.message);
    }
  } catch (error) {
    isLoading.value = false;
    isDialogLoading.value = false;
    Alert.error(error.message);
  }
};
</script>