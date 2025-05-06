import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/ng/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLineList = async (id) => {
  try {
    const response = await axios.get(`/ng/lineList`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStatusList = async (id) => {
  try {
    const response = await axios.get(`/ng/statusList`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReasonList = async (id) => {
  try {
    const response = await axios.get(`/ng/reasonList`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLineModelList = async (id) => {
  try {
    const response = await axios.get(`/ng/lineModelList/${id}`);
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
