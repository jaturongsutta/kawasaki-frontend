// Utilities
import { defineStore } from "pinia";

export const usePageState = defineStore("line-stop-search", {
  state: () => ({
    line: null,
    process: null,
    type: null,
    dateFrom: null,
    dateTo: null,
    reason: null,
    status: null,
  }),
  actions: {
    setSearchData(data) {
      this.line = data.lineCd;
      this.dateFrom = data.dateFrom;
      this.dateTo = data.dateTo;
      this.process = data.processCd;
      this.reason = data.reasonCd;
      this.type = data.typeCd;
      this.status = data.statusCd;
    },
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },
});
