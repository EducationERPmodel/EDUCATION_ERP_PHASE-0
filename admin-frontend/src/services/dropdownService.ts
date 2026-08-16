// @ts-nocheck
import axiosInstance from '../api/axiosInstance';

export const fetchDropdown = async (type) => {
  const response = await axiosInstance.get(`/dropdown/${type}`);
  return response.data; // array of { id, name }
};
