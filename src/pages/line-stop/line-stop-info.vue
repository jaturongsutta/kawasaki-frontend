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
              <label>Process</label>
              <v-select v-model="formInfo.Process_CD" placeholder="No Process Selected" :items="processList"
                :readonly="formInfo.Status === '90'"></v-select>
            </v-col>
            <v-col cols="6">
              <label class="require-field">Stop Date</label>
              <n-date v-model="formInfo.Line_Stop_Date" :readonly="formInfo.Status === '90'"
                :min-date="formInfo.Plan_Date" :max-date="formInfo.Plan_Date_Stop"
                @update:model-value="validateTimeRange(formInfo.Line_Stop_Time)" />
            </v-col>
            <v-col cols="3">
              <label class="require-field">Stop Time</label>
              <n-time v-model="formInfo.Line_Stop_Time" :rules="[rules.required, validateTimeRange]"
                :readonly="formInfo.Status === '90'" />
            </v-col>
            <v-col cols="3">
              <label class="require-field">Lost Time (mins)</label>
              <n-input-number v-model="formInfo.Loss_Time"
                :rules="[rules.required, validateZero, validateLossTimeWithStartTime]"
                :readonly="formInfo.Status === '90'" v-maska="'####'" />
            </v-col>
            <v-col cols="12">
              <label class="require-field">Reason</label>
              <v-autocomplete :loading="loadingReason" v-model:search="searchReason" clearable
                v-model="formInfo.Reason_CD" :items="reasonList" @update:model-value="onReasonSelected"
                :rules="[rules.required]" :readonly="formInfo.Status === '90'"></v-autocomplete>
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
import { onMounted, ref, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/line-stop.js";
import rules from "@/utils/rules";
import { getCurrrentDate, getDateFormat } from "@/utils/utils";
import { DateTime } from "luxon";
import { debounce } from "vuetify/lib/util/helpers.mjs";

const route = useRoute();
const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const dialog = ref(false);
const reasonList = ref([]);
const processList = ref([]);

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
  "Plan_Stop_Time": "",
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
});

const isLoading = ref(false);
const isDialogLoading = ref(false);
const pageMode = ref("add");
const planId = ref(null);

/* Reason function */
const searchReason = ref('');
const loadingReason = ref(false);
const isSelectingReason = ref(true);

watch(searchReason, async (val) => {
  fetchReasonItems(val);
})

const fetchReasonItems = debounce(async (query) => {
  if (isSelectingReason.value) return;

  if (!query) {
    reasonList.value = [];
    loadReasonList();
    return
  }
  loadingReason.value = true
  try {
    ddlApi.getPredefineItem("Stop_Reason", query).then((data) => {
      reasonList.value = data || [];
      loadingReason.value = false
    });
  } catch (e) {
    loadingReason.value = false
    console.error(e)
    reasonList.value = []
  }
}, 500)

const onReasonSelected = (item) => {
  if (item === null) {
    loadReasonList();
  }
  isSelectingReason.value = true;
  setTimeout(() => {
    isSelectingReason.value = false;
  }, 1000);
}

const loadReasonList = () => {
  setTimeout(() => {
    ddlApi.getPredefineItem("Stop_Reason").then((data) => {
      reasonList.value = data;
    });
  }, 100);
}
/* End Reason function */

onMounted(() => {
  loadReasonList();
  
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
    planId.value = `${v.id}`;
    formInfo.value.Line_Stop_Date = getDateFormat(formInfo.value.Plan_Date, "yyyy-MM-dd");
    formInfo.value.Line_Stop_Time = getDateFormat(formInfo.value.Plan_Start_Time, "HH:mm");
    getProcessDDL();
  }
});

