import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/line/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await axios.get(`/line/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProcessByModelCd = async (lineCd, modelCd) => {
  try {
    const response = await axios.get(
      `/line/getProcessByModel/${lineCd}/${modelCd}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTool = async (lineCd, modelCd, processCd) => {
  try {
    const response = await axios.get(
      `/line/getTool/${lineCd}/${modelCd}/${processCd}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get tool all data
export const getToolAll = async () => {
  try {
    const response = await axios.get(`/line/getToolAll`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data) => {
  try {
    const response = await axios.post(`/line/add`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/line/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/line/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
