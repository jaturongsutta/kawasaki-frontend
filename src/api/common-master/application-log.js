import axios from "@/utils/axios";

export const search = async () => {
  const response = await axios.post(`/application-log/search`, {});
  return response.data;
};

export const getContentLog = async (type, filename) => {
  const response = await axios.get(
    `/application-log/content-log/${filename}/${type}`
  );
  return response.data;
};

export const getTime = async () => {
  const response = await axios.get(`/batch-job/time`);
  return response.data;
};
