<template>
  <div>
    <h3>Product Data</h3>
    <n-btn-confirm @click="confirmListClick" class="mt-3 mb-2"></n-btn-confirm>

    <v-row>
      <v-col cols="12" md="6">
        <v-data-table
          v-model="selectedProductData"
          item-selectable="selectable"
          :headers="headers"
          :items="items"
          show-select
          item-value="prod_data_id"
          return-object
          select-strategy="page"
        >
          <template
            v-slot:item.data-table-select="{
              internalItem,
              isSelected,
              toggleSelect,
            }"
          >
            <v-checkbox-btn
              :model-value="isSelected(internalItem)"
              color="primary"
              @update:model-value="toggleSelect(internalItem)"
              v-if="
                internalItem.value.Confirmed_Status === '00' &&
                internalItem.value.Status === 'OK'
              "
            ></v-checkbox-btn>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <n-gbtn-edit
              v-if="item.prod_data_id !== null"
              @click="onEditClick(item.prod_data_id)"
            ></n-gbtn-edit>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="6">
        <table
          width="500px"
          style="margin-left: auto; padding: 10px; border-spacing: 10px"
        >
          <tbody>
            <tr>
              <td>Plan Total Time</td>
              <td>
                <v-text-field
                  v-model="props.planTotalTime"
                  readonly
                ></v-text-field>
              </td>
              <td>Actual Total Time</td>
              <td>
                <v-text-field
                  v-model="props.actualTotalTime"
                  readonly
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>Setup Time</td>
              <td>
                <v-text-field v-model="props.setupTime" readonly></v-text-field>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Target FG</td>
              <td>
                <v-text-field v-model="props.targetFg" readonly></v-text-field>
              </td>
              <td>Actual FG</td>
              <td>
                <v-text-field v-model="props.actualFg" readonly></v-text-field>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>OK</td>
              <td>
                <v-text-field v-model="props.okAmt" readonly></v-text-field>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>NG</td>
              <td>
                <v-text-field v-model="props.ngAmt" readonly></v-text-field>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
  </div>

  <v-dialog v-model="dialog" max-width="800px">
    <v-form ref="frmInfo">
      <v-card>
        <v-card-title>
          <span class="headline">Production Date</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <label>Line</label>
                <v-text-field v-model="form.lineCd" readonly></v-text-field>
              </v-col>
              <v-col cols="4">
                <label>Plan Date</label>
                <v-text-field v-model="form.planDate" readonly></v-text-field>
              </v-col>
              <v-col cols="4">
                <label>Plan Start Time</label>
                <v-text-field
                  v-model="form.planStartTime"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <label>Production Date</label>
                <v-text-field
                  v-model="form.productionDate"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <label>Model</label>
                <v-text-field v-model="form.modelCd" readonly></v-text-field>
              </v-col>
              <v-col cols="4">
                <label>FG Status </label>
                <v-select
                  v-model="form.status"
                  :rules="[rules.required]"
                  :items="[...statusList]"
                ></v-select>
              </v-col>
            </v-row>

            <v-row v-if="form.status === 'NG'">
              <v-col>
                <hr class="my-3" />
                <h4>For NG Record</h4>
              </v-col>
            </v-row>

            <v-row v-if="form.status === 'NG'">
              <v-col cols="4">
                <label>Process</label>
                <v-select
                  v-model="form.ngProcess"
                  :items="processList"
                ></v-select>
              </v-col>
              <v-col cols="8">
                <label>Reason</label>
                <v-select
                  v-model="form.ngReason"
                  :items="ngReasonList"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <label>Comment</label>
                <v-text-field v-model="form.ngComment"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>
        <div class="d-flex justify-center py-3">
          <n-btn-save @click="saveClick" class="me-3"></n-btn-save>
          <n-btn-cancel
            text
            @click="dialog = false"
            class="me-3"
          ></n-btn-cancel>
          <n-btn-confirm text @click="confirmClick"></n-btn-confirm>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, inject, watch, defineProps, defineEmits } from "vue";

import * as api from "@/api/plan.js";
import * as ddlApi from "@/api/dropdown-list.js";
import rules from "@/utils/rules";
import { getDateFormat } from "@/utils/utils";
const Alert = inject("Alert");
const frmInfo = ref(null);

// Define props for v-model
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  okAmt: {
    type: Number,
    default: 0,
  },
  ngAmt: {
    type: Number,
    default: 0,
  },
  planTotalTime: {
    type: Number,
    default: 0,
  },
  actualTotalTime: {
    type: Number,
    default: 0,
  },
  setupTime: {
    type: Number,
    default: 0,
  },
  targetFg: {
    type: Number,
    default: 0,
  },
  actualFg: {
    type: Number,
    default: 0,
  },
});

// Emit updates for v-model
const emit = defineEmits(["update:modelValue"]);

