//File name: client.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5194/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
