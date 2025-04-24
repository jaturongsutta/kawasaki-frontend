import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/model/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await axios.get(`/model/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data) => {
  try {
    const response = await axios.post(`/model/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/model/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/model/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
