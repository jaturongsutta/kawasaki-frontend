import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/machine/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (machineNo, processCd) => {
  try {
    const response = await axios.get(`/machine/getById/${machineNo}/${processCd}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data) => {
  try {
    const response = await axios.post(`/machine/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (machineNo, processCd, data) => {
  try {
    const response = await axios.put(`/machine/update/${machineNo}/${processCd}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/machine/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
