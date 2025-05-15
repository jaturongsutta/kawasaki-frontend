import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/information-alert/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await axios.get(`/information-alert/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data) => {
  try {
    const response = await axios.post(`/information-alert/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/information-alert/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/information-alert/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
