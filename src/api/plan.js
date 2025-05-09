import axios from "@/utils/axios";

export const getPalnListCurrent = async (line) => {
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
  const response = await axios.get(`/plan/line-model/${line}`);
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
