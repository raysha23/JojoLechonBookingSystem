// ── GET ALL ORDERS (with optional date filter) ────────────────────
export const getOrders = async ({ date = null } = {}) => {
  const apiUrl = new URL("http://localhost:5194/api/order");

  // If no date provided, use today's date
  if (!date) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    apiUrl.searchParams.append("date", `${year}-${month}-${day}`);
  } else {
    apiUrl.searchParams.append("date", date);
  }

  try {
    const res = await fetch(apiUrl.toString(), {
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
