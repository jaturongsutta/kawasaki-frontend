import axios from "@/utils/axios";
import { DateTime } from "luxon";

export const getPalnListCurrent = async (line) => {
  // line = encodeURIComponent(line); // Encode parameter for case # 'CYH#6'
  const response = await axios.get(`/plan/plan-list-current/${line}`);
  return response.data;
};

export const search = async (data) => {
  const response = await axios.post(`/plan/search`, data);
  return response.data;
};

export const stopPlan = async (id) => {
  const response = await axios.put(`/plan/stop-plan/${id}`, {});
  return response.data;
};

export const getWorkingTimeAll = async () => {
  const response = await axios.get(`/plan/working-time-all`);
  return response.data;
};

export const getLineModel = async (line) => {
  // line = encodeURIComponent(line); // Encode parameter for case # 'CYH#6'
  const response = await axios.get(`/plan/line-model/${line}`);
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await axios.get(`/plan/${id}`);
  return response.data;
};

export const getProductData = async (id) => {
  const response = await axios.get(`/plan/product-data/${id}`);
  return response.data;
};

export const getProductDataById = async (id) => {
  const response = await axios.get(`/plan/product-data-by-id/${id}`);
  return response.data;
};

export const newPlan = async (data) => {
  const response = await axios.post(`/plan/new-plan`, data);
  return response.data;
};

export const updatePlan = async (id, data) => {
  const response = await axios.put(`/plan/update-plan/${id}`, data);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await axios.delete(`/plan/delete-plan/${id}`);
  return response.data;
};

export const updateProductionData = async (id, data) => {
  const response = await axios.put(`/plan/update-production-data/${id}`, data);
  return response.data;
};

export const confirmList = async (data) => {
  const payload = {
    confirmList: data,
  };
  const response = await axios.post(`/plan/confirm-list`, payload);
  return response.data;
};

export const getPlanAmtAS400 = async (pkCd, partNo, planDate) => {
  const response = await axios.get(
    `/plan/as400-plan-amt/${pkCd}/${partNo}/${planDate}`
  );
  return response.data;
};

// api post data
export const getPlanTotalTime = async (
  lineCd,
  planDate,
  planStartTime,
  planStopTime,
  b1,
  b2,
  b3,
  b4,
  ot
) => {
  // line = encodeURIComponent(line); // Encode parameter for case # 'CYH#6'
  // Convert boolean values to 'Y' or 'N'
  b1 = b1 === "Y" ? "Y" : "N";
  b2 = b2 === "Y" ? "Y" : "N";
  b3 = b3 === "Y" ? "Y" : "N";
  b4 = b4 === "Y" ? "Y" : "N";
  ot = ot === "Y" ? "Y" : "N";
  const response = await axios.post(`/plan/get-plan-total-time`, {
    lineCd,
    planDate,
    planStartTime,
    planStopTime,
    b1,
    b2,
    b3,
    b4,
    ot,
  });
  return response.data;
};

export const validatePlanTimeOverlap = async (
  lineCd,
  planDate,
  planStartTime,
  planStopTime,
  id
) => {
  // lineCd = encodeURIComponent(lineCd); // Encode parameter for case # 'CYH#6'
  // startTime: "YYYY-MM-dd HH:mm:ss"
  // stopTime: "YYYY-MM-dd HH:mm:ss"

  const { start_dt, stop_dt } = getPlanDateTimeWithOvernight2(
    planDate,
    planStartTime,
    planStopTime
  );

  console.log("start_dt", start_dt);
  console.log("stop_dt", stop_dt);

  const response = await axios.post(`/plan/validate-plan-time-overlap`, {
    lineCd,
    planStartTime: start_dt,
    planStopTime: stop_dt,
    id,
  });
  return response.data;
};

export const validatePlanBreakTime = async (
  lineCd,
  planDate,
  planStartTime,
  planStopTime,
  b1,
  b2,
  b3,
  b4,
  ot,
  shiftPeriod,
  id
) => {
  const { start_dt, stop_dt } = getPlanDateTimeWithOvernight2(
    planDate,
    planStartTime,
    planStopTime
  );

  const response = await axios.post(`/plan/validate-plan-break-time`, {
    lineCd,
    planStartTime: start_dt,
    planStopTime: stop_dt,
    b1,
    b2,
    b3,
    b4,
    ot,
    shiftPeriod,
    id,
  });
  return response.data;
};

