<template>
    <v-container>
        <v-form ref="frmInfo">
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
                    <div class="d-flex justify-center mb-3">
                        <n-btn-save @click="saveClick" />
                        <n-btn-cancel @click="router.go(-1)" class="ml-3" />
                    </div>
                </v-col>
            </v-row>
            <n-loading :loading="isLoading" />
        </v-form>
    </v-container>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as ddlApi from "@/api/dropdown-list.js";
import * as api from "@/api/machine.js";
import rules from "@/utils/rules";
import { getDateFormat } from "@/utils/utils";

const route = useRoute();
const router = useRouter();
const Alert = inject("Alert");
const frmInfo = ref(null);
const dialog = ref(false);
const statusList = ref([]);

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
        const response = await api.getById(id);

        machineItem.value = response.data;
        machineItem.value.Updated_Date = getDateFormat(machineItem.value.Updated_Date);

    } catch (error) {
        console.error("Error fetching API:", error);
        machineItem.value = {}
    }
    isLoading.value = false;
};

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