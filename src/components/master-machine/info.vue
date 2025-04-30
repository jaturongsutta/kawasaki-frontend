<template>
    <v-form ref="frmInfo">
        <v-row>
            <v-col md="3">
                <label class="require-field">Machine No</label>
                <v-text-field v-model="machineItem.machineNo" :readonly="pageMode === 'edit'"
                    :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col md="3">
                <label class="require-field">Process Code</label>
                <v-text-field v-model="machineItem.processCd" :readonly="pageMode === 'edit'"
                    :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col md="6">
                <label class="require-field">Machine Name</label>
                <v-text-field v-model="machineItem.machineName" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col :md="pageMode === 'edit' ? '3' : '6'">
                <label>Map Code</label>
                <v-text-field v-model="machineItem.mapCd"></v-text-field>
            </v-col>
            <v-col :md="pageMode === 'edit' ? '3' : '6'">
                <label>Status</label>
                <v-select v-model="machineItem.isActive" :items="[{ title: 'All', value: null }, ...statusList]"
                    :rules="[rules.required]"></v-select>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
                <label>Updated By</label>
                <v-text-field v-model="machineItem.updatedBy" :readonly="pageMode === 'edit'"></v-text-field>
            </v-col>
            <v-col md="3" v-if="pageMode === 'edit'">
                <label>Updated Date</label>
                <v-text-field v-model="machineItem.updatedDate" :readonly="pageMode === 'edit'"></v-text-field>
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
    machineNo: '',
    processCd: '',
    machineName: '',
    mapCd: '',
    isActive: '',
    updatedBy: '',
    updatedDate: ''
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
        let id = pageMode.value === 'edit' ? route.params.id : machineItem.value.machineNo;
        const response = await api.getById(id);

        if (response.status === 2) {
            Alert.error("Error ", response.message);
            return;
        }
        machineItem.value = response.data;
        machineItem.value.updatedDate = getDateFormat(machineItem.value.updatedDate);

    } catch (error) {
        console.error("Error fetching API:", error);
        machineItem.value = {}
    }
    isLoading.value = false;
};

const saveClick = async () => {
    try {
        const { valid } = await frmInfo.value.validate();
        if (!valid) return;
        isLoading.value = true;
        isDialogLoading.value = true;
        let res = null;
        if (pageMode.value === "add") {
            console.log("Add");
            res = await api.add(machineItem.value);
        } else {
            console.log("Edit");
            res = await api.update(machineItem.value.processCd, machineItem.value);
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