<template>
  <div>
    <v-form ref="frmInfo">
      <v-card>
        <v-card-title>
          <h4>{{ pageMode === "add" ? "Add" : "Edit" }} Master - Machine Information</h4>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="4">
              <label class="require-field">Machine No</label>
              <v-text-field v-model="machineItem.Machine_No" :readonly="pageMode === 'edit'"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col md="4">
              <label class="require-field">Process Code</label>
              <v-text-field v-model="machineItem.Process_CD" :readonly="pageMode === 'edit'"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col md="4">
              <label>Map Code</label>
              <v-text-field v-model="machineItem.Map_CD"></v-text-field>
            </v-col>
            <v-col md="4" v-if="pageMode === 'edit'">
              <label>Updated By</label>
              <v-text-field v-model="machineItem.Updated_By" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
            <v-col md="4" v-if="pageMode === 'edit'">
              <label>Updated Date</label>
              <v-text-field v-model="machineItem.Updated_Date" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
            <v-col :md="pageMode === 'edit' ? '4' : '12'">
              <label>Status</label>
              <v-select v-model="machineItem.Status" :items="[{ title: 'All', value: null }, ...statusList]"
                :rules="[rules.required]"></v-select>
            </v-col>
            <v-col md="12">
              <label class="require-field">Machine Name</label>
              <v-text-field v-model="machineItem.Machine_Name" :rules="[rules.required]"></v-text-field>
            </v-col>

          </v-row>
          <v-row>
            <v-col>
              <div class="d-flex justify-center mb-5">
                <n-btn-save @click="saveClick" />
                <n-btn-cancel @click="router.go(-1)" class="ml-3" />
              </div>
            </v-col>
          </v-row>
          <!-- <div class="row">
          <div class="d-flex justify-center">
            <n-btn-save type="submit" />
            <n-btn-cancel @click="onCancel" class="ml-3" />
          </div>
        </div> -->
          <n-loading :loading="isLoading" />
        </v-card-text>
      </v-card>
    </v-form>

    <v-card class="mt-3" v-if="pageMode === 'edit'">
      <v-card-text>
        <n-btn-add label="Add Tool" @click="onAdd"></n-btn-add>
        <v-data-table-server v-model:page="currentPage" v-model:items-per-page="pageSize" :headers="headers"
          :items="items" :items-length="totalItems">
          <template v-slot:[`item.action`]="{ item }">
            <n-gbtn-edit @click="onEdit(item.Machine_No)"></n-gbtn-edit>
          </template>
          <template v-slot:bottom>
            <n-pagination v-model:currentPage="currentPage" v-model:itemPerPage="pageSize"
              v-model:totalItems="totalItems"></n-pagination>
          </template>
        </v-data-table-server>
        <n-loading :loading="isLoading" />
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
      <v-form ref="">
        <v-card>
          <v-card-title>
            <span class="headline">{{ mode }} Master - Model Information</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <label class="require-field">Model </label>
                  <v-text-field v-model="form.Model_CD" :rules="[rules.required]"
                    :readonly="mode === 'Edit'"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Product Code </label>
                  <v-text-field v-model="form.Product_CD" :rules="[rules.required]"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Cycle Time (mins) </label>
                  <v-text-field v-model="form.Cycle_Time_Min" :rules="[rules.required]" type="number"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label>Part Name </label>
                  <v-text-field v-model="form.predefineCd"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Part No </label>
                  <v-text-field v-model="form.Part_No" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Part Upper </label>
                  <v-text-field v-model="form.Part_Upper" :rules="[rules.required]"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <label class="require-field">Part Lower </label>
                  <v-text-field v-model="form.Part_Lower" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="require-field">Status </label>
                  <v-select v-model="form.Status" :rules="[rules.required]" :items="[...statusList]"></v-select>
                </v-col>
                <v-col cols="6" v-if="mode === 'Edit'">
                  <label class="require-field">Updated By </label>
                  <v-text-field v-model="form.Updated_By" :rules="[rules.required]"
                    :readonly="mode === 'Edit'"></v-text-field>
                </v-col>

                <v-col cols="6" v-if="mode === 'Edit'">
                  <label class="require-field">Updated Date </label>
                  <v-text-field v-model="form.Updated_Date" :rules="[rules.required]" :readonly="mode === 'Edit'"
                    placeholder="DD/MM/YYYY HH:mm:ss"></v-text-field>
                </v-col>

              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>
          <div class="d-flex justify-center py-3">
            <n-btn-save @click="saveClick" class="me-3"></n-btn-save>
            <n-btn-cancel text @click="dialog = false"></n-btn-cancel>
          </div>
        </v-card>
      </v-form>
      <n-loading :loading="isDialogLoading" />
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/machine.js";
import rules from "@/utils/rules";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const formSearch = ref({});
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);

