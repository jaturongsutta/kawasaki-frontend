<template>
  <v-container class="fill-height" justify="center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="login-card">
          <v-card-title class="headline text-h5">Sign In</v-card-title>
          <v-card-text>
            <label class="text-subtitle-1"
              >Enter your Username and password to sign in</label
            >
            <v-form ref="frmLogin" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="form.username"
                label="Username"
                :rules="[rules.required]"
                placeholder="Username"
                density="default"
                required
                class="mt-3"
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="form.password"
                :rules="[rules.required]"
                placeholder="Password"
                type="password"
                required
                density="default"
                class="mt-3"
              ></v-text-field>

              <v-btn
                type="submit"
                block
                size="large"
                :loading="isLoading"
                class="bg-gradient-info"
                >Login</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref, inject } from "vue";
import rules from "@/utils/rules";
import { authLogin } from "@/api/authentication.js";
import { useRouter } from "vue-router";

const Alert = inject("Alert");

const router = useRouter();
const form = reactive({
  username: "",
  password: "",
});

const frmLogin = ref(null);

const isLoading = ref(false);

const handleSubmit = async () => {
  try {
    const { valid } = await frmLogin.value.validate();
    if (valid) {
      isLoading.value = true;

      let login = await authLogin(form.username, form.password);
      isLoading.value = false;
      if (login.result.status == 0) {
        try {
          // // Add Routes for Vue Router
          // const res = await authGetMenuRoute();
          // if (res.data != null && res.data) {
          //   var data = xorEncryptDecrypt(JSON.stringify(res.data));
          //   localStorage.setItem("menuRoutes", data);
          //   await updateRouterByRouteData(router);
          // }
        } catch (error) {
          console.error("Error Fetching Routes: ", error);
        }

        router.push("/");
      } else {
        Alert.warning(login.result.message);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
    isLoading.value = false;
    Alert.error("Login fail : " + error.message);
  }
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}

.login-card {
  padding: 20px;
}

.bg-gradient-info {
  background-image: linear-gradient(310deg, rgb(68 156 0 / 87%), #a3f862 100%);
  color: #fff;
}
</style>
