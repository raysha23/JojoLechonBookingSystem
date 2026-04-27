//File name: productApi.js
import api from "./client";

export const getProductsByType = async (productTypeId) => {
  const res = await api.get("/products", {
    params: { productTypeId },
  });

  return res.data;
};

export const getDishes = async () => {
  const res = await api.get("/products/dishes");
  return res.data;
};
