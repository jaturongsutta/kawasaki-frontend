// Utilities
import { defineStore } from "pinia";

export const usePageState = defineStore("master-machine-search", {
  state: () => ({
    machineNo: null,
    processCd: null,
    status: null,
  }),
  actions: {
    setSearchData(data) {
      this.machineNo = data.machine_no;
      this.processCd = data.process_cd;
      this.status = data.status;
    },
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },
});
