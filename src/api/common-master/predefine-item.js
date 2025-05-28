import axios from "@/utils/axios";

export const search = async (data) => {
  try {
    const response = await axios.post(`/predefine-item/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveAdd = async (data) => {
  return await axios.post(`/predefine-item`, data);
};

export const saveEdit = async (data) => {
  return await axios.put(
    `/predefine-item/${data.predefineGroup}/${data.currentPredefineCd}/${data.predefineItemCd}`,
    data
  );
};

export const getById = async (predefineGroup, predefineCd, predefineItemCd) => {
  return await axios.get(
    `/predefine-item/${predefineGroup}/${predefineCd}/${predefineItemCd}`
  );
};
