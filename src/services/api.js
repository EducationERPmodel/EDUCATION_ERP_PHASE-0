import axios from 'axios';

// PC's current LAN IP — run `ipconfig` on Windows if you switch Wi-Fi.
const api = axios.create({
  baseURL: 'http://192.168.1.11:5001',
  timeout: 15000,
});

export default api;
