// File: userLoginApi.js
import api from "./client";

export const loginEncoder = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const loginAdmin = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};