// Local state for product data
const productData = ref(props.modelValue);

const form = ref({});

const selectedProductData = ref(null);

const dialog = ref(false);

const statusList = ref([]);
const processList = ref([]);
const ngReasonList = ref([]);

const planTotalTime = ref(0);

const headers = [
  { title: "", key: "action" },
  {
    title: "Datetime",
    key: "dt",
    value: (item) => {
      return getDateFormat(item.dt);
    },
  },
  { title: "FG Status", key: "Status" },
  {
    title: "Confirm Date",
    key: "confirmed_Date",
    value: (item) => {
      return getDateFormat(item.confirmed_Date);
    },
  },
  { title: "Confirm By", key: "Confirmed_by" },
];

const items = ref([]);

// Watch for changes in productData and emit updates
watch(productData, (newValue) => {
  emit("update:modelValue", newValue);
});

onMounted(() => {
  console.log("Product Data component mounted ", props.modelValue);

  ddlApi.getPredefine("FG_Status").then((data) => {
    statusList.value = data;
  });

  ddlApi.getPredefine("NG_Reason").then((data) => {
    ngReasonList.value = data;
  });

  doLoadData();
});

const doLoadData = () => {
  if (props.modelValue === null || props.modelValue === "") {
    return;
  }
  api.getProductData(props.modelValue).then((data) => {
    console.log("Product Data response:", data);

    // selectable: false,
    for (let id = 0; id < data.length; id++) {
      const item = data[id];
      //  internalItem.value.Confirmed_Status === '00' &&
      //         internalItem.value.Status === 'OK'
      if (item.Confirmed_Status === "00" && item.Status === "OK") {
        item.selectable = true;
      } else {
        item.selectable = false;
      }
    }

    items.value = data;
  });
};

const resetForm = () => {
  form.value = {
    lineCd: "",
    planDate: "",
    planStartTime: "",
    productionDate: "",
    modelCd: "",
    status: "",
  };
};

const onEditClick = (id) => {
  console.log("Edit clicked for id:", id);
  resetForm();

  api.getProductDataById(id).then((res) => {
    console.log(res);
    form.value = res;

    form.value.planDate = getDateFormat(res.planDate, "dd/MM/yyyy");
    form.value.planStartTime = getDateFormat(res.planStartTime, "HH:mm");
    form.value.productionDate = getDateFormat(res.productionDate);

    ddlApi.lineMachine(form.value.lineCd, form.value.modelCd).then((data) => {
      processList.value = data;
    });
  });

  dialog.value = true;
};

const saveClick = async () => {
  const { valid } = await frmInfo.value.validate();
  if (!valid) return;
  console.log("Form data to save:", form.value);
  if (form.value.status !== "NG") {
    form.value.ngProcess = null;
    form.value.ngReason = null;
    form.value.ngComment = null;
  }

  form.value.confirmedStatus = "00";

  api
    .updateProductionData(form.value.prodDataId, form.value)
    .then(async (res) => {
      console.log("Save response:", res);

      if (res.status === 0) {
        await Alert.success();
        dialog.value = false;
        doLoadData();
      } else {
        Alert.error(res.message);
      }
    })
    .catch((err) => {
      console.error("Error saving product data:", err);
    });
};

const confirmClick = async () => {
  const { valid } = await frmInfo.value.validate();
  if (!valid) return;

  Alert.confirm("Are you sure you want to confirm?").then(({ isConfirmed }) => {
    if (isConfirmed) {
      console.log("Form data to save:", form.value);
      if (form.value.status !== "NG") {
        form.value.ngProcess = null;
        form.value.ngReason = null;
        form.value.ngComment = null;
      }

      form.value.confirmedStatus = "90";

      api
        .updateProductionData(form.value.prodDataId, form.value)
        .then(async (res) => {
          console.log("Save response:", res);

          if (res.status === 0) {
            await Alert.success();
            dialog.value = false;
            doLoadData();
          } else {
            Alert.error(res.message);
          }
        })
        .catch((err) => {
          console.error("Error saving product data:", err);
        });
    }
  });
};

const confirmListClick = () => {
  if (selectedProductData.value === null) {
    Alert.warning("Please select a record to confirm.");
    return;
  }
  Alert.confirm("Are you sure you want to confirm the selected records?").then(
    ({ isConfirmed }) => {
      if (isConfirmed) {
        // console.log(
        //   "Selected records for confirmation:",
        //   selectedProductData.value
        // );
        // const selectedIds = selectedProductData.value.map(
        //   (item) => item.prod_data_id
        // );
        // console.log("Selected IDs for confirmation:", selectedIds);
        api.confirmList(selectedProductData.value).then((res) => {
          if (res.status === 0) {
            Alert.success("Confirmation successful");
            doLoadData();
          } else {
            Alert.error(res.message);
          }
        });
      }
    }
  );
};
</script>

<style></style>
