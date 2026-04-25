//File name: productApi.js
import api from "./client";

export const getProductsByType = async (productTypeName) => {
  const res = await api.get("/products", { params: { productTypeName } });
  return res.data;
};

export const getDishes = async () => {
  const res = await api.get("/products/dishes");
  return res.data;
};
    