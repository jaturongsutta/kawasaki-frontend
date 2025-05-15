// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    minimalMenu: false,
  }),
  actions: {
    toggleMenu() {
      this.minimalMenu = !this.minimalMenu;
    },
  },
  persist: {
    enabled: true, // เปิดใช้งานการบันทึกสถานะ
    strategies: [
      {
        key: "app", // ชื่อคีย์ใน localStorage
        storage: localStorage, // ใช้ localStorage
      },
    ],
  },
});
