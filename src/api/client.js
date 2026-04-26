// File name: client.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://amiss-occupancy-demanding.ngrok-free.dev/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", 
  },
});

export default api;
// baseURL: "http://localhost:5194/api",
