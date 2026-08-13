import axios from 'axios';

// PC's current LAN IP — run `ipconfig` if you switch Wi-Fi networks.
const api = axios.create({
  baseURL: 'http://192.168.1.2:5001',
  timeout: 15000,
});

export default api;
