<template>
  <v-card class="ma-5">
    <v-card-title>
      <h5>Planning Information</h5>
    </v-card-title>

    <v-card-text>
      <v-form ref="frmInfo">
        <v-row>
          <v-col md="2">
            <label>Line</label>
            <v-select
              v-model="form.lineCd"
              :items="lineList"
              @update:model-value="onLineChange"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col md="2">
            <label>Line Name</label>
            <v-text-field v-model="form.lineName" readonly></v-text-field>
          </v-col>
          <v-col md="2">
            <label>PK Code</label>
            <v-text-field v-model="form.pkCd" readonly></v-text-field>
          </v-col>
          <v-col md="2">
            <label>Plan Date</label>
            <n-date v-model="form.planDate" :rules="[rules.required]"> </n-date>
          </v-col>
          <v-col md="2">
            <label>Plan Start Time</label>
            <n-time
              v-model="form.planStartTime"
              @update:model-value="onPlanStartTimeChange"
              :rules="[rules.required]"
            ></n-time>
          </v-col>

          <v-col md="2">
            <label>Plan Amt(AS400)</label>
            <v-text-field v-model="form.planAmtAS400" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Shift</label>
            <v-select
              v-model="form.shiftTeam"
              :items="shiftList"
              @update:model-value="onshiftChange"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <v-col md="2">
            <label>Shift Period</label>
            <v-select
              v-model="form.shiftPeriod"
              :items="shiftPeriodList"
              readonly
            ></v-select>
          </v-col>

          <v-col md="1">
            <v-checkbox
              v-model="form.b1"
              label="Break 1"
              value="Y"
              @update:model-value="calculateTotalTime"
            ></v-checkbox>
          </v-col>
          <v-col md="1">
            <v-checkbox
              v-model="form.b2"
              label="Lunch Break"
              value="Y"
              @update:model-value="calculateTotalTime"
            ></v-checkbox>
          </v-col>
          <v-col md="1">
            <v-checkbox
              v-model="form.b3"
              label="Break 2"
              value="Y"
              @update:model-value="calculateTotalTime"
            ></v-checkbox>
          </v-col>
          <v-col md="1">
            <v-checkbox
              v-model="form.b4"
              label="Break OT"
              value="Y"
              @update:model-value="calculateTotalTime"
            ></v-checkbox>
          </v-col>
          <v-col md="2">
            <v-checkbox
              v-model="form.ot"
              label="OT"
              value="Y"
              @update:model-value="calculateTotalTime"
            ></v-checkbox>
          </v-col>

          <v-col md="2">
            <label>Total Time(mins)</label>
            <v-text-field v-model="form.planTotalTime" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Model</label>
            <v-select
              v-model="form.modelCd"
              :items="modelList"
              item-title="Model_CD"
              item-value="Model_CD"
              @update:model-value="onModelChange"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <v-col md="2">
            <label>Product Code</label>
            <v-text-field v-model="form.productCd" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Part No</label>
            <v-text-field v-model="form.partNo" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Part Upper</label>
            <v-text-field v-model="form.partUpper" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Part Lower</label>
            <v-text-field v-model="form.partLower" readonly></v-text-field>
          </v-col>

          <v-col md="1">
            <label>Cycle Time(mins)</label>
            <n-input-number v-model="cycleTimeVModel" :rules="[rules.required]">
            </n-input-number>
          </v-col>

          <v-col md="1">
            <label>Target FG Amt</label>
            <v-text-field v-model="form.planFgAmt" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Operator</label>
            <v-select
              v-model="form.operator"
              :items="userList"
              item-value="col_value"
            ></v-select>
          </v-col>

          <v-col md="2">
            <label>Leader</label>
            <v-select
              v-model="form.leader"
              :items="userList"
              item-value="col_value"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <v-col md="2">
            <label>Planning ID</label>
            <v-text-field v-model="form.planningId" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Status</label>
            <v-text-field v-model="form.statusName" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Update By</label>
            <v-text-field v-model="form.updateBy" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Update Date</label>
            <v-text-field v-model="form.updateDate" readonly></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col>
          <div class="d-flex justify-center">
            <n-btn-save @click="onSave" />
            <n-btn-cancel @click="router.go(-1)" class="ml-3" />
          </div>
        </v-col>
      </v-row>
      <n-loading :loading="isLoading" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "@/api/plan.js";
import * as ddlApi from "@/api/dropdown-list.js";
import { useAuthStore } from "@/stores/auth";
import rules from "@/utils/rules";
const authStore = useAuthStore();
const Alert = inject("Alert");
const route = useRoute();

const frmInfo = ref(null);

const router = useRouter();
const form = ref({
  statusName: "Draft",
});

const userList = ref([]);
const lineList = ref([]);
const shiftList = ref([]);
const shiftPeriodList = ref([]);
const modelList = ref([]);

let workingTimes = [];
let totalWorkingTime = 0;

const cycleTimeVModel = ref(null);

onMounted(() => {
  ddlApi.user().then((data) => {
    userList.value = data;
  });
  ddlApi.line_().then((data) => {
    lineList.value = data;
  });
  ddlApi.shift().then((data) => {
    shiftList.value = data;
  });
  ddlApi.getPredefine("Shift_Period").then((data) => {
    shiftPeriodList.value = data;
  });

  api.getWorkingTimeAll().then((data) => {
    workingTimes = data;
  });
  if (route.params.id) {
    // Edit mode
  } else {
    // New mode
  }
});

