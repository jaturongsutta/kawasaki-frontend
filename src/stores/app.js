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
    storage: localStorage, // data in localStorage persists even after the browser is closed and reopened.
  },
});
