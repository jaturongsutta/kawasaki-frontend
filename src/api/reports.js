import axios from "@/utils/axios";
export const findbyReportType = async (key) => {
  return await axios.get(`/co-config-reports/findbyReportType/${key}`);
};

// Export Efficiency Report Excel
export const exportEfficiencyReport = async ({ lineCd, month, year }) => {
  const url = `/report-efficiency-oper/export?Line_CD=${encodeURIComponent(
    lineCd
  )}&Date_Month=${month}&Date_Year=${year}`;
  const response = await axios.get(url, {
    responseType: "blob",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  return response;
};

export const getMachine = async (data) => {
  try {
    const response = await axios.get(`/report-cyh-leak-test/machine`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWorktype = async (data) => {
  try {
    const response = await axios.get(`/report-cyh-leak-test/worktype`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchCYHTestingResult = async (data) => {
  try {
    const response = await axios.post(`/report-cyh-leak-test/search-testing-result`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchCYHTestingResultSummary = async (data) => {
  try {
    const response = await axios.post(`/report-cyh-leak-test/search-testing-result-summary`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchMachineTracking = async (data) => {
  try {
    const response = await axios.post(`/report-cyh-leak-test/search-machine-tracking`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const exportCYHTestingResultReport = async (data) => {
  const response = await axios.post('/report-cyh-leak-test/export', data, {
    responseType: "blob",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  return response;
};

export const exportCYHTestingResultSummaryReport = async (data) => {
  const response = await axios.post('/report-cyh-leak-test/export-testing-result-summary', data, {
    responseType: "blob",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  return response;
};

export const exportCYHMachineTrackingReport = async (data) => {
  const response = await axios.post('/report-cyh-leak-test/export-machine-tracking', data, {
    responseType: "blob",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  return response;
};