// /**
//  * Calculate start_dt and stop_dt for plan, handling overnight shift logic.
//  * @param {string} planDate - format 'YYYY-MM-DD'
//  * @param {string} planStartTime - format 'HH:mm:ss'
//  * @param {string} planStopTime - format 'HH:mm:ss'
//  * @returns {{ start_dt: string, stop_dt: string }}
//  */
// export function getPlanDateTimeWithOvernight(
//   planDate,
//   planStartTime,
//   planStopTime
// ) {
//   // ตัดให้เหลือแค่ yyyy-MM-dd
//   const baseDate = planDate.substring(0, 10);

//   let startDate = baseDate;

//   // if planStartTime format i s"08:00" then 08:00:00
//   // if planStopTime format is "08:00" then 08:00:00
//   if (planStartTime.length === 5) {
//     planStartTime = `${planStartTime}:00`;
//   }
//   if (planStopTime.length === 5) {
//     planStopTime = `${planStopTime}:00`;
//   }

//   // Get current date and set time to 23:59:59
//   const endOfDay = DateTime.now()
//     .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
//     .toFormat("yyyy-MM-dd HH:mm:ss");

//   let start_dt = `${baseDate} ${planStartTime}`;
//   let stop_dt = `${baseDate} ${planStopTime}`;

//   // Example output: "2025-06-13 23:59:59"
//   // console.log("endOfDay", endOfDay);
//   // console.log("start_dt", start_dt);
//   // console.log("stop_dt", stop_dt);

//   let stopDate = baseDate;
//   if (start_dt > endOfDay) {
//     startDate = DateTime.fromISO(baseDate).plus({ days: 1 }).toISODate();
//     stopDate = DateTime.fromISO(baseDate).plus({ days: 2 }).toISODate();
//   }

//   start_dt = `${startDate} ${planStartTime}`;
//   stop_dt = `${stopDate} ${planStopTime}`;

//   console.log("start_dt", start_dt);
//   console.log("stop_dt", stop_dt);

//   return { start_dt, stop_dt };
// }

export function getPlanDateTimeWithOvernight2(
  planDate,
  planStartTime,
  planStopTime
) {
  // Ensure time format is HH:mm:ss
  if (planStartTime.length === 5) planStartTime += ":00";
  if (planStopTime.length === 5) planStopTime += ":00";

  const baseDate = planDate.substring(0, 10);

  // Convert time to numbers for easy comparison
  const startTimeNum = Number(planStartTime.replace(/:/g, ""));
  const stopTimeNum = Number(planStopTime.replace(/:/g, ""));

  // console.log("startTimeNum", startTimeNum);
  // console.log("stopTimeNum", stopTimeNum);

  let start_dt, stop_dt;

  // Case 1: กะเช้า (08:00-20:00) หรือ Case 2: กะดึกภายในวัน (20:00-00:00)
  if (
    (startTimeNum >= 80000 &&
      startTimeNum < 200000 &&
      stopTimeNum > startTimeNum) || // 08:00-20:00
    (startTimeNum >= 200000 &&
      startTimeNum < 240000 &&
      stopTimeNum > startTimeNum) // 20:00-00:00
  ) {
    console.log("Case 1 or Case 2");
    start_dt = `${baseDate} ${planStartTime}`;
    stop_dt = `${baseDate} ${planStopTime}`;
  }
  // Case 3: กะดึกข้ามวัน (20:00-08:00)
  else if (
    (startTimeNum >= 200000 && stopTimeNum <= 80000) ||
    (startTimeNum >= 200000 && stopTimeNum < startTimeNum)
  ) {
    console.log("Case 3");
    start_dt = `${baseDate} ${planStartTime}`;
    const nextDate = DateTime.fromISO(baseDate).plus({ days: 1 }).toISODate();
    stop_dt = `${nextDate} ${planStopTime}`;
  }
  // Case 4: กะดึกเช้าวันรุ่งขึ้น (00:00-08:00)
  else if (startTimeNum < 80000 && stopTimeNum <= 80000) {
    console.log("Case 4");
    const nextDate = DateTime.fromISO(baseDate).plus({ days: 1 }).toISODate();
    start_dt = `${nextDate} ${planStartTime}`;
    stop_dt = `${nextDate} ${planStopTime}`;
  }
  // Default fallback
  else {
    console.log("else");
    start_dt = `${baseDate} ${planStartTime}`;
    stop_dt = `${baseDate} ${planStopTime}`;
  }

  return { start_dt, stop_dt };
}

export const getDefaultStopTime = async (shiftPeriod) => {
  const response = await axios.get(`/plan/default-stop-time/${shiftPeriod}`);
  return response.data;
};
