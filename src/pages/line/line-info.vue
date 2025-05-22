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
              <label class="require-field">PK Code</label>
              <v-text-field
                v-model="form.pkCd"
                :rules="[rules.required]"
                :readonly="mode === 'EDIT'"
              ></v-text-field>
            </v-col>
            <v-col>
              <label class="require-field">Line Code</label>
              <v-text-field
                v-model="form.lineCd"
                :rules="[rules.required]"
                :readonly="mode === 'EDIT'"
              ></v-text-field>
            </v-col>
            <v-col>
              <label class="require-field">Line Name</label>
              <v-text-field
                v-model="form.lineName"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col>
              <label class="require-field">Status</label>
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
                  <!-- <n-gbtn-delete
                    @click="onDeleteModel(item)"
                    v-if="item.isActive === 'Y'"
                  ></n-gbtn-delete> -->
                  <n-gbtn-edit
                    @click="
                      () => {
                        item.rowState = 'UPDATE';
                      }
                    "
                    v-if="item.rowState === 'NONE'"
                  ></n-gbtn-edit>
                  <!-- {{ item.rowState }} -->
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

                <template v-slot:[`item.isActive`]="{ item }">
                  <v-select
                    v-if="item.rowState === 'UPDATE'"
                    v-model="item.isActive"
                    :items="[...statusList]"
                    hide-details="auto"
                  ></v-select>
                  <div v-else v-text="item.statusName"></div>
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
                    :rules="[rules.required]"
                  ></v-select>
                  <div v-else v-text="item.processCd"></div>
                </template>
                <template v-slot:[`item.wt`]="{ item }">
                  <n-time-mins
                    v-model="item.wt"
                    hide-details="auto"
                    @update:model-value="
                      (o) => {
                        if (item.rowState === 'NONE') {
                          item.rowState = 'UPDATE';
                        }
                      }
                    "
                    :rules="[rules.required]"
                  ></n-time-mins>
                </template>
                <template v-slot:[`item.ht`]="{ item }">
                  <n-time-mins
                    v-model="item.ht"
                    hide-details="auto"
                    @update:model-value="
                      (o) => {
                        if (item.rowState === 'NONE') {
                          item.rowState = 'UPDATE';
                        }
                      }
                    "
                    :rules="[rules.required]"
                  ></n-time-mins>
                </template>
                <template v-slot:[`item.mt`]="{ item }">
                  <n-time-mins
                    v-model="item.mt"
                    hide-details="auto"
                    @update:model-value="
                      (o) => {
                        if (item.rowState === 'NONE') {
                          item.rowState = 'UPDATE';
                        }
                      }
                    "
                    :rules="[rules.required]"
                  ></n-time-mins>
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
                :sort-by="[{ key: 'toolCd', order: 'asc' }]"
              >
                <template v-slot:[`item.isActive`]="{ item }">
                  <v-checkbox
                    v-model="item.isActive"
                    value="Y"
                    hide-details
                    @update:model-value="
                      (o) => {
                        if (item.rowState === 'NONE') {
                          item.rowState = 'UPDATE';
                        }
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

        <n-loading :loading="isLoading" />
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
import { getDateFormat } from "@/utils/utils";

const route = useRoute();

const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const form = ref({});
const mode = ref("NEW");

let mToolAll = [];

const isLoading = ref(false);

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
    doLoadData();
  }
});

