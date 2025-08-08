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
    `/predefine-item-process/${prevItem.processCd}/${prevItem.predefineItemCd}/${prevItem.machineNo}`,
    data
  );
};

export const getById = async (processCd, predefineItemCd, machineNo) => {
  return await axios.get(
    `/predefine-item-process/${processCd}/${predefineItemCd}/${machineNo}`
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

export const exportPdf = async (data) => {
  try {
    const response = await axios.post(`/predefine-item-process/export`, data, {
      responseType: "blob", // Important for handling binary data
      headers: {
        Accept: "application/pdf",
      },
    });

    // Create blob URL for the PDF
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create temporary link to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = `Export-${data.lineCd}-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: "PDF exported successfully" };
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
};
