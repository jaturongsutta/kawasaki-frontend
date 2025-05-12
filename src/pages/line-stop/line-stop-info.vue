<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>{{ pageMode === "add" ? "New" : "Edit" }} : Line Stop</h4>
      </v-card-title>
      <v-divider class="mb-8"></v-divider>
      <v-card-text>
        <v-form ref="frmInfo">
          <v-row class="align-center">
            <v-col cols="6">
              <label>Line</label>
              <v-text-field v-model="formInfo.Line_CD" readonly :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="require-field">Machine</label>
              <v-select v-model="formInfo.Machine_No" :items="machineList" :rules="[rules.required]"
                :readonly="formInfo.Status === '90'"></v-select>
            </v-col>
            <v-col cols="6">
              <label class="require-field">Stop Date</label>
              <n-date v-model="formInfo.Line_Stop_Date" :readonly="formInfo.Status === '90'" />
            </v-col>
            <v-col cols="3">
              <label class="require-field">Stop Time</label>
              <n-time v-model="formInfo.Line_Stop_Time" :rules="[rules.required]"
                :readonly="formInfo.Status === '90'" />
            </v-col>

            <v-col cols="3">
              <label class="require-field">Lost Time (mins)</label>
              <n-time-mins v-model="formInfo.Loss_Time" :rules="[rules.required]"
                :readonly="formInfo.Status === '90'" />
            </v-col>
            <v-col cols="12">
              <label class="require-field">Reason</label>
              <v-select v-model="formInfo.Reason_CD" :items="reasonList" :rules="[rules.required]"
                :readonly="formInfo.Status === '90'"></v-select>
            </v-col>
            <v-col cols="12">
              <label>Comment</label>
              <v-text-field v-model="formInfo.Comment" :readonly="formInfo.Status === '90'"></v-text-field>
            </v-col>

            <v-col cols="6" v-if="pageMode === 'edit'">
              <label>Status</label>
              <v-text-field v-model="formInfo.status_name" readonly></v-text-field>
            </v-col>
            <v-col cols="3" v-if="pageMode === 'edit'">
              <label>Updated By</label>
              <v-text-field v-model="formInfo.Updated_By" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
            <v-col cols="3" v-if="pageMode === 'edit'">
              <label>Updated Date</label>
              <v-text-field v-model="formInfo.Updated_Date" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mt-8 mb-6"></v-divider>
          <v-row>
            <v-col>
              <div class="d-flex justify-center mb-3">
                <n-btn-save no-permission @click="saveClick('save')" class="me-5"
                  :disabled="formInfo.Status === '90'"></n-btn-save>
                <n-btn-cancel @click="router.go(-1)" class="me-5" />
                <n-btn-confirm no-permission @click="saveClick('confirmed')"
                  :disabled="formInfo.Status === '90'"></n-btn-confirm>
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
import * as api from "@/api/line-stop.js";
import rules from "@/utils/rules";
import { getCurrrentDate, getDateFormat, secondsToMMSS } from "@/utils/utils";
import { DateTime } from 'luxon'

const route = useRoute();
const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const dialog = ref(false);
const reasonList = ref([]);
const machineList = ref([]);

let formInfo = ref({
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
  "Status": "",
  "status_name": "",
  "Updated_By": "",
  "Updated_Date": "",
  "Process_CD": "",
  "Line_Stop_Date": "",
  "Line_Stop_Time": "",
  "Loss_Time": "",
  "Quantity": "",
  "Reason_CD": "",
  "Comment": "",
  "Machine_No": ''
});

let isLoading = ref(false);
let isDialogLoading = ref(false);
let pageMode = ref("add");

onMounted(() => {
  ddlApi.getPredefine("Stop_Reason").then((data) => {
    reasonList.value = data;
  });

  if (route.params.id) {
    console.log("edit ")
    pageMode.value = "edit";
    loadData();
  }
  else {
    console.log("add ")
    const v = localStorage.getItem("line-stop-new");
    if (v) {
      const d = JSON.parse(v);
      formInfo.value = d;
    }

    formInfo.value.Line_Stop_Date = getCurrrentDate();
    formInfo.value.Line_Stop_Time = DateTime.now().setZone('Asia/Bangkok').toFormat("HH:mm")
    getMachineDDL();
  }

});

const getMachineDDL = () => {
  api.getMachineDDL(formInfo.value.Line_CD).then((v) => {
    machineList.value = v.data;
  });
}

const loadData = async () => {
  try {
    isLoading.value = true;
    let id = route.params.id;
    const response = await api.getById(id);

    if (response.status === 2) {
      Alert.error("Error ", response.message);
      return;
    }
    formInfo.value = response.data;
    formInfo.value.Line_Stop_Date = getDateFormat(formInfo.value.Line_Stop_Date, "yyyy-MM-dd");
    formInfo.value.Line_Stop_Time = getDateFormat(formInfo.value.Line_Stop_Time, "HH:mm");
    formInfo.value.Updated_Date = getDateFormat(formInfo.value.Updated_Date);
    formInfo.value.Loss_Time = secondsToMMSS(formInfo.value.Loss_Time);

    getMachineDDL();
  } catch (error) {
    console.error("Error fetching API:", error);
    formInfo.value = {}
  }
  isLoading.value = false;
};

const saveClick = async (mode) => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;

    isLoading.value = true;
    let res = null;

    const v = { ...formInfo.value };
    let info = {
      processCd: v.Process_CD,
      lineCd: v.Line_CD,
      machineNo: v.Machine_No,
      lineStopDate: v.Line_Stop_Date,
      lineStopTime: `${v.Line_Stop_Time}:00`,
      lossTime: v.Loss_Time,
      reason: v.Reason_CD,
      comment: v.Comment,
      idRef: v.ID_Ref,
      status: mode === 'save' ? '00' : '90'
    }
    if (pageMode.value === "add") {
      console.log("Add");
      info = {
        ...info,
        planId: `${v.id}`,
      }
      res = await api.add(info);
    } else {
      console.log("Edit");
      res = await api.update(route.params.id, info);
    }
    isLoading.value = false;
    if (res.status === 0) {
      dialog.value = false;
      if (mode === "save") {
        await Alert.success();
      }
      else {
        await Alert.success("Confirmed Successful");
      }
      router.back();
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