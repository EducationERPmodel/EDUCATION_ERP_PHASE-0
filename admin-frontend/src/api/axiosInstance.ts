// @ts-nocheck
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { getToken } from './tokenStore';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((requestConfig) => {
  const token = getToken();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message
      || error.message
      || 'Something went wrong. Please try again.';
    const details = error.response?.data?.details || null;
    return Promise.reject({ message, details, status: error.response?.status });
  },
);

export default axiosInstance;
