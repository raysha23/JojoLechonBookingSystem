import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getOrders,
  softDeleteOrder,
  restoreOrder,
  updateOrder,
} from "../services/orderServices.jsx";

const EXTRA_DISH_PRICE = 700;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);

  const fmt = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const loadBookings = async () => {
    const data = await getOrders({ showDeleted });
    setBookings(data);
  };

  useEffect(() => {
    loadBookings();
  }, [showDeleted]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleDelete = async () => {
    await softDeleteOrder(deleteTarget.id);
    setDeleteTarget(null);
    loadBookings();
  };

  const handleRestore = async () => {
    await restoreOrder(restoreTarget.id);
    setRestoreTarget(null);
    loadBookings();
  };

  const handleUpdate = async (updatedData) => {
    await updateOrder(editingBooking.id, updatedData);
    setEditingBooking(null);
    loadBookings();
  };

  const filtered = bookings.filter(
    (b) =>
      b.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.product?.productName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOPBAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none">
                Jojo Lechon
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Admin Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Bookings"
            value={bookings.length}
            color="blue"
          />
          <StatCard
            label="Active"
            value={bookings.filter((b) => !b.deletedAt).length}
            color="green"
          />
          <StatCard
            label="Deleted"
            value={bookings.filter((b) => b.deletedAt).length}
            color="red"
          />
          <StatCard
            label="GCash Orders"
            value={bookings.filter((b) => b.payment.method === "gcash").length}
            color="purple"
          />
        </div>

        {/* TOOLBAR */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* SEARCH */}
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name, ID, or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            {/* TOGGLE DELETED */}
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                showDeleted
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {showDeleted ? "Showing Deleted" : "Show Deleted"}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Payment
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Total
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <p className="text-gray-400 font-bold text-sm">
                        No bookings found
                      </p>
                      <p className="text-gray-300 text-xs mt-1">
                        Try adjusting your search or filter
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((booking) => (
                    <tr
                      key={booking.id}
                      className={`hover:bg-gray-50/50 transition-colors ${booking.deletedAt ? "opacity-50" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {booking.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-800">
                          {booking.customer.name}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {booking.customer.contacts[0]}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-700 max-w-[180px] truncate">
                          {booking.product?.productName || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-600">
                          {booking.order.deliveryDate || "—"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {booking.order.deliveryTime}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            booking.order.orderType === "delivery"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {booking.order.orderType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            booking.payment.method === "gcash"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {booking.payment.method === "gcash" ? "GCash" : "COD"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-800">
                          {fmt(booking.payment.total)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* VIEW */}
                          <ActionButton
                            onClick={() => setSelectedBooking(booking)}
                            color="gray"
                            title="View"
                            icon="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />

                          {booking.deletedAt ? (
                            /* RESTORE */
                            <ActionButton
                              onClick={() => setRestoreTarget(booking)}
                              color="green"
                              title="Restore"
                              icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          ) : (
                            <>
                              {/* EDIT */}
                              <ActionButton
                                onClick={() => setEditingBooking(booking)}
                                color="blue"
                                title="Edit"
                                icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                              {/* DELETE */}
                              <ActionButton
                                onClick={() => setDeleteTarget(booking)}
                                color="red"
                                title="Delete"
                                icon="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs font-bold text-gray-400">
              Showing {filtered.length} of {bookings.length}{" "}
              {showDeleted ? "deleted" : "active"} bookings
            </p>
          </div>
        </div>
      </main>

      {/* ── MODALS ─────────────────────────────────────────────────── */}
      {selectedBooking && (
        <ViewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          fmt={fmt}
          formatDate={formatDate}
        />
      )}
      {editingBooking && (
        <EditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleUpdate}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Booking"
          message={`Are you sure you want to delete the booking for "${deleteTarget.customer.name}"? This can be restored later.`}
          confirmLabel="Delete"
          confirmColor="red"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {restoreTarget && (
        <ConfirmModal
          title="Restore Booking"
          message={`Restore the booking for "${restoreTarget.customer.name}"?`}
          confirmLabel="Restore"
          confirmColor="green"
          onConfirm={handleRestore}
          onCancel={() => setRestoreTarget(null)}
        />
      )}
    </div>
  );
}

/* ── STAT CARD ──────────────────────────────────────────────────── */
function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className={`text-3xl font-black ${colors[color].split(" ")[1]}`}>
        {value}
      </p>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}

/* ── ACTION BUTTON ──────────────────────────────────────────────── */
function ActionButton({ onClick, color, title, icon }) {
  const colors = {
    gray: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    blue: "bg-blue-50 text-blue-500 hover:bg-blue-100",
    red: "bg-red-50 text-red-500 hover:bg-red-100",
    green: "bg-emerald-50 text-emerald-500 hover:bg-emerald-100",
  };
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${colors[color]}`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={icon}
        />
      </svg>
    </button>
  );
}

/* ── VIEW MODAL ─────────────────────────────────────────────────── */
function ViewModal({ booking, onClose, fmt, formatDate }) {
  const extraDishes = booking.dishes?.extra?.filter(Boolean) || [];
  const extraTotal = extraDishes.length * EXTRA_DISH_PRICE;
  const discount = Math.abs(Number(booking.product?.promoAmount || 0));

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Booking Details"
        subtitle={booking.id}
        onClose={onClose}
      />
      <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
        <Section title="Customer" icon="👤">
          <Row label="Name" value={booking.customer.name} />
          <Row label="Contact" value={booking.customer.contacts.join(", ")} />
          {booking.customer.facebookProfile && (
            <Row label="Facebook" value={booking.customer.facebookProfile} />
          )}
        </Section>
        <Section title="Delivery" icon="🚚">
          <Row label="Type" value={booking.order.orderType} highlight />
          <Row label="Date" value={booking.order.deliveryDate} />
          <Row label="Time" value={booking.order.deliveryTime} />
          {booking.order.orderType === "delivery" && (
            <>
              <Row label="Address" value={booking.order.address} />
              <Row label="Zone" value={booking.order.zone} />
            </>
          )}
        </Section>
        <Section title="Order" icon="🍖">
          <Row label="Product" value={booking.product?.productName} />
          <Row
            label="Required Dishes"
            value={booking.dishes?.required?.join(", ") || "—"}
          />
          {extraDishes.length > 0 && (
            <Row label="Extra Dishes" value={extraDishes.join(", ")} />
          )}
        </Section>
        <Section title="Pricing" icon="💰">
          <Row label="Product" value={fmt(booking.product?.amount || 0)} />
          {extraDishes.length > 0 && (
            <Row label="Extra Dishes" value={fmt(extraTotal)} />
          )}
          {discount > 0 && (
            <Row label="Discount" value={`-${fmt(discount)}`} green />
          )}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-1">
            <span className="text-sm font-black text-gray-800">Total</span>
            <span className="text-base font-black text-red-600">
              {fmt(booking.payment.total)}
            </span>
          </div>
        </Section>
        <Section title="Payment" icon="💳">
          <Row
            label="Method"
            value={
              booking.payment.method === "gcash"
                ? "📱 GCash"
                : "💵 Cash on Delivery"
            }
          />
        </Section>
        <p className="text-[10px] text-gray-300 font-medium text-center">
          Booked on {formatDate(booking.createdAt)}
          {booking.deletedAt &&
            ` · Deleted on ${formatDate(booking.deletedAt)}`}
        </p>
      </div>
    </Modal>
  );
}

/* ── EDIT MODAL ─────────────────────────────────────────────────── */
function EditModal({ booking, onClose, onSave }) {
  const [form, setForm] = useState({
    customerName: booking.customer.name,
    contact: booking.customer.contacts[0] || "",
    facebookProfile: booking.customer.facebookProfile || "",
    deliveryDate: booking.order.deliveryDate,
    deliveryTime: booking.order.deliveryTime,
    address: booking.order.address,
    zone: booking.order.zone,
    paymentMethod: booking.payment.method,
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    onSave({
      customer: {
        ...booking.customer,
        name: form.customerName,
        contacts: [form.contact],
        facebookProfile: form.facebookProfile,
      },
      order: {
        ...booking.order,
        deliveryDate: form.deliveryDate,
        deliveryTime: form.deliveryTime,
        address: form.address,
        zone: form.zone,
      },
      payment: { ...booking.payment, method: form.paymentMethod },
    });
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Edit Booking"
        subtitle={booking.id}
        onClose={onClose}
      />
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <EditField
          label="Customer Name"
          value={form.customerName}
          onChange={(v) => set("customerName", v)}
        />
        <EditField
          label="Contact"
          value={form.contact}
          onChange={(v) => set("contact", v)}
        />
        <EditField
          label="Facebook Profile"
          value={form.facebookProfile}
          onChange={(v) => set("facebookProfile", v)}
        />
        <EditField
          label="Delivery Date"
          value={form.deliveryDate}
          onChange={(v) => set("deliveryDate", v)}
          type="date"
        />
        <EditField
          label="Delivery Time"
          value={form.deliveryTime}
          onChange={(v) => set("deliveryTime", v)}
        />
        <EditField
          label="Address"
          value={form.address}
          onChange={(v) => set("address", v)}
        />
        <EditField
          label="Zone"
          value={form.zone}
          onChange={(v) => set("zone", v)}
        />
        <div>
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
            Payment Method
          </label>
          <select
            value={form.paymentMethod}
            onChange={(e) => set("paymentMethod", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="gcash">GCash</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

/* ── CONFIRM MODAL ──────────────────────────────────────────────── */
function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}) {
  const colors = {
    red: "bg-red-600 hover:bg-red-700 shadow-red-100",
    green: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100",
  };
  return (
    <Modal onClose={onCancel}>
      <div className="p-8 text-center">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${confirmColor === "red" ? "bg-red-50" : "bg-emerald-50"}`}
        >
          <svg
            className={`w-7 h-7 ${confirmColor === "red" ? "text-red-500" : "text-emerald-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                confirmColor === "red"
                  ? "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  : "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              }
            />
          </svg>
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 font-medium mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white font-black text-sm transition-all shadow-lg ${colors[confirmColor]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── SHARED MODAL SHELL ─────────────────────────────────────────── */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700" />
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400 font-bold">{subtitle}</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {title}
        </p>
      </div>
      <div className="bg-gray-50 rounded-2xl px-4 py-1">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight = false, green = false }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-bold text-gray-400">{label}</span>
      <span
        className={`text-xs font-black px-2 py-0.5 rounded-lg max-w-[55%] text-right ${
          green
            ? "text-emerald-600 bg-emerald-50"
            : highlight
              ? "text-red-600 bg-red-50"
              : "text-gray-700 bg-white border border-gray-100"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function EditField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500 transition-all"
      />
    </div>
  );
}
