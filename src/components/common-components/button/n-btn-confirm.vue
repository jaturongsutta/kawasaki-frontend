<template>
  <v-btn
    prepend-icon="mdi mdi-check"
    v-show="canAccess"
    class="bg-gradient-info"
  >
    <template v-slot:prepend>
      <v-icon color="white" size="large"></v-icon>
    </template>

    {{
      (props.label === null || props.label) === undefined ? "Confirm" : props.label
    }}
  </v-btn>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
const route = useRoute();
const authStore = useAuthStore();
const props = defineProps({
  label: String,

  noPermission: {
    type: Boolean,
    default: false,
  },

  add: {
    type: Boolean,
    default: false,
  },

  update: {
    type: Boolean,
    default: false,
  },
});

let canAccess = ref(false);

onMounted(() => {
  const { meta } = route;

  if (props.noPermission === false) {
    if (meta.menuNo) {
      const access = authStore.permission.filter(
        (item) => item.Menu_No === meta.menuNo
      );
      if (access.length !== 0) {
        const { Can_Add, Can_Update } = access[0];

        if (props.add) {
          if (Can_Add == "Y") {
            canAccess.value = true;
          }
        } else if (props.update) {
          if (Can_Update == "Y") {
            canAccess.value = true;
          }
        } else {
          if (Can_Add === "Y" || Can_Update === "Y") {
            canAccess.value = true;
          }
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

<style scoped>
.bg-gradient-info {
  background-image: linear-gradient(310deg, rgb(0 24 156 / 87%), #6299f8 100%);
  color: #fff;
}
</style>
