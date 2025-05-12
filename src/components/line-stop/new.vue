<template>
  <v-form ref="frmInfo">
    <v-card>
      <v-card-title>
        <span class="headline">{{ mode }} New Line Stop {{ mainProps.isPLC ? 'from PLC' : '' }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="5">
              <label>Line </label>
              <v-select v-model="formSearch.lineCd" :items="lineList" :rules="[rules.required]"></v-select>
            </v-col>
            <v-col cols="5">
              <label>Plan Date</label>
              <n-date v-model="formSearch.planDate" :rules="[rules.required]"></n-date>
            </v-col>
            <div class="row mt-6 ml-2">
              <div class="d-flex justify-center">
                <n-btn-search @click="onSearch" />
              </div>
            </div>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="pb-16">
          <v-col>
            <v-data-table v-model:page="currentPage" :headers="headersDetail" :items="items" :items-per-page="pageSize"
              hide-default-footer>
              <template v-slot:[`item.action`]="{ item }">
                <n-btn label="Select" no-permission @click="onSelect(item)" />
              </template>
            </v-data-table>
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-card-text>
      <n-loading :loading="isLoading" />
    </v-card>
  </v-form>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import rules from "@/utils/rules";
import { useRouter } from "vue-router";
import * as api from "@/api/line-stop.js";
import * as ddlApi from "@/api/dropdown-list.js";
import { getCurrrentDate, getDateFormat, getCheckBreak } from "@/utils/utils";

const Alert = inject("Alert");
const mainProps = defineProps({
  isPLC: Boolean,
});

const emit = defineEmits([
  "onAddSuccessful",
]);

const router = useRouter();
const formSearch = ref({ lineCd: '', planDate: `${getCurrrentDate()}` });
const currentPage = ref(1);
const pageSize = ref(10);
const lineList = ref([]);
let isLoading = ref(false);
let items = ref([]);
const frmInfo = ref(null);

const headersDetail = [
  { title: "", key: "action", sortable: false, nowrap: true },
  {
    title: "Plan Date", key: "Plan_Date", sortable: false, value: (item) => {
      return getDateFormat(item.Plan_Date, "dd/MM/yyyy");
    }
  },
  {
    title: "Plan Start Time", key: "Plan_Start_Time", sortable: false, value: (item) => {
      return getDateFormat(item.Plan_Start_Time, "HH:mm");
    }
  },
  {
    title: "Break1", key: "B1", sortable: false, value: (item) => {
      return getCheckBreak(item.B1);
    }
  },
  {
    title: "Lunch Break", key: "B2", sortable: false, value: (item) => {
      return getCheckBreak(item.B2);
    }
  },
  {
    title: "Break2", key: "B3", sortable: false, value: (item) => {
      return getCheckBreak(item.B3);
    }
  },
  {
    title: "Break OT", key: "B4", sortable: false, value: (item) => {
      return getCheckBreak(item.B4);
    }
  },
  {
    title: "OT", key: "OT", sortable: false, value: (item) => {
      return getCheckBreak(item.OT);
    }
  },
  { title: "Model", key: "Model_CD", sortable: false },
  { title: "Status", key: "status_name", sortable: false },
];

onMounted(() => {
  ddlApi.line().then((data) => {
    lineList.value = data;
  });
});

const onSearch = () => {
  currentPage.value = 1;
  loadData();
}

const loadData = async () => {
  try {
    const { valid } = await frmInfo.value.validate();
    if (!valid) return;

    isLoading.value = true;
    const data = {
      ...formSearch.value
    };

    const response = await api.searchPlan(data);

    items.value = response.data;
    pageSize.value = response.total_record;
  } catch (error) {
    console.error("Error fetching API:", error);
    items.value = [];
    pageSize.value = 0;
  }
  isLoading.value = false;
};

const onSelect = async (item) => {
  if (mainProps.isPLC) {
    try {

      isLoading.value = true;
      const res = await api.addFromPLC({ lineCd: item.Line_CD, PlanId: item.id });

      isLoading.value = false;
      if (res.status === 0) {
        await Alert.success("New Line Stop Successful");
        emit("onAddSuccessful", true);
      } else {
        Alert.warning(res.message);
      }
    } catch (error) {
      isLoading.value = false;
      Alert.error(error.message);
    }
  }
  else {
    localStorage.setItem("ng-new", JSON.stringify(item));
    router.push({ name: `ng-info`, query: { lineCd: item.Line_CD } });
  }
}

</script>