const getProcessDDL = () => {
  ddlApi.lineMachine(formInfo.value.Line_CD).then((data) => {
    processList.value = data;
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
    planId.value = formInfo.value.Plan_ID;
    getProcessDDL();
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

function validateTimeRange(value) {
  if (planId.value === null) return true;
  if (!value) return true;
  console.log("validateTimeRange called")
  const [hh, mm, ss] = value.split(":").map(Number);
  const totalSeconds = hh * 3600 + mm * 60 + (ss || 0);

  if (isNaN(totalSeconds)) return true;

  const time = getStartStopTime();
  const startSeconds = time.startTime.hour * 3600 + time.startTime.minute * 60;
  const stopSeconds = time.stopTime.hour * 3600 + time.stopTime.minute * 60;
  validateLossTimeWithStartTime();
  let valid = true;
  if (startSeconds < stopSeconds) {
    valid = totalSeconds >= startSeconds && totalSeconds <= stopSeconds;
  }
  else {
    valid = totalSeconds >= startSeconds || totalSeconds <= stopSeconds;
  }
  if (!valid) {
    Alert.warning(`Stop Time must be between\n
     "${getDateFormat(time.startTime, "HH:mm:00")} and ${getDateFormat(time.stopTime, "HH:mm:00")}"`);
    formInfo.value.Line_Stop_Time = null;
    return false;
  }
  return true;
}

function validateLossTimeWithStartTime(v = null) {
  if (planId.value === null) return true;
  let lossMinutes = formInfo.value.Loss_Time;
  if (v !== null) {
    lossMinutes = v;
  }
  if (!lossMinutes) return true;
  console.log("validateLossTimeWithStartTime");
  const start = formInfo.value.Line_Stop_Time;
  const planStopISO = formInfo.value.Plan_Stop_Time;

  if (!start || !planStopISO) return true;
  const lossSeconds = Number(lossMinutes) * 60;
  const totalLastSeconds = calculateTimeDiffInSeconds(start, getDateFormat(planStopISO, "HH:mm:00"))

  if (lossSeconds > totalLastSeconds) {
    Alert.warning("Lost time is more than planned time");
    formInfo.value.Loss_Time = 0;
    return false;
  }

  return true;
}

const validateZero = value => {
  if (value == null || value === '' || Number(value) === 0) {
    return 'This field is required'
  }
  return true
}


function calculateTimeDiffInSeconds(startTimeStr, endTimeStr) {
  const [startH, startM] = startTimeStr.split(':').map(Number);
  const [endH, endM] = endTimeStr.split(':').map(Number);

  const baseDate = new Date('1970-01-01T00:00:00Z');

  const start = new Date(baseDate);
  start.setUTCHours(startH, startM, 0, 0);

  const end = new Date(baseDate);
  end.setUTCHours(endH, endM, 0, 0);

  /*ถ้าสิ้นสุดก่อนเริ่มต้น แสดงว่าข้ามวันบวก 1 วัน */
  if (end < start) {
    end.setUTCDate(end.getUTCDate() + 1);
  }
  const diffInSeconds = Math.floor((end - start) / 1000);
  return diffInSeconds;
}


function getStartStopTime() {
  const item = formInfo.value;
  const d1 = DateTime.fromISO(item.Plan_Date, { zone: "utc" });
  const d2 = DateTime.fromISO(item.Plan_Date_Stop, { zone: "utc" });

  const isSame = d1.hasSame(d2, 'day');
  let startTime = DateTime.fromISO(item.Plan_Start_Time, { zone: 'utc' });
  let stopTime = DateTime.fromISO(item.Plan_Stop_Time, { zone: 'utc' });

  if (!isSame) {
    const d3 = DateTime.fromISO(item.Line_Stop_Date, { zone: "utc" });
    const isSelectD1 = d1.hasSame(d3, 'day');
    if (isSelectD1) { /* Select first day */
      stopTime = DateTime.fromObject({ hour: 23, minute: 59 }, { zone: "utc" });
    }
    else { /* Select last day */
      startTime = DateTime.fromObject({ hour: 0, minute: 0 }, { zone: "utc" });
    }
  }
  return {
    startTime,
    stopTime
  }
}

</script>