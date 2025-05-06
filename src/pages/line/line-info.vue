<template>
  <div>
    <v-form ref="frmInfo">
      <v-card>
        <v-card-title>
          <h4>Master - Line Information</h4>
        </v-card-title>

        <v-card-text class="mb-3">
          <v-row>
            <v-col>
              <label>PK Code</label>
              <v-text-field
                v-model="form.pkCd"
                :rules="[rules.required]"
                :readonly="mode === 'EDIT'"
              ></v-text-field>
            </v-col>
            <v-col>
              <label>Line Code</label>
              <v-text-field
                v-model="form.lineCd"
                :rules="[rules.required]"
                :readonly="mode === 'EDIT'"
              ></v-text-field>
            </v-col>
            <v-col>
              <label>Line Name</label>
              <v-text-field
                v-model="form.lineName"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col>
              <label>Status</label>
              <v-select
                v-model="form.isActive"
                :items="[...statusList]"
                :rules="[rules.required]"
              ></v-select>
            </v-col>

            <v-col>
              <label>Updated By</label>
              <v-text-field v-model="form.updatedBy" readonly></v-text-field>
            </v-col>

            <v-col>
              <label>Updated Date</label>
              <v-text-field v-model="form.updatedDate" readonly></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <hr />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <n-btn-add
                label="New Model"
                @click="onAddModel"
                class="mt-3"
              ></n-btn-add>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-data-table
                :headers="headersModel"
                :items="itemsModel"
                item-key="modelCd"
                :items-per-page="-1"
                hide-default-footer
                select-strategy="single"
                item-value="modelCd"
                show-select
                @update:modelValue="tableModelSelected"
                return-object
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
                    v-if="internalItem.value.rowState !== 'NEW'"
                  ></v-checkbox-btn>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <n-gbtn-delete @click="onDeleteModel(item)"></n-gbtn-delete>
                </template>

                <template v-slot:[`item.modelCd`]="{ item }">
                  <v-select
                    v-if="item.rowState === 'NEW'"
                    v-model="item.modelSelect"
                    :items="[...modelList]"
                    item-title="value"
                    item-value="value"
                    return-object
                    hide-details="auto"
                    @update:model-value="
                      (o) => {
                        onSelectedModel(o, item);
                      }
                    "
                  ></v-select>
                  <div v-else v-text="item.modelCd"></div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <n-btn-add
                label="New Process"
                @click="onAddProcess"
                class="mt-3"
              ></n-btn-add>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="8">
              <n-loading :loading="isLoadingProcess" />
              <v-data-table
                v-model="isSelectedProcess"
                :headers="headersProcess"
                :items="itemsProcess"
                :items-per-page="-1"
                hide-default-footer
                select-strategy="single"
                item-value="modelCd"
                show-select
                return-object
                @update:modelValue="tableProcessSelected"
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
                    v-if="internalItem.value.rowState !== 'NEW'"
                  ></v-checkbox-btn>
                </template>
                <template v-slot:[`item.processCd`]="{ item }">
                  <v-select
                    v-if="item.rowState === 'NEW'"
                    v-model="item.processCd"
                    :items="[...machineList]"
                    item-title="value"
                    item-value="value"
                    hide-details="auto"
                  ></v-select>
                  <div v-else v-text="item.processCd"></div>
                </template>
                <template v-slot:[`item.wt`]="{ item }">
                  <n-time
                    v-model="item.wt"
                    hide-details="auto"
                    @update:model-value="
                      (o) => {
                        if (item.rowState === 'NONE') {
                          item.rowState = 'UPDATE';
                        }
                      }
                    "
                  ></n-time>
                </template>
                <template v-slot:[`item.ht`]="{ item }">
                  <n-time v-model="item.ht" hide-details="auto"></n-time>
                </template>
                <template v-slot:[`item.mt`]="{ item }">
                  <n-time v-model="item.mt" hide-details="auto"></n-time>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="4">
              <v-data-table
                :headers="headersLineTool"
                :items="itemsLineTool"
                :items-per-page="-1"
                style="width: 300px"
                hide-default-footer
              >
                <template v-slot:[`item.isActive`]="{ item }">
                  <v-checkbox
                    v-model="item.isActive"
                    value="Y"
                    hide-details
                    @update:model-value="
                      (o) => {
                        item.rowState = 'UPDATE';
                      }
                    "
                  ></v-checkbox>
                </template>
              </v-data-table>
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
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/line.js";
import rules from "@/utils/rules";
const route = useRoute();

