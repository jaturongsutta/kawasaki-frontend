<template>
  <v-app-bar class="position-fixed top-bar" v-if="isShow" density="compact">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="toggleMinimalMenu"
    ></v-app-bar-nav-icon>
    <img
      class="logo-sta ml-3"
      src="@/assets/imgs/logo.png"
      @click="homeClick"
    />
    <v-spacer></v-spacer>

    <label class="text-h6 me-2 text-primary">{{ userFullname }}</label>
    <user-menu class="text-h6 me-2 text-primary"></user-menu>

    <v-btn
      color="primary"
      icon="mdi-logout"
      variant="text"
      @click="logoutClick"
    ></v-btn>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { inject } from "vue";
const Alert = inject("Alert");
const storeApp = useAppStore();
const router = useRouter();
const authStore = useAuthStore();

const isShow = computed(() => {
  return authStore.isLoggedIn;
});

const logoutClick = () => {
  Alert.confirm("Are you sure you want to logout?").then((c) => {
    if (c.isConfirmed) {
      authStore.logout();
      // window.location.reload();
      router.push({ name: "login" });
    }
  });
};

const userFullname = computed(() => {
  return authStore.user?.firstName ?? "" + " " + authStore.user?.lastName ?? "";
});

const toggleMinimalMenu = () => {
  storeApp.minimalMenu = !storeApp.minimalMenu;
};

const homeClick = () => {
  router.push({ path: "/" });
};
</script>

<style scoped>
.top-bar {
  color: white;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.logo-sta {
  height: 40px;
  margin-right: 16px;
}

.text-h6 {
  font-weight: bold;
  margin-right: 16px;
  color: white;
}

.v-btn {
  color: white;
}

.v-app-bar-nav-icon {
  color: rgb(0, 0, 0);
}

.v-app-bar.v-toolbar:not(.v-toolbar--flat) {
  border-bottom-color: black;
  box-shadow: unset;
}

.v-toolbar {
  border-bottom-width: 5px;
  /* border-bottom-color: #6abe28 !important; */

  border-bottom-color: rgba(
    var(--v-theme-primary),
    var(--v-high-emphasis-opacity)
  ) !important;
}
</style>
