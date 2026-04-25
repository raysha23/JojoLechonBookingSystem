// File name: landingApi.js
import api from "./client";

export const getLandingData = async () => {
  const res = await api.get("/products/landing");
  return res.data;
};
