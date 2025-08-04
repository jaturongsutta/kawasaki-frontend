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
