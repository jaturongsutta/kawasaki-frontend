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
              :readonly="status !== ''"
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
            <n-date
              v-model="form.planDate"
              :rules="[rules.required]"
              :readonly="status > '00'"
              @update:model-value="onUpdateAS400PlanAmt"
            >
            </n-date>
          </v-col>
          <v-col md="2">
            <label>Plan Start Time</label>
            <n-time
              v-model="form.planStartTime"
              @update:model-value="onPlanStartTimeChange"
              :rules="[rules.required]"
              :readonly="status > '00'"
            ></n-time>
          </v-col>

          <v-col md="2">
            <label>Plan Amt(AS400)</label>
            <v-text-field v-model="form.as400PlanAmt" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Shift</label>
            <v-select
              v-model="form.shiftTeam"
              :items="shiftList"
              @update:model-value="onshiftChange"
              :rules="[rules.required]"
              item-value="col_value"
              :readonly="status > '00'"
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
              :readonly="status > '00'"
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
            <!-- <n-input-number
              v-model="cycleTimeVModel"
              :rules="[rules.required, validateCycleTime]"
              :readonly="status > '00'"
            >
            </n-input-number> -->

            <n-time-mins
              v-model="cycleTimeVModel"
              :rules="[rules.required, validateCycleTime]"
              :readonly="status > '00'"
              @update:model-value="onCycleTimeChange"
            ></n-time-mins>
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
              :readonly="status > '00'"
            ></v-select>
          </v-col>

          <v-col md="2">
            <label>Leader</label>
            <v-select
              v-model="form.leader"
              :items="userList"
              item-value="col_value"
              :rules="[rules.required]"
              :readonly="status > '00'"
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
            <v-text-field v-model="form.updatedByName" readonly></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Update Date</label>
            <v-text-field v-model="form.updatedDate" readonly></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col>
          <div class="d-flex justify-center">
            <n-btn-save
              @click="onSave"
              :disabled="['30', '90'].includes(status)"
            />
            <n-btn-cancel @click="router.go(-1)" class="ml-3" />
            <n-btn-copy v-if="status !== ''" @click="onCopy" class="ml-3" />
          </div>
        </v-col>
      </v-row>
      <n-loading :loading="isLoading" />

      <v-row>
        <v-col>
          <div v-if="status !== ''">
            <hr class="my-5" />
            <plan-product-data
              v-model="route.params.id"
              :okAmt="form.okAmt"
              :ngAmt="form.ngAmt"
              :planFgAmt="form.planFgAmt"
              :planTotalTime="form.planTotalTime"
              :actualTotalTime="form.actualTotalTime"
              :setupTime="form.setupTime"
              :targetFg="form.targetFg"
              :actualFg="form.actualFg"
            ></plan-product-data>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "@/api/plan.js";
import * as ddlApi from "@/api/dropdown-list.js";
import rules from "@/utils/rules";
import { getDateFormat } from "@/utils/utils";
const Alert = inject("Alert");
const route = useRoute();

const frmInfo = ref(null);
let mode = "NEW";
const planId = ref(null);

const router = useRouter();
const form = ref({
  status: "",
  statusName: "Draft",
});

const isLoading = ref(false);

const userList = ref([]);
const lineList = ref([]);
const shiftList = ref([]);
const shiftPeriodList = ref([]);
const modelList = ref([]);

let workingTimes = [];
let totalWorkingTime = 0;

const cycleTimeVModel = ref(null);

const status = computed(() => {
  return form.value.status;
});

onMounted(async () => {
  console.log("onMounted");

  await doLoadInit();

  if (route.params.id) {
    // Edit mode
    mode = "EDIT";
    planId.value = route.params.id;

    isLoading.value = true;
    api.getPlanById(route.params.id).then((data) => {
      isLoading.value = false;
      form.value = data;

      form.value.planStartTime = getDateFormat(data.planStartTime, "HH:mm:ss");
      form.value.updatedDate = getDateFormat(data.updatedDate);

      const _cycleTime = getDateFormat(data.cycleTime, "HH:mm:ss");
      cycleTimeVModel.value = _cycleTime;

      api.getLineModel(form.value.lineCd).then((data) => {
        modelList.value = data;
        // if (data.length > 0) {
        //   form.value.productCd = data[0].Product_CD;
        //   form.value.partNo = data[0].Part_No;
        //   form.value.partUpper = data[0].Part_Upper;
        //   form.value.partLower = data[0].Part_Lower;
        // }
      });
    });
  } else {
    // New mode
    mode = "NEW";
    form.value.status = "";
  }
});

