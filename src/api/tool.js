import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/tool/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (machineNo, processCd, id) => {
  try {
    const response = await axios.get(`/tool/getById/${machineNo}/${processCd}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data) => {
  try {
    const response = await axios.post(`/tool/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/tool/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/tool/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reset = async (data) => {
  try {
    const response = await axios.post(`/tool/reset`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
