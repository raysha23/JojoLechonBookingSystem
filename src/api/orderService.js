import api from "./client";

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── GET ALL ORDERS (with optional date filter) ────────────────────
export const getOrders = async ({ date = null } = {}) => {
  try {
    const params = {};
    if (date) params.date = date;
    const res = await api.get("/order", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

// ── GET SINGLE ORDER ──────────────────────────────────────────────
export const getOrderById = async (id) => {
  try {
    const res = await api.get(`/order/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
};

// ── CREATE ORDER ──────────────────────────────────────────────────
export const createOrder = async (payload) => {
  try {
    const res = await api.post("/order", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    return null;
  }
};

// ── UPDATE ORDER ──────────────────────────────────────────────────
export const updateOrder = async (id, updatedData) => {
  try {
    const res = await api.patch(`/order/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Failed to update order:", error);
    return null;
  }
};

// ── SOFT DELETE ORDER ─────────────────────────────────────────────
export const softDeleteOrder = async (id) => {
  try {
    await api.delete(`/order/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete order:", error);
    return false;
  }
};

// ── RESTORE ORDER ─────────────────────────────────────────────────
export const restoreOrder = async (id) => {
  try {
    const res = await api.post(`/order/${id}/restore`);
    return res.data;
  } catch (error) {
    console.error("Failed to restore order:", error);
    return null;
  }
};

// ── MARK ORDERS AS PRINTED ────────────────────────────────────────
export const markOrdersAsPrinted = async (orderIds) => {
  try {
    const res = await api.post("/order/mark-printed", orderIds);
    return res.data;
  } catch (error) {
    console.error("Failed to mark orders as printed:", error);
    return null;
  }
};

// ── TOGGLE SINGLE ORDER PRINT STATUS ─────────────────────────────
export const toggleOrderPrinted = async (id, isPrinted) => {
  try {
    const res = await api.patch(`/order/${id}/print-status`, { isPrinted });
    return res.data;
  } catch (error) {
    console.error("Failed to toggle print status:", error);
    return null;
  }
};