const doLoadInit = async () => {
  console.log("doLoadInit");

  try {
    userList.value = await ddlApi.user();
    lineList.value = await ddlApi.line_();
    shiftList.value = await ddlApi.shift();
    shiftPeriodList.value = await ddlApi.getPredefine("Shift_Period");
    workingTimes = await api.getWorkingTimeAll();
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
};

const onLineChange = (lineCd) => {
  const line = lineList.value.find((item) => item.lineCd === lineCd);

  const oldPkCd = form.value.pkCd;

  form.value.lineName = line ? line.lineName : "";
  form.value.pkCd = line ? line.pkCd : "";
  modelList.value = [];
  form.value.modelCd = null;
  form.value.productCd = null;
  form.value.partNo = null;
  form.value.partUpper = null;
  form.value.partLower = null;
  cycleTimeVModel.value = null;
  if (oldPkCd !== form.value.pkCd) {
    onUpdateAS400PlanAmt();
  }
  api.getLineModel(lineCd).then((data) => {
    modelList.value = data;
  });
};

const onModelChange = (modelCd) => {
  const model = modelList.value.find((item) => item.Model_CD === modelCd);

  const oldPartNo = form.value.partNo;

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

  if (oldPartNo !== form.value.partNo) {
    onUpdateAS400PlanAmt();
  }

  // convert Cycle_Time to minutes
  const cycleTime = model ? model.Cycle_Time : "";
  // const cycleTimeParts = cycleTime.split(":");
  // const cycleTimeInMinutes =
  //   parseInt(cycleTimeParts[0]) * 60 + parseInt(cycleTimeParts[1]);
  // cycleTimeVModel.value = cycleTimeInMinutes;

  // cycleTimeVModel.value = convertCycleTime(cycleTime);

  if (!cycleTime) {
    cycleTimeVModel.value = "";
    return;
  }

  cycleTimeVModel.value = cycleTime;
};

const convertCycleTime = (cycleTime) => {
  if (!cycleTime) return "";
  const cycleTimeParts = cycleTime.split(":");
  const cycleTimeInMinutes =
    parseInt(cycleTimeParts[0]) * 60 + parseInt(cycleTimeParts[1]);
  return cycleTimeInMinutes;
};

const onCycleTimeChange = (cycleTime) => {
  calculatePlanFgAmt();
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

  calculatePlanFgAmt();
};

const calculatePlanFgAmt = () => {
  if (form.value.planTotalTime && cycleTimeVModel.value) {
    const cycleTimeMins = convertCycleTime(cycleTimeVModel.value);
    form.value.planFgAmt = Math.floor(form.value.planTotalTime / cycleTimeMins);
  } else {
    form.value.planFgAmt = 0;
  }
};

const onshiftChange = (shiftCd) => {
  const shift = shiftList.value.find((item) => item.value == shiftCd);

  console.log("shift", shift);
  form.value.operator = shift ? shift.defaultOperator : "";
  form.value.leader = shift ? shift.defaultLeader : "";
};

const onCopy = () => {
  mode = "NEW";
  form.value.status = "";
  form.value.statusName = "Draft";
};

const onSave = async () => {
  const { valid } = await frmInfo.value.validate();
  if (!valid) return;

  try {
    // convert cycleTime to string format "HH:mm:ss"
    const cycleTime = cycleTimeVModel.value;
    const hours = Math.floor(cycleTime / 60);
    const minutes = cycleTime % 60;
    const cycleTimeString = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:00`;
    form.value.cycleTime = cycleTimeString;
    isLoading.value = true;
    let res = null;
    if (mode === "EDIT") {
      res = await api.updatePlan(route.params.id, form.value);
    } else {
      // New and Copy mode
      res = await api.newPlan(form.value);
    }
    isLoading.value = false;

    if (res.status === 0) {
      await Alert.success();
      router.go(-1);
    } else {
      Alert.error(res.message);
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error saving plan:", error);
  }
};

const onUpdateAS400PlanAmt = () => {
  if (!form.value.pkCd || !form.value.partNo || !form.value.planDate) {
    form.value.as400PlanAmt = null;
    return;
  }

  console.log("onUpdateAS400PlanAmt ");

  api
    .getPlanAmtAS400(form.value.pkCd, form.value.partNo, form.value.planDate)
    .then((data) => {
      form.value.as400PlanAmt = data.planAmt;
    });
};

// Validation for Cycle Time !== 0
const validateCycleTime = (value) => {
  if (value == 0) {
    return "Cycle Time must be greater than 0";
  }
  return true;
};
</script>