const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const form = ref({});
const mode = ref("NEW");

let mToolAll = [];

const isLoadingProcess = ref(false);
const statusList = ref([]);
const modelList = ref([]);
const machineList = ref([]);
const itemsModel = ref([]);
const isSelectedProcess = ref([]);
const itemsProcess = ref([]);
let itemsProcessAll = [];
const itemsLineTool = ref([]);

let itemsLineToolAll = [];
const headersModel = ref([
  { title: "", key: "action", sortable: false },
  { title: "Model Code", key: "modelCd", sortable: false },
  { title: "Part No", key: "partNo", sortable: false },
  { title: "Active", key: "isActive", sortable: false },
]);
const headersProcess = ref([
  {
    title: "",
    key: "action",
    sortable: false,
  },
  {
    title: "Seq",
    key: "seq",
    sortable: false,
  },
  { title: "Process", key: "processCd", sortable: false },
  { title: "W.T.(mins)", key: "wt", sortable: false },
  { title: "H.T.(mins)", key: "ht", sortable: false },
  { title: "M.T.(mins)", key: "mt", sortable: false },
]);
const headersLineTool = ref([
  { title: "Tool No", key: "toolCd", sortable: false },
  { title: "Active", key: "isActive", sortable: false },
]);

let currentModelCd = "";
let currentProcessCd = "";

onMounted(() => {
  ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
    statusList.value = data;
  });

  ddlApi.model_().then((data) => {
    modelList.value = data;
  });
  ddlApi.machine().then((data) => {
    machineList.value = data;
  });

  api.getToolAll().then((data) => {
    mToolAll = data;
  });

  if (route.params.id) {
    console.log("edit mode ", route.params.id);
    mode.value = "EDIT";

    api.getById(route.params.id).then((data) => {
      form.value = data;

      form.value.wt = "50:55:55";

      console.log("data.lineModel ", data.lineModel);
      itemsModel.value = data.lineModel.map((item) => {
        return {
          mode: "NONE",
          modelCd: item.modelCd,
          partNo: item.partNo,
          isActive: item.isActive,
        };
      });

      itemsProcessAll = data.lineMachine.map((item) => {
        return {
          rowState: "NONE",
          seq: item.seq,
          lineCd: item.lineCd,
          modelCd: item.modelCd,
          processCd: item.processCd,
          wt: item.wt,
          ht: item.ht,
          mt: item.mt,
          isActive: item.isActive,
        };
      });

      itemsLineToolAll = data.lineTool.map((item) => {
        return {
          rowState: "NONE",
          lineCd: item.lineCd,
          modelCd: item.modelCd,
          processCd: item.processCd,
          toolCd: item.toolCd,
          isActive: item.isActive,
        };
      });

      console.log("itemsModel.value ", itemsModel.value);
    });
  }
});

const onAddModel = () => {
  itemsModel.value.push({
    rowState: "NEW",
    Model_Code: "",
    Is_Active: "Y",
  });
};

const onAddProcess = () => {
  if (currentModelCd === "") {
    Alert.warning("Please select model first.");
    return;
  }
  itemsProcessAll.push({
    rowState: "NEW",
    seq: "",
    lineCd: form.value.lineCd,
    modelCd: currentModelCd,
    process: "",
    wt: "",
    ht: "",
    mt: "",
    isActive: "Y",
  });

  itemsProcess.value = itemsProcessAll.filter(
    (item) => item.modelCd === currentModelCd
  );
};

const onSave = async () => {
  const payload = {
    ...form.value,

    lineModel: itemsModel.value,
    lineMachine: itemsProcessAll,
    lineTool: itemsLineToolAll,

    // models: itemsModel.value,
    // processes: itemsProcess.value,
  };
  const { valid } = await frmInfo.value.validate();
  let res;
  if (valid) {
    console.log("payload ", payload);
    if (route.params.id) {
      // Edit Mode
      res = await api.update(route.params.id, payload);
    } else {
      // Add Mode
      res = await api.add(payload);
    }

    if (res.status === 0) {
      Alert.success();
      // router.go(-1);
    } else {
      Alert.warning(res.message);
    }
  }
};

