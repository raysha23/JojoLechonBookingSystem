import api from "./client";
export const getMyBookings = async ({ encoderId, date = null } = {}) => {
  try {
    const params = { encoderId };
    if (date) params.date = date;
    const res = await api.get("/order/my-bookings", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch my bookings:", error);
    return [];
  }
};