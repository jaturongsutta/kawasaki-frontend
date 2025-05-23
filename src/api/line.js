import axios from "@/utils/axios";
export const search = async (data) => {
  try {
    const response = await axios.post(`/line/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (line) => {
  try {
    line = encodeURIComponent(line); // Encode parameter for case # 'CYH#6'
    const response = await axios.get(`/line/getById/${line}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProcessByModelCd = async (lineCd, modelCd) => {
  try {
    lineCd = encodeURIComponent(lineCd); // Encode parameter for case # 'CYH#6'
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
    lineCd = encodeURIComponent(lineCd); // Encode parameter for case # 'CYH#6'
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
    id = encodeURIComponent(id); // Encode parameter for case # 'CYH#6'
    const response = await axios.put(`/line/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const remove = async (id) => {
  try {
    id = encodeURIComponent(id); // Encode parameter for case # 'CYH#6'
    const response = await axios.delete(`/line/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteModel = async (lineCd, modelCd) => {
  lineCd = encodeURIComponent(lineCd); // Encode parameter for case # 'CYH#6'
  const response = await axios.delete(
    `/line/delete-line-model/${lineCd}/${modelCd}`
  );
  return response.data;
};