const onSelectedModel = (o, item) => {
  console.log(o);
  item.modelCd = o.value;
  item.partNo = o.partNo;
  item.isActive = o.isActive;
};

const onDeleteModel = (r) => {
  if (r.mode === "NEW") {
    itemsModel.value = itemsModel.value.filter(
      (item) => item.modelCd !== r.modelCd
    );
  } else {
    itemsModel.value = itemsModel.value.map((item) => {
      if (item.modelCd === r.modelCd) {
        item.mode = "DELETE";
        return item;
      }
    });
  }
};

const tableModelSelected = (selected) => {
  console.log("selected ", selected);
  if (selected.length > 0) {
    currentModelCd = selected[0].modelCd;
    // isLoadingProcess.value = true;

    itemsProcess.value = itemsProcessAll.filter(
      (item) => item.modelCd === currentModelCd
    );

    // api.getProcessByModelCd(form.value.lineCd, currentModelCd).then((data) => {
    //   isLoadingProcess.value = false;

    //   console.log("data ", data);
    //   let i = 0;
    //   itemsProcess.value = data.map((item) => {
    //     return {
    //       rowState: "UPDATE",
    //       seq: ++i,
    //       lineCd: item.lineCd,
    //       modelCd: item.modelCd,
    //       processCd: item.processCd,
    //       wt: item.wt,
    //       ht: item.ht,
    //       mt: item.mt,
    //       isActive: item.isActive,
    //     };
    //   });
    // });
  } else {
    currentModelCd = "";
    itemsProcess.value = [];
  }
};

const tableProcessSelected = (selected) => {
  if (selected.length > 0) {
    console.log("selected ", selected);

    currentModelCd = selected[0].modelCd;
    currentProcessCd = selected[0].processCd;

    itemsLineTool.value = itemsLineToolAll.filter(
      (item) =>
        item.modelCd === currentModelCd && item.processCd === currentProcessCd
    );
    console.log("itemsLineToolAll ", itemsLineToolAll);
    console.log("itemsLineTool.value ", itemsLineTool.value);

    if (itemsLineTool.value.length === 0) {
      console.log("new line tool");
      const mTool = mToolAll.filter(
        (item) => item.processCd === currentProcessCd
      );

      const lineTool = mTool.map((item) => {
        return {
          rowState: "NEW",
          lineCd: form.value.lineCd,
          modelCd: currentModelCd,
          processCd: currentProcessCd,
          toolCd: item.toolCd,
          isActive: "N",
        };
      });

      for (let i = 0; i < lineTool.length; i++) {
        itemsLineToolAll.push({
          ...lineTool[i],
        });
      }

      console.log("itemsLineToolAll ", itemsLineToolAll);
      itemsLineTool.value = itemsLineToolAll.filter(
        (item) =>
          item.modelCd === currentModelCd && item.processCd === currentProcessCd
      );
    } else {
      console.log("tool already exists");
      itemsLineTool.value = itemsLineToolAll.filter(
        (item) =>
          item.modelCd === currentModelCd && item.processCd === currentProcessCd
      );
    }
  } else {
    itemsLineTool.value = [];
    console.log("unselected");
    currentProcessCd = "";
  }
};

// const selectedProcess = (selected, item) => {
//   console.log("selected ", selected);

//   const processCd = selected;

//   // Check if the selected process already exists in itemsProcess
//   const existingProcess = itemsProcess.value.filter(
//     (process) =>
//       process.processCd === processCd && process.modelCd === item.modelCd
//   );
//   console.log("existingProcess ", existingProcess);
//   if (existingProcess.length > 1) {
//     Alert.warning("This process already exists in the list.");
//     item.processCd = "";
//     return;
//   }

//   isSelectedProcess.value = [{ ...item }];

//   console.log("item ", item);

//   console.log("isSelectedProcess ", isSelectedProcess.value);
// };
</script>

<style scoped></style>