const headers = [
  { title: "", key: "action", sortable: false },
  { title: "Tool Code", key: "Machine_No", sortable: false },
  { title: "Tool Name", key: "Process_CD", sortable: false },
  { title: "Tool Life", key: "Map_CD", sortable: false },
  { title: "Warning Alarm", key: "Map_CD", sortable: false },
  { title: "Status", key: "Status", sortable: false },
  { title: "Updated By", key: "Updated_By", sortable: false },
  {
    title: "Updated Date",
    key: "Updated_Date",
    sortable: false,
    value: (item) => {
      return item.Updated_Date
        ? moment(item.Updated_Date).utc().format("DD/MM/YYYY HH:mm:ss")
        : "-";
    },
  },
];
let items = ref([]);
let machineItem = ref({
  Machine_No: '',
  Process_CD: '',
  Machine_Name: '',
  Map_CD: '',
  Status: '',
  Updated_By: '',
  Updated_Date: ''
});

let isLoading = ref(false);
let isDialogLoading = ref(false);
let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);
let pageMode = ref("add");

onMounted(() => {
  ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
    statusList.value = data;
  });

  if (route.params.id) {
    console.log("edit ")
    pageMode.value = "edit";
    loadData();
  }

});

const onSearch = async () => {
  console.log("search ")
  loadData();
};

const loadData = async () => {

  try {
    isLoading.value = true;
    let id = pageMode.value === 'edit' ? route.params.id : machineItem.value.Machine_No;
    console.log("loaddata ", id)
    const response = await api.getById(id);

    machineItem.value = response.data;
    machineItem.value.Updated_Date = machineItem.value.Updated_Date
      ? moment(machineItem.value.Updated_Date).format('DD/MM/YYYY HH:mm:ss')
      : ''
    // totalItems.value = response.total_record;
  } catch (error) {
    console.error("Error fetching API:", error);
    items.value = [];
    totalItems.value = 0;
  }
  isLoading.value = false;
};

const onReset = () => {
  formSearch.value = {
    isActive: "Y",
  };
  items.value = [];
  totalItems.value = 0;
  onSearch();
};

const onAdd = () => {
  router.push({ name: "machine-info" });
};

const onEdit = (id) => {
  router.push({ name: `machine-info`, params: { id: id } });
};

// const onAdd = () => {
//   mode.value = "Add";
//   console.log("Add");
//   form.value = {
//   };
//   dialog.value = true;
// };

// const onEdit = (modelCd) => {
//   mode.value = "Edit";
//   dialog.value = true;
//   api.getById(modelCd).then((res) => {
//     form.value = res.data;
//     form.value.Updated_Date = form.value.Updated_Date
//       ? moment(form.value.Updated_Date).format('DD/MM/YYYY HH:mm:ss')
//       : ''
//   });
// };

const saveClick = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    console.log('vali ', valid)
    if (!valid) return;
    isLoading.value = true;
    isDialogLoading.value = true;
    let res = null;
    if (pageMode.value === "add") {
      console.log("Add");
      res = await api.add(machineItem.value);
    } else {
      console.log("Edit");
      res = await api.update(machineItem.value.Machine_No, machineItem.value);
    }
    isLoading.value = false;
    isDialogLoading.value = false;
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
