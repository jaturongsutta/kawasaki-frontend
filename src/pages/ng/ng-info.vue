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
              <label class="require-field">Process</label>
              <v-select v-model="formInfo.Process_CD" :items="processList" :rules="[rules.required]"></v-select>
            </v-col>
            <v-col cols="3">
              <label class="require-field">NG Date</label>
              <n-date v-model="formInfo.NG_Date" :rules="[rules.required]"></n-date>
            </v-col>
            <v-col cols="3">
              <label class="require-field">NG Time</label>
              <v-text-field placeholder="HH:mm" v-model="formInfo.NG_Time" v-maska="'##:##'" type="text"></v-text-field>
            </v-col>
            <v-col cols="3">
              <label class="require-field">Quantity</label>
              <v-text-field v-model="formInfo.Quantity" v-maska="{
                mask: '#',
                tokens: {
                  '#': { pattern: /[0-9]/, repeated: true },
                },
              }" type="text" :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="3">
              <label class="require-field">Reason</label>
              <v-select v-model="formInfo.Reason_CD" :items="reasonList" item-value="predefine_cd" item-title="Value_EN"
                :rules="[rules.required]"></v-select>
            </v-col>
            <v-col cols="9">
              <label class="require-field">Comment</label>
              <v-text-field v-model="formInfo.Comment" :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="6" v-if="pageMode === 'edit'">
              <label class="require-field">Status</label>
              <v-select v-model="formInfo.isActive" :items="[{ title: 'All', value: null }, ...statusList]"
                :rules="[rules.required]"></v-select>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
              <label>Updated By</label>
              <v-text-field v-model="formInfo.updatedBy" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
              <label>Updated Date</label>
              <v-text-field v-model="formInfo.updatedDate" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mt-8 mb-6"></v-divider>
          <v-row>
            <v-col>
              <div class="d-flex justify-center mb-3">
                <n-btn-save no-permission @click="saveClick('save')" class="me-3"></n-btn-save>
                <n-btn-cancel @click="router.go(-1)" class="me-3" />
                <n-btn-save no-permission @click="saveClick('confirmed')"></n-btn-save>
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
const statusList = ref([]);
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
  "status": "",
  "status_name": "",
  "updated_by": "",
  "updated_date": "",
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
    // loadData();
  }
  else {
    const v = localStorage.getItem("ng-new");
    if (v) {
      const d = JSON.parse(v);
      formInfo.value = d;
      formInfo.value.Plan_Date = getDateFormat(formInfo.value.Plan_Date, "dd/MM/yyyy");
      formInfo.value.Plan_Start_Time = getDateFormat(formInfo.value.Plan_Start_Time, "HH:mm");
      console.log('item is ', d);
      // localStorage.setItem("ng-new", '');

      formInfo.value.Model_CD = 'EN650'
      ddlApi.lineMachine(formInfo.value.Line_CD, formInfo.value.Model_CD).then((data) => {
        processList.value = data;
      });
    }

    formInfo.value.NG_Date = getCurrrentDate();
    formInfo.value.NG_Time = DateTime.now().setZone('Asia/Bangkok').toFormat("HH:mm")
  }

});

const onSearch = async () => {
  console.log("search ")
  // loadData();
};

const loadData = async () => {
  try {
    isLoading.value = true;
    let id = pageMode.value === 'edit' ? route.params.id : formInfo.value.machineNo;
    const response = await api.getById(id);

    if (response.status === 2) {
      Alert.error("Error ", response.message);
      return;
    }
    formInfo.value = response.data;
    formInfo.value.Plan_Date = getDateFormat(formInfo.value.Plan_Date, "dd/MM/yyyy");
    formInfo.value.Plan_Start_Time = getDateFormat(formInfo.value.Plan_Start_Time, "HH:mm:ss");

  } catch (error) {
    console.error("Error fetching API:", error);
    formInfo.value = {}
  }
  isLoading.value = false;
};

const saveClick = async (mode) => {
  try {
    const { valid } = await frmInfo.value.validate();
    console.log('value is ', formInfo.value)
    if (!valid) return;

    isLoading.value = true;
    let res = null;

    const v = { ...formInfo.value };
    const info = {
      planId: `${v.id}`,
      lineCd: v.Line_CD,
      processCd: v.Process_CD,
      ngDate: v.NG_Date,
      ngTime: `${v.NG_Time}:00`,
      quantity: Number(v.Quantity),
      reason: v.Reason_CD,
      comment: v.Comment,
      idRef: '-',
      status: mode === 'save' ? '00' : '90'
    }

    if (pageMode.value === "add") {
      console.log("Add");
      res = await api.add(info);
    } else {
      console.log("Edit");
      res = await api.update(route.params.id, info);
    }
    isLoading.value = false;
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