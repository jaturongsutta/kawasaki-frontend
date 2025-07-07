import axios from "@/utils/axios";

export const search = async (data) => {
  try {
    const response = await axios.post(`/predefine-item-process/search`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveAdd = async (data) => {
  return await axios.post(`/predefine-item-process`, data);
};

export const saveEdit = async (prevItem, data) => {
  return await axios.put(
    `/predefine-item-process/${prevItem.processCd}/${prevItem.predefineItemCd}`,
    data
  );
};

export const getById = async (processCd, predefineItemCd) => {
  return await axios.get(
    `/predefine-item-process/${processCd}/${predefineItemCd}`
  );
};

export const getDropDownPredefindGroup = async () => {
  try {
    const { data } = await axios.get(
      `predefine-item-process/get-dropdown-predefine-group`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDropDownPredefind = async () => {
  try {
    const { data } = await axios.get(
      `predefine-item-process/get-dropdown-predefine`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDropDownPredefindItem = async (group, predefineCd) => {
  try {
    const { data } = await axios.get(
      `predefine-item-process/get-dropdown-predefine-item/${group}/${predefineCd}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDropDownMachineProcess = async () => {
  try {
    const { data } = await axios.get(
      `predefine-item-process/get-dropdown-machine-process`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
