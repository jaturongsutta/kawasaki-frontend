<template>
  <v-icon
    icon="mdi mdi-delete"
    v-tooltip:end="'Delete'"
    style="margin-left: 5px; margin-right: 5px; color: red; cursor: pointer"
  ></v-icon>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
const route = useRoute();
const authStore = useAuthStore();
const props = defineProps({
  label: String,

  permission: {
    type: Boolean,
    default: true,
  },
});

let canAccess = ref(false);

onMounted(() => {
  const { meta } = route;

  if (props.permission) {
    if (meta.menuNo) {
      const access = authStore.permission.filter(
        (item) => item.Menu_No === meta.menuNo
      );
      if (access.length !== 0) {
        const { Can_Update } = access[0];

        if (Can_Update === "Y") {
          canAccess.value = true;
        } else {
          canAccess.value = false;
        }
      } else {
        canAccess.value = false;
        console.warn("Menu No missing in database premission");
        return;
      }
    } else {
      canAccess.value = false;
      console.warn("Menu No missing in route meta");
    }
  } else {
    canAccess.value = true;
  }
});
</script>
