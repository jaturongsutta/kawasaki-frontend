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
              ></v-text-field>
            </v-col>
            <v-col>
              <label>Line Code</label>
              <v-text-field
                v-model="form.lineCd"
                :rules="[rules.required]"
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
              >
                <template v-slot:[`item.action`]="{ item }">
                  <n-gbtn-delete @click="onDeleteModel(item)"></n-gbtn-delete>
                </template>

                <template v-slot:[`item.modelCd`]="{ item }">
                  <v-select
                    v-if="item.mode === 'NEW'"
                    v-model="item.modelSelect"
                    :items="[...modelList]"
                    item-title="value"
                    item-value="value"
                    return-object
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
                :headers="headersProcess"
                :items="itemsProcess"
                :items-per-page="-1"
                hide-default-footer
              >
                <template v-slot:[`item.processCd`]="{ item }">
                  <v-select
                    v-model="item.processCd"
                    :items="[...machineList]"
                    item-title="value"
                    item-value="value"
                  ></v-select>
                </template>
                <template v-slot:[`item.wt`]="{ item }">
                  <n-time v-model="item.wt"></n-time>
                </template>
                <template v-slot:[`item.ht`]="{ item }">
                  <n-time v-model="item.ht"></n-time>
                </template>
                <template v-slot:[`item.mt`]="{ item }">
                  <n-time v-model="item.mt"></n-time>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="4">
              <v-data-table
                :headers="headersLineTool"
                :items="itemsLineTool"
                item-key="external_id"
                :items-per-page="-1"
                style="width: 300px"
                hide-default-footer
              >
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
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/line.js";
import rules from "@/utils/rules";
const route = useRoute();

const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const form = ref({});

const isLoadingProcess = ref(false);
const statusList = ref([]);
const modelList = ref([]);
const machineList = ref([]);
const itemsModel = ref([]);
const itemsProcess = ref([]);
const itemsLineTool = ref([]);
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
  { title: "Model Code", key: "Model_Code", sortable: false },
  { title: "Active", key: "Is_Active", sortable: false },
]);

let selectedModel = "";

let currentLineCd = "";
let currentModelCd = "";

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

  if (route.params.id) {
    console.log("edit mode ", route.params.id);

    api.getById(route.params.id).then((data) => {
      form.value = data;

      console.log("data.lineModel ", data.lineModel);
      itemsModel.value = data.lineModel.map((item) => {
        return {
          mode: "NONE",
          modelCd: item.modelCd,
          partNo: item.partNo,
          isActive: item.isActive,
        };
      });

      console.log("itemsModel.value ", itemsModel.value);
    });
  }
});

const onAddModel = () => {
  itemsModel.value.push({
    mode: "NEW",
    Model_Code: "",
    Is_Active: "Y",
  });
};

const onAddProcess = () => {
  if (selectedModel === "") {
    Alert.warning("Please select model first.");
    return;
  }
  itemsProcess.value.push({
    rowState: "NEW",
    seq: "",
    lineCd: form.value.lineCd,
    modelCd: selectedModel,
    process: "",
    wt: "",
    ht: "",
    mt: "",
  });
};

const onSave = async () => {
  const payload = {
    pkCd: form.value.pkCd,
    lineCd: form.value.lineCd,
    lineName: form.value.lineName,
    isActive: form.value.isActive,
    lineModel: itemsModel.value,
    lineMachine: itemsProcess.value,
    lineTool: itemsLineTool.value,

    // models: itemsModel.value,
    // processes: itemsProcess.value,
  };
  const { valid } = await frmInfo.value.validate();
  let res;
  if (valid) {
    if (route.params.id) {
      // Edit Mode
      res = await api.update(route.params.id, payload);
    } else {
      // Add Mode
      res = await api.add(payload);
    }

    if (res.result.status === 0) {
      Alert.success("Line information saved successfully.");
      router.go(-1);
    } else {
      Alert.error("Failed to save line information.");
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
    selectedModel = selected[0];
    isLoadingProcess.value = true;

    api.getProcessByModelCd(selected[0]).then((data) => {
      isLoadingProcess.value = false;

      console.log("data ", data);
      itemsProcess.value = data.map((item) => {
        return {
          seq: item.seq,
          lineCd: item.lineCd,
          modelCd: item.modelCd,
          processCd: item.processCd,
          wt: item.wt,
          ht: item.ht,
          mt: item.mt,
        };
      });
    });
  } else {
    selectedModel = "";
  }
};
</script>

<style></style>
