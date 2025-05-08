<template>
  <v-card class="ma-5">
    <v-card-title>
      <h5>Planning Information</h5>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col md="2">
          <label>Line</label>
          <v-select
            v-model="form.lineCd"
            :items="lineList"
            @update:model-value="onLineChange"
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
          <n-date v-model="form.planDate"> </n-date>
        </v-col>
        <v-col md="2">
          <label>Plan Start Time</label>
          <n-time v-model="form.planStartTime"></n-time>
        </v-col>

        <v-col md="2">
          <label>Plan Amt(AS400)</label>
          <v-text-field v-model="form.planAmtAS400" readonly></v-text-field>
        </v-col>

        <v-col md="2">
          <label>Shift</label>
          <v-select v-model="form.shiftTeam"></v-select>
        </v-col>

        <v-col md="2">
          <label>Shift Period</label>
          <v-select v-model="form.shiftPeriod"></v-select>
        </v-col>

        <v-col md="1">
          <v-checkbox v-model="form.b1" label="Break 1"></v-checkbox>
        </v-col>
        <v-col md="1">
          <v-checkbox v-model="form.b2" label="Lunch Break"></v-checkbox>
        </v-col>
        <v-col md="1">
          <v-checkbox v-model="form.b3" label="Break 2"></v-checkbox>
        </v-col>
        <v-col md="1">
          <v-checkbox v-model="form.b4" label="Break OT"></v-checkbox>
        </v-col>
        <v-col md="2">
          <v-checkbox v-model="form.ot" label="OT"></v-checkbox>
        </v-col>

        <v-col md="2">
          <label>Total Time(mins)</label>
          <v-text-field v-model="form.planTotalTime" readonly></v-text-field>
        </v-col>

        <v-col md="2">
          <label>Model</label>
          <v-select v-model="form.modelCd"></v-select>
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
          <v-text-field v-model="form.cycleTime"></v-text-field>
        </v-col>

        <v-col md="1">
          <label>Target FG Amt</label>
          <v-text-field v-model="form.planFgAmt" readonly></v-text-field>
        </v-col>

        <v-col md="2">
          <label>Operator</label>
          <v-select v-model="form.operator"></v-select>
        </v-col>

        <v-col md="2">
          <label>Leader</label>
          <v-select v-model="form.leader"></v-select>
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
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "@/api/common-master/user.js";
import * as ddlApi from "@/api/dropdown-list.js";
const Alert = inject("Alert");
const route = useRoute();

const router = useRouter();
const form = ref({});

const lineList = ref([]);

onMounted(() => {
  ddlApi.line_().then((data) => {
    lineList.value = data;
  });
});

const onLineChange = (lineCd) => {
  const line = lineList.value.find((item) => item.lineCd === lineCd);

  form.value.lineName = line ? line.lineName : "";
  form.value.pkCd = line ? line.pkCd : "";
};
</script>