const doLoadData = async () => {
  mode.value = "EDIT";

  isLoading.value = true;
  api.getById(route.params.id).then((data) => {
    isLoading.value = false;
    form.value = data;

    form.value.updatedDate = getDateFormat(data.updatedDate);

    // form.value.wt = "50:55:55";

    console.log("data.lineModel ", data.lineModel);
    itemsModel.value = data.lineModel.map((item) => {
      return {
        rowState: "NONE",
        modelCd: item.modelCd,
        partNo: item.partNo,
        isActive: item.isActive,
        statusName: item.statusName,
      };
    });

    itemsProcessAll = data.lineMachine.map((item) => {
      return {
        rowState: "NONE",
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
};

const onAddModel = () => {
  itemsModel.value.push({
    rowState: "NEW",
    Model_Code: "",
    Is_Active: "Y",
    statusName: "Active",
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
  itemsLineToolAll.forEach((item) => {
    item.isActive = item.isActive === "Y" ? "Y" : "N";
  });
  const payload = {
    ...form.value,

    lineModel: itemsModel.value,
    lineMachine: itemsProcessAll,
    lineTool: itemsLineToolAll,
  };
  const { valid } = await frmInfo.value.validate();
  let res;
  if (valid) {
    if (!validateModel()) {
      return;
    }
    if (!validateProcess()) {
      return;
    }
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
      // doLoadData();
      router.go(-1);
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
  if (r.rowState === "NEW") {
    itemsModel.value = itemsModel.value.filter(
      (item) => item.modelCd !== r.modelCd
    );
  } else {
    Alert.confirm("Are you sure you want to delete this model ?").then(
      ({ isConfirmed }) => {
        if (isConfirmed) {
          isLoadingProcess.value = true;
          api.deleteModel(form.value.lineCd, r.modelCd).then((res) => {
            isLoadingProcess.value = false;
            if (res.status === 0) {
              Alert.success("Inactive successfully");
              doLoadData();
            } else {
              Alert.warning(res.message);
            }
          });
        }
      }
    );
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

    // set seq
    let i = 0;
    for (let item of itemsProcess.value) {
      item.seq = ++i;
    }
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

    // case no tool
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
      // case already exist
      console.log("tool already exists");
      itemsLineTool.value = itemsLineToolAll.filter(
        (item) =>
          item.modelCd === currentModelCd && item.processCd === currentProcessCd
      );
    }

    // check m_tool by processCd length !== itemsLineTool.value.length , and add tool is missing in array
    // check m_tool length !== itemsLineTool.value.length
    const mTool = mToolAll.filter(
      (item) => item.processCd === currentProcessCd
    );

    console.log("mTool ", mTool);
    console.log("mTool length ", mTool.length);
    console.log("itemsLineTool.value length ", itemsLineTool.value.length);
    if (mTool.length !== itemsLineTool.value.length) {
      console.log("new line tool");

      const missingTools = mTool.filter(
        (tool) =>
          !itemsLineTool.value.some(
            (item) =>
              item.processCd === tool.processCd && item.toolCd === tool.toolCd
          )
      );

      console.log("missingTools", missingTools);
      const lineTool = missingTools.map((item) => {
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
    }
    console.log("itemsLineTool.value ", itemsLineTool.value);
    console.log("itemsLineToolAll ", itemsLineToolAll);

    // end check m_tool length !== itemsLineTool.value.length
  } else {
    itemsLineTool.value = [];
    console.log("unselected");
    currentProcessCd = "";
  }
};

// validate on save check duplicate model
const validateModel = () => {
  const modelCodes = itemsModel.value.map((item) => item.modelCd);
  const uniqueModelCodes = new Set(modelCodes);

  if (uniqueModelCodes.size !== modelCodes.length) {
    Alert.warning("Duplicate model codes found.");
    return false;
  }
  return true;
};

// validate on save check duplicate process by modelCd and processCd
const validateProcess = () => {
  //check processCd not null
  for (const item of itemsProcessAll) {
    if (!item.processCd) {
      Alert.warning("Please select process code.");
      return false;
    }
  }

  const pairs = itemsProcessAll.map(
    (item) => `${item.modelCd}__${item.processCd}`
  );
  const uniquePairs = new Set(pairs);

  if (uniquePairs.size !== pairs.length) {
    Alert.warning("Duplicate process codes found (same model and process).");
    return false;
  }

  // check wt, ht, mt not null
  for (const item of itemsProcessAll) {
    if (!item.wt || !item.ht || !item.mt) {
      Alert.warning("Please fill in all time fields (W.T., H.T., M.T.).");
      return false;
    }
  }
  return true;
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

<style scoped>
.btn-blue {
  background-color: #007bff;
  color: white;
}
.btn-gray {
  background-color: #6c757d;
  color: white;
}
</style>
