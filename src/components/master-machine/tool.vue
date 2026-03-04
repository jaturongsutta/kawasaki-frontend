<template>
    <div>
        <v-card-text>
            <v-card-title>
                <h4>Tool Information</h4>
            </v-card-title>
            <v-divider class="mb-2"></v-divider>
            <n-btn-add label="Add Tool" @click="onAdd"></n-btn-add>
            <v-data-table-server v-model:page="currentPage" v-model:items-per-page="pageSize" :headers="headers"
                :items="items" :items-length="totalItems" @update:options="loadData">
                <template v-slot:[`item.action`]="{ item }">
                    <n-gbtn-edit @click="onEdit(item)"></n-gbtn-edit>
                </template>
                <!-- <template v-slot:[`item.reset`]="{ item }">
                    <n-btn-reset @click="onReset(item)" />
                </template> -->

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
                                    <label class="require-field">H Code</label>
                                    <v-text-field v-model="form.hCode" :rules="[rules.required]"
                                        :readonly="mode === 'Edit'"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label class="require-field">Tool No. </label>
                                    <v-text-field v-model="form.toolCd" :rules="[rules.required]"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label class="require-field">Tool Name </label>
                                    <v-text-field v-model="form.toolName" :rules="[rules.required]"></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                    <label>Tool Life </label>
                                    <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.toolLife"
                                        type="text" inputmode="numeric" readonly></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Warning Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.warningAmt"
                                        type="text" readonly></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Alert Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" v-model="form.alertAmt" type="text"
                                        inputmode="numeric" reverse readonly></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <label>Alarm Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" type="text" v-model="form.alarmAmt"
                                        reverse readonly></v-text-field>
                                </v-col>
                                <v-col v-if="mode === 'Edit'" cols="6">
                                    <label>Actual Amt </label>
                                    <v-text-field v-maska="markNumberFormatOptions" reverse v-model="form.actualAmt"
                                        type="text" readonly></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                    <label>Prog No </label>
                                    <v-text-field v-model="form.mapCd"></v-text-field>
                                </v-col>
                                <v-col :cols="mode === 'Edit' ? '6' : '12'">
                                    <label class="require-field">Status </label>
                                    <v-select v-model="form.isActive" :rules="[rules.required]"
                                        :items="[...statusList]"></v-select>
                                </v-col>
                                <v-col cols="6" v-if="mode === 'Edit'">
                                    <label>Updated By </label>
                                    <v-text-field v-model="form.updatedBy" :readonly="mode === 'Edit'"></v-text-field>
                                </v-col>

                                <v-col cols="6" v-if="mode === 'Edit'">
                                    <label>Updated Date </label>
                                    <v-text-field v-model="form.updatedDate" :readonly="mode === 'Edit'"
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
import { onMounted, ref, inject, defineProps } from "vue";
import { useRoute } from "vue-router";
import { getPaging } from "@/utils/utils.js";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/tool.js";
import rules from "@/utils/rules";
import { getDateFormat, commaFormattedNumber, markNumberFormatOptions, convertCommaToPureNumber } from "@/utils/utils";

const props = defineProps({
    machineItem: Object,
});

const route = useRoute();
const Alert = inject("Alert");
const frmInfo = ref(null);
const form = ref({});
const mode = ref("Add");
const dialog = ref(false);
const statusList = ref([]);

const headers = [
    { title: "", key: "action", sortable: false },
    { title: "H Code", key: "H_Code", sortable: false },
    { title: "Tool No.", key: "Tool_CD", sortable: false },
    { title: "Tool Name", key: "Tool_Name", sortable: false },
    {
        title: "Tool Life", key: "Tool_Life", sortable: false,
        value: (item) => {
            return commaFormattedNumber(item.Tool_Life);
        },
    },
    {
        title: "Warning Amt", key: "Warn_Amt", sortable: false,
        value: (item) => {
            return commaFormattedNumber(item.Warn_Amt);
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
    {
        title: "Prog No", key: "Prog_No", sortable: false,
        value: (item) => {
            return item.Prog_No || '-';
        },
    },
    { title: "Status", key: "is_Active", sortable: false },
    { title: "Updated By", key: "Updated_By_Name", sortable: false },
    {
        title: "Updated Date",
        key: "UPDATED_DATE",
        sortable: false,
        value: (item) => {
            return getDateFormat(item.UPDATED_DATE);
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
            machine_no: route.params.id,
            process_cd: route.params.processCd,
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

const onEdit = async (item) => {
    mode.value = "Edit";

    form.value = {
    };
    dialog.value = true;
    try {
        console.log("item: ", item);
        form.value.hCode = item.H_Code;
        form.value.toolCd = item.Tool_CD;
        form.value.toolName = item.Tool_Name;
        form.value.toolLife = item.Tool_Life;
        form.value.warningAmt = item.Warn_Amt;
        form.value.alertAmt = item.Alert_Amt;
        form.value.alarmAmt = item.Alarm_Amt;
        form.value.actualAmt = item.Actual_Amt;
        form.value.mapCd = item.Prog_No;
        form.value.isActive = item.is_Active;
        form.value.updatedBy = item.Updated_By_Name;
        form.value.updatedDate = getDateFormat(item.UPDATED_DATE);

    }
    catch (e) {
        console.log('Error: ', e);
        Alert.error("Error ", e.message);
    }
};

const onReset = async (item) => {
    try {
        isLoading.value = true;
        item.machineNo = props.machineItem?.machineNo;
        const res = await api.reset(item);
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

        form.value.processCd = route.params.processCd;
        let {
            toolLife,
            warningAmt,
            alarmAmt,
            alertAmt,
            ...params
        } = form.value;
        params.actualAmt = convertCommaToPureNumber(params.actualAmt);
        params.machineNo = props.machineItem?.machineNo;

        if (mode.value === "Add") {
            console.log("Add");
            res = await api.add(params);
        } else {
            console.log("Edit");
            res = await api.update(params.hCode, params);
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

</script>