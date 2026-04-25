// ── GET ALL ORDERS (with optional date filter) ────────────────────

const API_BASE = "http://localhost:5194/api";
export const getOrders = async ({ date = null } = {}) => {

  // If no date provided, use today's date
  if (!date) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
  } else {
  }

  try {
    const res = await fetch("http://localhost:5194/api/order", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }); 
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

// ── GET SINGLE ORDER ────────────────────────────────────────────
export const getOrderById = async (id) => {
  try {
    const res = await fetch(`http://localhost:5194/api/order/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
};

// ── UPDATE ORDER ────────────────────────────────────────────────────
export const updateOrder = async (id, updatedData) => {
  try {
    const res = await fetch(`http://localhost:5194/api/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to update order:", error);
    return null;
  }
};

// ── SOFT DELETE ORDER ────────────────────────────────────────────
export const softDeleteOrder = async (id) => {
  try {
    const res = await fetch(`http://localhost:5194/api/order/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return true; // ← 204 has no body, just return true
  } catch (error) {
    console.error("Failed to delete order:", error);
    return false;
  }
};

// ── RESTORE ORDER ───────────────────────────────────────────────
export const restoreOrder = async (id) => {
  try {
    const res = await fetch(`http://localhost:5194/api/order/${id}/restore`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to restore order:", error);
    return null;
  }
};
// ── MARK ORDERS AS PRINTED ──────────────────────────────────────
export const markOrdersAsPrinted = async (orderIds) => {
  try {
    const res = await fetch("http://localhost:5194/api/order/mark-printed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify(orderIds),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to mark orders as printed:", error);
    return null;
  }
};

// ── TOGGLE SINGLE ORDER PRINT STATUS ───────────────────────────
export const toggleOrderPrinted = async (id, isPrinted) => {
  try {
    const res = await fetch(`http://localhost:5194/api/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ isPrinted }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to toggle print status:", error);
    return null;
  }
};
