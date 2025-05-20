// Utilities
import { defineStore } from "pinia";

export const usePageState = defineStore("plan-search", {
  state: () => ({
    line: null,
    dateFrom: null,
    dateTo: null,
    lineModel: null,
    status: null,
  }),
  actions: {
    setSearchData(data) {
      this.line = data.line;
      this.dateFrom = data.dateFrom;
      this.dateTo = data.dateTo;
      this.lineModel = data.lineModel;
      this.status = data.status;
    },
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },
});
