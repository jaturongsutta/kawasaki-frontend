import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/line-stop/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchPlan = async (data) => {
  try {
    const response = await axios.post(`/line-stop/searchPlan`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await axios.get(`/line-stop/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMachineDDL = async (id) => {
  try {
    const response = await axios.get(`/line-stop/machineDDL/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const add = async (data) => {
  try {
    const response = await axios.post(`/line-stop/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addFromPLC = async (data) => {
  try {
    const response = await axios.post(`/line-stop/add-plc`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/line-stop/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/line-stop/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
