<template>
  <v-card class="ma-5">
    <v-card-title>
      <h5>User</h5>
    </v-card-title>

    <v-card-text>
      <v-form ref="frmInfo">
        <v-row>
          <v-col md="4">
            <label class="require-field">Username</label>
            <v-text-field
              v-model="form.username"
              :readonly="mode === 'edit'"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="4">
            <label>Password</label>
            <v-text-field
              type="password"
              v-model="form.password"
            ></v-text-field>
          </v-col>
          <v-col md="4">
            <label class="require-field">Role</label>
            <v-select
              v-model="form.roles"
              :items="roleList"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col md="4">
            <label class="require-field">First Name</label>
            <v-text-field
              v-model="form.firstName"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col md="4">
            <label>Last Name</label>
            <v-text-field v-model="form.lastName"></v-text-field>
          </v-col>

          <v-col md="2">
            <label>Position Name</label>
            <v-text-field v-model="form.positionName"></v-text-field>
          </v-col>

          <v-col md="2">
            <label class="require-field">Status</label>
            <v-select
              v-model="form.isActive"
              :items="statusList"
              :rules="[rules.required]"
            ></v-select>
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
        <n-loading :loading="isLoading" />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "@/api/common-master/user.js";
import * as ddlApi from "@/api/dropdown-list.js";
import rules from "@/utils/rules";

const Alert = inject("Alert");
const route = useRoute();

const frmInfo = ref(null);

const router = useRouter();
const form = ref({
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  isActive: "Y",
});

const roleList = ref([
  { title: "Admin", value: "1" },
  { title: "User", value: "2" },
]);

const mode = ref("add");

const isLoading = ref(false);

const statusList = ref([]);
onMounted(() => {
  ddlApi.getPredefine({ group: "Is_Active", sortby: "text" }).then((data) => {
    statusList.value = data;
  });

  ddlApi.role().then((data) => {
    roleList.value = data;
  });

  if (route.params.id) {
    isLoading.value = true;
    mode.value = "edit";
    const id = route.params.id;
    api
      .getById(id)
      .then((res) => {
        form.value = res;

        // convert roles data number to string
        form.value.roles = res.roles.map((item) => item.toString());
        isLoading.value = false;
      })
      .catch((error) => {
        isLoading.value = false;
        Alert.error("Error ", error.message);
      });
  }
});

const onSave = async () => {
  let res;
  console.log(form.value);

  const { valid } = await frmInfo.value.validate();
  if (!valid) return;
  isLoading.value = true;

  try {
    if (route.params.id) {
      res = await api.updateUser(route.params.id, form.value);
    } else {
      res = await api.addUser(form.value);
    }

    isLoading.value = false;
    if (res.status === 0) {
      Alert.success();
      router.go(-1);
    } else {
      Alert.warning(res.message);
    }
  } catch (error) {
    isLoading.value = false;
    Alert.error("Error ", error.message);
  }
};
</script>
