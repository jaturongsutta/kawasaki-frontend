<template>
    <div>
        <v-card-text>
            <n-btn-add label="Add Tool" @click="onAdd"></n-btn-add>
            <v-data-table-server v-model:page="currentPage" v-model:items-per-page="pageSize" :headers="headers"
                :items="items" :items-length="totalItems" @update:options="loadData">
                <template v-slot:[`item.action`]="{ item }">
                    <n-gbtn-edit @click="onEdit(item)"></n-gbtn-edit>
                </template>
                <template v-slot:[`item.reset`]="{ item }">
                    <n-btn-reset @click="onSaveHistory(item)" />
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
                                    <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.Tool_Life"
                                        type="text" inputmode="numeric"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Warning Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.Warning_Amt"
                                        type="text"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Alert Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" v-model="form.Alert_Amt" type="text"
                                        inputmode="numeric" reverse></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Alarm Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" type="text" v-model="form.Alarm_Amt"
                                        reverse></v-text-field>
                                </v-col>
                                <v-col v-if="mode === 'Edit'" cols="6">
                                    <label>Actual Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.Actual_Amt"
                                        type="number" readonly></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                    <label>Map Code </label>
                                    <v-text-field v-model="form.Map_CD"></v-text-field>
                                </v-col>
                                <v-col :cols="mode === 'Edit' ? '12' : '6'">
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
import { useRoute } from "vue-router";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/tool.js";
import rules from "@/utils/rules";
import { getDateFormat, commaFormattedNumber, markNumberFormatOptions } from "@/utils/utils";

const route = useRoute();
const Alert = inject("Alert");
const frmInfo = ref(null);
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);

const headers = [
    { title: "", key: "action", sortable: false },
    { title: "Tool Code", key: "Tool_CD", sortable: false },
    { title: "Tool Name", key: "Tool_Name", sortable: false },
    {
        title: "Tool Life", key: "Tool_Life", sortable: false,
        value: (item) => {
            return commaFormattedNumber(item.Tool_Life);
        },
    },
    {
        title: "Warning Amt", key: "Warning_Amt", sortable: false,
        value: (item) => {
            return commaFormattedNumber(item.Warning_Amt);
        },
    },
    {
        title: "Alert Amt", key: "Alert_Amt", sortable: false,
        value: (item) => {
            return commaFormattedNumber(item.Alert_Amt);
        },
    },
    {
        title: "Alarm Amt", key: "Alarm_Amt", sortable: false,
        value: (item) => {
            return commaFormattedNumber(item.Alarm_Amt);
        },
    },
    {
        title: "Actual Amt", key: "Actual_Amt", sortable: false,
        value: (item) => {
            return commaFormattedNumber(item.Actual_Amt);
        },
    },
    { title: "Reset", key: "reset", sortable: false },
    { title: "Status", key: "Status", sortable: false },
    { title: "Updated By", key: "Updated_By", sortable: false },
    {
        title: "Updated Date",
        key: "Updated_Date",
        sortable: false,
        value: (item) => {
            return getDateFormat(item.Updated_Date);
        },
    },
];

let items = ref([]);
let isLoading = ref(false);
let isDialogLoading = ref(false);
let currentPage = ref(1);
let pageSize = ref(20);
let totalItems = ref(0);

onMounted(() => {
    ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
        statusList.value = data;
    });
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
            process_cd: route.params.id,
            searchOptions,
        };
        isLoading.value = true;
        const response = await api.search(data);
        items.value = response.data;
        totalItems.value = response.total_record;
    } catch (error) {
        console.error("Error fetching API:", error);
        items.value = [];
        totalItems.value = 0;
    }
    isLoading.value = false;
};

const onAdd = () => {
    mode.value = "Add";
    console.log("Add");
    form.value = {
    };
    dialog.value = true;
};

const onEdit = (item) => {
    mode.value = "Edit";
    form.value = { ...item };
    form.value.Updated_Date = getDateFormat(form.value.Updated_Date)
    dialog.value = true;
};

const onSaveHistory = async (item) => {
    try {
        isLoading.value = true;
        const res = await api.createHistory(item);
        isLoading.value = false;
        if (res.status === 0) {
            dialog.value = false;
            Alert.success(`Reset "${item.Tool_CD} : ${item.Tool_Name}" Successful`);
            onSearch();
        } else {
            Alert.warning(res.message);
        }
    } catch (error) {
        isLoading.value = false;
        Alert.error(error.message);
    }
}

const saveClick = async () => {
    try {
        const { valid } = await frmInfo.value.validate();
        if (!valid) return;
        isDialogLoading.value = true;
        let res = null;

        form.value.Process_CD = route.params.id;
        let params = { ...form.value }
        params.Tool_Life = convertToPureNumber(params.Tool_Life);
        params.Warning_Amt = convertToPureNumber(params.Warning_Amt);
        params.Alarm_Amt = convertToPureNumber(params.Alarm_Amt);
        params.Alert_Amt = convertToPureNumber(params.Alert_Amt);
        params.Actual_Amt = convertToPureNumber(params.Actual_Amt);

        if (mode.value === "Add") {
            console.log("Add");
            res = await api.add(params);
        } else {
            console.log("Edit");
            res = await api.update(params.Tool_CD, params);
        }
        isDialogLoading.value = false;
        if (res.status === 0) {
            dialog.value = false;
            Alert.success();
            onSearch();
        } else {
            Alert.warning(res.message);
        }
    } catch (error) {
        isDialogLoading.value = false;
        Alert.error(error.message);
    }
};

function convertToPureNumber(v) {
    if (v) {
        let n = Number(`${v}`.replace(/,/g, ''))
        return n
    }
    return;
}
</script>