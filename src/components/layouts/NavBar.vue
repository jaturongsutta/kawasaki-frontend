<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="miniMenu"
    permanent
    class="position-fixed"
    v-if="authStore.isLoggedIn"
    :width="270"
  >
    <v-divider></v-divider>

    <!-- === MINI MENU (rail: true) === -->
    <v-list v-if="miniMenu" density="compact">
      <template v-for="menuItem in mainMenu" :key="menuItem.Menu_No">
        <template v-if="menuItem.URL === null">
          <v-menu
            v-if="menuItem.IS_MainMenu === 'Main Menu'"
            open-on-hover
            location="end"
          >
            <template v-slot:activator="{ props }">
              <v-list-item link v-bind="props">
                <v-icon color="primary">
                  {{
                    menuItem.Menu_Icon === null
                      ? "mdi mdi-form-select"
                      : menuItem.Menu_Icon
                  }}
                </v-icon>
              </v-list-item>
            </template>

            <v-card class="rounded-0">
              <v-card-title>{{ menuItem.Menu_Name }}</v-card-title>
              <v-divider></v-divider>

              <v-list density="compact">
                <template
                  v-for="subMenuItem in childrenOf(menuItem.Menu_No)"
                  :key="subMenuItem.Menu_No"
                >
                  <!-- ชั้นที่ 2 ใน mini: ใช้ text-small ด้วย -->
                  <v-list-item :to="subMenuItem.URL || undefined" link>
                    <v-list-item-title class="title-sub-menu full-text text-small">
                      {{ subMenuItem.Menu_Name }}
                    </v-list-item-title>
                  </v-list-item>

                  <!-- ชั้นที่ 3 (mini) -->
                  <v-list
                    v-if="hasChildren(subMenuItem.Menu_No)"
                    class="pl-6"
                    density="compact"
                  >
                    <v-list-item
                      v-for="thirdMenu in childrenOf(subMenuItem.Menu_No)"
                      :key="thirdMenu.Menu_No"
                      :to="thirdMenu.URL"
                      link
                    >
                      <v-list-item-title class="full-text text-small">
                        • {{ thirdMenu.Menu_Name }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </template>
              </v-list>
            </v-card>
          </v-menu>
        </template>

        <!-- main menu ที่มี URL -->
        <v-list-item v-else :to="menuItem.URL" link>
          <v-icon color="primary" v-tooltip:end="menuItem.Menu_Name">
            {{
              menuItem.Menu_Icon === null
                ? "mdi mdi-form-select"
                : menuItem.Menu_Icon
            }}
          </v-icon>
        </v-list-item>
      </template>
    </v-list>

    <!-- === FULL MENU (rail: false) === -->
    <v-list
      v-else
      v-model:opened="open"
      open-strategy="single"
      density="comfortable"
    >
      <template v-for="menuItem in mainMenu" :key="menuItem.Menu_No">
        <v-list-group v-if="menuItem.URL === null" :value="menuItem.Menu_Name">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="
                menuItem.Menu_Icon === null
                  ? 'mdi-form-select'
                  : menuItem.Menu_Icon
              "
              :title="menuItem.Menu_Name"
              link
            >
              <template v-slot:prepend>
                <v-avatar>
                  <v-icon
                    color="primary"
                    :icon="
                      menuItem.Menu_Icon === null
                        ? 'mdi-form-select'
                        : menuItem.Menu_Icon
                    "
                  ></v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </template>

          <!-- ชั้นที่ 2 + ชั้นที่ 3 -->
          <template
            v-for="subMenuItem in childrenOf(menuItem.Menu_No)"
            :key="subMenuItem.Menu_No"
          >
            <!-- ชั้น 2 ที่มีลูกต่อ (หัวกลุ่มระดับ 2) -->
            <v-list-group
              v-if="hasChildren(subMenuItem.Menu_No)"
              :value="subMenuItem.Menu_Name"
            >
              <template v-slot:activator="{ props: subProps }">
                <v-list-item
                  v-bind="subProps"
                  :to="subMenuItem.URL || undefined"
                  link
                >
                  <!-- หัวกลุ่ม ใช้ฟอนต์ปกติ -->
                  <v-list-item-title class="full-text">
                    {{ subMenuItem.Menu_Name }}
                  </v-list-item-title>
                </v-list-item>
              </template>

              <!-- ชั้นที่ 3 (ใบสุดท้าย) -->
              <v-list-item
                v-for="thirdMenu in childrenOf(subMenuItem.Menu_No)"
                :key="thirdMenu.Menu_No"
                :value="thirdMenu.Menu_No"
                :to="thirdMenu.URL"
                link
                class="third-level-item"
              >
                <v-list-item-title class="full-text text-small">
                  {{ thirdMenu.Menu_Name }}
                </v-list-item-title>
              </v-list-item>
            </v-list-group>

            <!-- ชั้น 2 ที่ไม่มีลูกต่อ → ให้หน้าตาเหมือน Testing Result -->
            <v-list-item
              v-else
              :value="subMenuItem.Menu_No"
              :to="subMenuItem.URL"
              link
            >
              <v-list-item-title class="full-text text-small">
                {{ subMenuItem.Menu_Name }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-group>

        <!-- main menu มี URL -->
        <v-list-item
          v-else
          :to="menuItem.URL"
          link
          :prepend-icon="
            menuItem.Menu_Icon === null ? 'mdi-form-select' : menuItem.Menu_Icon
          "
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-icon
                color="primary"
                :icon="
                  menuItem.Menu_Icon === null
                    ? 'mdi-form-select'
                    : menuItem.Menu_Icon
                "
              ></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ menuItem.Menu_Name }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import * as api from "@/api/common-master/auth";

const drawer = ref(true);
const open = ref([]);

const authStore = useAuthStore();
const appStore = useAppStore();

onMounted(() => {
  if (authStore.isLoggedIn) {
    api.getMenuPermissionByUserId().then((res) => {
      authStore.setPermission(res.data);
    });
  }
});

watch(
  () => authStore.isLoggedIn,
  (value) => {
    if (value) {
      api.getMenuPermissionByUserId().then((res) => {
        authStore.setPermission(res.data);
      });
    } else {
      authStore.setPermission([]);
    }
  }
);

const allMenu = computed(() => {
  return authStore.permission == null
    ? []
    : authStore.permission.slice().sort((a, b) => a.Menu_Seq - b.Menu_Seq);
});

const mainMenu = computed(() => {
  const menus = authStore.permission ?? [];
  return menus.filter((menu) => menu.IS_MainMenu === "Main Menu");
});

// children helper
const childrenOf = (menuNo) =>
  allMenu.value.filter((menu) => menu.Menu_Group === menuNo);

const hasChildren = (menuNo) =>
  allMenu.value.some((menu) => menu.Menu_Group === menuNo);

const miniMenu = computed(() => appStore.minimalMenu);
</script>

<style scoped>
/* ให้ทุกชั้นแสดงเต็ม ไม่ตัดเป็น … */
.full-text {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  display: block !important;
  line-height: 1.35;
}

/* ฟอนต์เล็กเฉพาะเมนูที่เป็นใบสุดท้าย (ไม่มี sub ต่อ) */
.text-small {
  font-size: 0.85rem !important;
  color: gray;
}

/* ปรับ indent ของเมนูชั้นที่ 3 ให้เข้ามานิดเดียว */
.third-level-item {
  padding-inline-start: 82px !important; /* ปรับเลขนี้ได้ตามชอบ */
}
</style>
