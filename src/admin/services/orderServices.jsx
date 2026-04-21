import { mockBookings } from "../data/mockBookings.js";
// In-memory store so edits/deletes persist during the session
let bookings = [...mockBookings];

// ── GET ALL ────────────────────────────────────────────────────────
export const getOrders = async ({ showDeleted = false } = {}) => {
  return bookings.filter((b) =>
    showDeleted ? b.deletedAt !== null : b.deletedAt === null,
  );
};

// ── GET SINGLE ────────────────────────────────────────────────────
export const getOrderById = async (id) => {
  return bookings.find((b) => b.id === id) || null;
};

// ── UPDATE ────────────────────────────────────────────────────────
export const updateOrder = async (id, updatedData) => {
  bookings = bookings.map((b) => (b.id === id ? { ...b, ...updatedData } : b));
  return bookings.find((b) => b.id === id);
};

// ── SOFT DELETE ───────────────────────────────────────────────────
export const softDeleteOrder = async (id) => {
  bookings = bookings.map((b) =>
    b.id === id ? { ...b, deletedAt: new Date().toISOString() } : b,
  );
};

// ── RESTORE ───────────────────────────────────────────────────────
export const restoreOrder = async (id) => {
  bookings = bookings.map((b) => (b.id === id ? { ...b, deletedAt: null } : b));
};

/*
  ─── WHEN BACKEND IS READY ────────────────────────────────────────
  Replace each function body above with a real fetch call. Example:

  export const getOrders = async ({ showDeleted = false } = {}) => {
    const res = await fetch(`/api/orders?showDeleted=${showDeleted}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    });
    return res.json();
  };
  ──────────────────────────────────────────────────────────────────
*/