// watch Target FG Amt = Total Time / Cycle Time --> Round 0  (เอาจำนวนเต็ม)
watch(
  [() => form.value.planTotalTime, () => cycleTimeVModel.value],
  ([p, c]) => {
    if (p && c) {
      form.value.planFgAmt = Math.floor(p / c);
    } else {
      form.value.planFgAmt = 0;
    }
  }
);

const onLineChange = (lineCd) => {
  const line = lineList.value.find((item) => item.lineCd === lineCd);

  form.value.lineName = line ? line.lineName : "";
  form.value.pkCd = line ? line.pkCd : "";
  modelList.value = [];
  form.value.modelCd = "";
  form.value.productCd = "";
  form.value.partNo = "";
  form.value.partUpper = "";
  form.value.partLower = "";
  cycleTimeVModel.value = "";
  api.getLineModel(lineCd).then((data) => {
    modelList.value = data;
  });
};

const onModelChange = (modelCd) => {
  const model = modelList.value.find((item) => item.Model_CD === modelCd);

  if (!model) {
    form.value.productCd = "";
    form.value.partNo = "";
    form.value.partUpper = "";
    form.value.partLower = "";
    cycleTimeVModel.value = "";
    return;
  }
  form.value.productCd = model ? model.Product_CD : "";
  form.value.partNo = model ? model.Part_No : "";
  form.value.partUpper = model ? model.Part_Upper : "";
  form.value.partLower = model ? model.Part_Lower : "";

  // convert Cycle_Time to minutes
  const cycleTime = model ? model.Cycle_Time : "";
  const cycleTimeParts = cycleTime.split(":");
  const cycleTimeInMinutes =
    parseInt(cycleTimeParts[0]) * 60 + parseInt(cycleTimeParts[1]);
  cycleTimeVModel.value = cycleTimeInMinutes;
};

const onPlanStartTimeChange = (planStartTime) => {
  // filter working time from "workingTimes" #planStartTime between timeStart and timeEnd
  const filteredWorkingTime = workingTimes.filter((item) => {
    const timeStart = item.timeStart.split(":");
    const timeEnd = item.timeEnd.split(":");
    const planStartTimeParts = planStartTime.split(":");

    const startTimeInMinutes =
      parseInt(timeStart[0]) * 60 + parseInt(timeStart[1]);
    const endTimeInMinutes = parseInt(timeEnd[0]) * 60 + parseInt(timeEnd[1]);
    const planStartTimeInMinutes =
      parseInt(planStartTimeParts[0]) * 60 + parseInt(planStartTimeParts[1]);

    return (
      planStartTimeInMinutes >= startTimeInMinutes &&
      planStartTimeInMinutes <= endTimeInMinutes
    );
  });
  if (filteredWorkingTime.length > 0) {
    form.value.shiftPeriod = filteredWorkingTime[0].dN;
  } else {
    form.value.shiftPeriod = null;
  }

  sumWorkingTime(form.value.shiftPeriod);
  calculateTotalTime();
};

const sumWorkingTime = (dN) => {
  if (!dN) {
    totalWorkingTime = 0;
    return;
  }
  const filteredWorkingTime = workingTimes.filter(
    (item) => item.dN === dN && item.workType === "WT"
  );

  let total = 0;

  for (let i = 0; i < filteredWorkingTime.length; i++) {
    total += filteredWorkingTime[i].timeMins;
  }

  totalWorkingTime = total;
  console.log("sumWorkingTime", totalWorkingTime);
};

const calculateTotalTime = () => {
  if (!form.value.shiftPeriod) {
    form.value.planTotalTime = 0;
    return;
  }
  let totalTime = totalWorkingTime;
  if (form.value.b1 === "Y") {
    const b1 = workingTimes.find(
      (item) => item.dN === form.value.shiftPeriod && item.workType === "B1"
    );
    if (b1) {
      totalTime += b1.timeMins;
    }
  }
  if (form.value.b2 === "Y") {
    const b2 = workingTimes.find(
      (item) => item.dN === form.value.shiftPeriod && item.workType === "B2"
    );
    if (b2) {
      totalTime += b2.timeMins;
    }
  }
  if (form.value.b3 === "Y") {
    const b3 = workingTimes.find(
      (item) => item.dN === form.value.shiftPeriod && item.workType === "B3"
    );
    if (b3) {
      totalTime += b3.timeMins;
    }
  }
  if (form.value.b4 === "Y") {
    const b4 = workingTimes.find(
      (item) => item.dN === form.value.shiftPeriod && item.workType === "B4"
    );
    if (b4) {
      totalTime += b4.timeMins;
    }
  }
  if (form.value.ot === "Y") {
    const ot = workingTimes.find(
      (item) => item.dN === form.value.shiftPeriod && item.workType === "OT"
    );
    if (ot) {
      totalTime += ot.timeMins;
    }
  }
  form.value.planTotalTime = totalTime;
};

const onshiftChange = (shiftCd) => {
  const shift = shiftList.value.find((item) => item.value === shiftCd);

  console.log("shift", shift);
  form.value.operator = shift ? shift.defaultOperator : "";
  form.value.leader = shift ? shift.defaultLeader : "";
};

const onSave = async () => {
  const { valid } = await frmInfo.value.validate();
  if (!valid) return;

  // convert cycleTime to string format "HH:mm:ss"
  const cycleTime = cycleTimeVModel.value;
  const hours = Math.floor(cycleTime / 60);
  const minutes = cycleTime % 60;
  const cycleTimeString = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:00`;
  form.value.cycleTime = cycleTimeString;

  api.newPlan(form.value).then(async (res) => {
    if (res.status === 0) {
      await Alert.success();
      router.go(-1);
    } else {
      Alert.warning(res.data.message);
    }
  });
};
</script>
