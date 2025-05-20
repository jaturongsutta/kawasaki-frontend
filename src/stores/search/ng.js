// Utilities
import { defineStore } from "pinia";

export const usePageState = defineStore("ng-search", {
  state: () => ({
    line: null,
    dateFrom: null,
    dateTo: null,
    model: null,
    reason: null,
    status: null,
  }),
  actions: {
    setSearchData(data) {
      this.line = data.lineCd;
      this.dateFrom = data.dateFrom;
      this.dateTo = data.dateTo;
      this.model = data.modelCd;
      this.reason = data.reasonCd;
      this.status = data.statusCd;
    },
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },
});
