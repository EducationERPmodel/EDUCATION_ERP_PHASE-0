import axios from 'axios';

// Your PC's LAN IP — phone and PC must be on the same Wi-Fi.
// Run `ipconfig` on Windows to confirm this IP if it ever changes.
const api = axios.create({
  baseURL: 'http://192.168.1.6:5000',
});

export default api;
