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
              <v-text-field v-model="formInfo.Line_CD" readonly :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Plan Date</label>
              <v-text-field v-model="formInfo.Plan_Date" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Plan Start Time</label>
              <v-text-field v-model="formInfo.Plan_Start_Time" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Shift</label>
              <v-text-field v-model="formInfo.Team_Name" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Shift Period</label>
              <v-text-field v-model="formInfo.Shift_Period_Name" readonly></v-text-field>
            </v-col>
            <v-col cols="9">
              <v-row class="pt-5">
                <v-col cols="2">
                  <v-checkbox :model-value="formInfo.B1 === 'Y'" label="Break 1" color="success" readonly></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox :model-value="formInfo.B2 === 'Y'" label="Lunch Break" color="success"
                    readonly></v-checkbox>
                </v-col>
                <v-col cols="2">
                  <v-checkbox :model-value="formInfo.B3 === 'Y'" label="Break 2" color="success" readonly></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox :model-value="formInfo.B4 === 'Y'" label="Break OT" color="success" readonly></v-checkbox>
                </v-col>
                <v-col cols="2">
                  <v-checkbox :model-value="formInfo.OT === 'Y'" label="OT" color="success" readonly></v-checkbox>
                </v-col>
              </v-row>
            </v-col>

            <v-col md="3">
              <label>Model</label>
              <v-text-field v-model="formInfo.Model_CD" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Part No</label>
              <v-text-field v-model="formInfo.part_no" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Part Upper</label>
              <v-text-field v-model="formInfo.Part_Upper" readonly></v-text-field>
            </v-col>
            <v-col md="3">
              <label>Part Lower</label>
              <v-text-field v-model="formInfo.Part_Lower" readonly></v-text-field>
            </v-col>

            <v-col cols="3">
              <label>Process</label>
              <v-select v-model="formInfo.Process_CD" :items="processList" placeholder="No Process Selected"
                :readonly="formInfo.Status === '90'"></v-select>
            </v-col>
            <v-col cols="3">
              <label class="require-field">NG Date</label>
              <n-date v-model="formInfo.NG_Date" :rules="[rules.required]"
                :readonly="formInfo.Status === '90'"></n-date>
            </v-col>
            <v-col cols="3">
              <label class="require-field">NG Time</label>
              <n-time v-model="formInfo.NG_Time" :rules="[rules.required]" :readonly="formInfo.Status === '90'" />
            </v-col>
            <v-col cols="3">
              <label class="require-field">Quantity</label>
              <n-input-number v-model="formInfo.Quantity"
                :rules="[rules.required, v => /^\d{1,3}$/.test(v) || 'Only 3 digits allowed']"
                :readonly="formInfo.Status === '90'" v-maska="'###'" />
            </v-col>

            <v-col cols="3">
              <label class="require-field">Reason</label>
              <v-select v-model="formInfo.Reason_CD" :items="reasonList" item-value="predefine_cd" item-title="Value_EN"
                :rules="[rules.required]" :readonly="formInfo.Status === '90'"></v-select>
            </v-col>
            <v-col cols="9">
              <label>Comment</label>
              <v-text-field v-model="formInfo.Comment" :readonly="formInfo.Status === '90'"></v-text-field>
            </v-col>

            <v-col cols="6" v-if="pageMode === 'edit'">
              <label>Status</label>
              <v-text-field v-model="formInfo.status_name" readonly></v-text-field>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
              <label>Updated By</label>
              <v-text-field v-model="formInfo.Updated_By" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
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
import * as api from "@/api/ng.js";
import rules from "@/utils/rules";
import { getCurrrentDate, getDateFormat } from "@/utils/utils";
import { DateTime } from 'luxon'

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
  "NG_Time": "",
  "NG_Date": "",
  "Quantity": "",
  "Reason_CD": "",
  "Comment": ""
});

let isLoading = ref(false);
let isDialogLoading = ref(false);
let pageMode = ref("add");

onMounted(() => {
  ddlApi.getPredefine("NG_Reason").then((data) => {
    reasonList.value = data;
  });

  if (route.params.id) {
    console.log("edit ")
    pageMode.value = "edit";
    loadData();
  }
  else {
    console.log("add ")
    const v = localStorage.getItem("ng-new");
    if (v) {
      const d = JSON.parse(v);
      formInfo.value = d;
      formInfo.value.Plan_Date = getDateFormat(formInfo.value.Plan_Date, "dd/MM/yyyy");
      formInfo.value.Plan_Start_Time = getDateFormat(formInfo.value.Plan_Start_Time, "HH:mm");
      getProcessList();
    }

    formInfo.value.NG_Date = getCurrrentDate();
    formInfo.value.NG_Time = DateTime.now().setZone('Asia/Bangkok').toFormat("HH:mm")
    formInfo.value.Quantity = 1;
  }

});

const getProcessList = () => {
  ddlApi.lineMachine(formInfo.value.Line_CD, formInfo.value.Model_CD).then((data) => {
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
    formInfo.value.Plan_Date = getDateFormat(formInfo.value.Plan_Date, "dd/MM/yyyy");
    formInfo.value.Plan_Start_Time = getDateFormat(formInfo.value.Plan_Start_Time, "HH:mm");
    formInfo.value.NG_Date = getDateFormat(formInfo.value.NG_Date, "yyyy-MM-dd");
    formInfo.value.NG_Time = getDateFormat(formInfo.value.NG_Time, "HH:mm");
    formInfo.value.Updated_Date = getDateFormat(formInfo.value.Updated_Date);
    getProcessList();
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
      planId: v.Plan_ID,
      processCd: v.Process_CD,
      lineCd: v.Line_CD,
      modelCd: v.Model_CD,
      ngDate: v.NG_Date,
      ngTime: `${v.NG_Time}:00`,
      quantity: Number(v.Quantity),
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
        idRef: null
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