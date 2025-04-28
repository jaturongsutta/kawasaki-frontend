<template>
    <div>
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

        <v-dialog v-model="dialog" max-width="600px">
            <v-form ref="frmInfo">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ mode }} Tool</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="6">
                                    <label class="require-field">Tool Code </label>
                                    <v-text-field v-model="form.Tool_CD" :rules="[rules.required]"
                                        :readonly="mode === 'Edit'"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label class="require-field">Tool Name </label>
                                    <v-text-field v-model="form.Tool_Name" :rules="[rules.required]"></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                    <label>Tool Life </label>
                                    <v-text-field v-model="form.Tool_Life" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Warning Alarm </label>
                                    <v-text-field v-model="form.Warning_Amt" type="number"></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                    <label>Alert Alarm </label>
                                    <v-text-field v-model="form.Alert_Amt" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Alarm Alarm </label>
                                    <v-text-field v-model="form.Alarm_Amt" type="number"></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                    <label>Map Code </label>
                                    <v-text-field v-model="form.Map_CD"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label class="require-field">Status </label>
                                    <v-select v-model="form.Status" :rules="[rules.required]"
                                        :items="[...statusList]"></v-select>
                                </v-col>
                                <v-col cols="6" v-if="mode === 'Edit'">
                                    <label>Updated By </label>
                                    <v-text-field v-model="form.Updated_By" :readonly="mode === 'Edit'"></v-text-field>
                                </v-col>

                                <v-col cols="6" v-if="mode === 'Edit'">
                                    <label>Updated Date </label>
                                    <v-text-field v-model="form.Updated_Date" :readonly="mode === 'Edit'"
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
import * as api from "@/api/tool.js";
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

let tab = ref("main");

const headers = [
    { title: "", key: "action", sortable: false },
    { title: "Tool Code", key: "Tool_CD", sortable: false },
    { title: "Tool Name", key: "Tool_Name", sortable: false },
    { title: "Tool Life", key: "Tool_Life", sortable: false },
    { title: "Warning Alarm", key: "Warning_Amt", sortable: false },
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
let Process_CD = ref('');


onMounted(() => {
    ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
        statusList.value = data;
    });

    Process_CD.value = route.params.id;
    console.log("process is ",Process_CD.value)
    loadData({ page: currentPage.value, itemsPerPage: pageSize.value });
    // if (route.params.id) {
    //     // console.log("edit ")
    //     // pageMode.value = "edit";
    //     loadData();
    // }

  
});

const onSearch = async () => {
    console.log("search ")
    loadData({ page: currentPage.value, itemsPerPage: pageSize.value });
};


const loadData = async (paginate) => {
    const { page, itemsPerPage } = paginate;

    const searchOptions = getPaging({ page, itemsPerPage });

    try {
        const data = {
            process_cd: Process_CD.value,
            searchOptions,
        };

        isLoading.value = true;
        const response = await api.search(data);

        items.value = response.data;
        items.value.Updated_Date = items.value.Updated_Date
            ? moment(items.value.Updated_Date).format('DD/MM/YYYY HH:mm:ss')
            : ''
        totalItems.value = response.total_record;

        console.log("item is ", items)
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
    mode.value = "Add";
    console.log("Add");
    form.value = {
    };
    dialog.value = true;
};

const onEdit = (id) => {
    mode.value = "Edit";
    dialog.value = true;
    api.getById(modelCd).then((res) => {
        form.value = res.data;
        form.value.Updated_Date = form.value.Updated_Date
            ? moment(form.value.Updated_Date).format('DD/MM/YYYY HH:mm:ss')
            : ''
    });
};

const saveClick = async () => {
    try {
        const { valid } = await frmInfo.value.validate();
        console.log('vali ', valid)
        if (!valid) return;
        // isLoading.value = true;
        isDialogLoading.value = true;
        let res = null;

        form.value.Process_CD = Process_CD.value;
        if (mode.value === "Add") {
            console.log("Add");
            res = await api.add(form.value);
        } else {
            console.log("Edit");
            res = await api.update(form.value.Machine_No, form.value);
        }
        // isLoading.value = false;
        isDialogLoading.value = false;
        if (res.status === 0) {
            dialog.value = false;
            Alert.success();
            onSearch();
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