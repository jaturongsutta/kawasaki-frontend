import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/ng/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchPlan = async (data) => {
  try {
    const response = await axios.post(`/ng/searchPlan`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await axios.get(`/ng/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data) => {
  try {
    const response = await axios.post(`/ng/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/ng/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/ng/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
