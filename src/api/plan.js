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
