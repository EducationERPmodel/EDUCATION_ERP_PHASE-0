import axios from 'axios';

// PC hostname: DESKTOP-88R4CJ6
// Current LAN IP: 10.17.66.15
// Update IP if you switch networks (run `ipconfig` to find new IP)
const api = axios.create({
  baseURL: 'http://10.246.201.15:5001',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
