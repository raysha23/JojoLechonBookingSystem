import { useState, useEffect } from "react";
import DatePicker from "../../components/datetimepicker/DatePicker.jsx";
import { useNavigate } from "react-router-dom";
import { generateOrderDoc } from "../generateDoc.js";
import api from "../../api/client.js";
import {
  getOrders,
  softDeleteOrder,
  restoreOrder,
  updateOrder,
  markOrdersAsPrinted,
  toggleOrderPrinted,
} from "../../api/orderService.js";
const EXTRA_DISH_PRICE = 700;

// ── HELPERS ───────────────────────────────────────────────────────

const fmt = (n) =>
  "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

function getProcessTime(deliveryTime) {
  if (!deliveryTime) return "—";
  try {
    const [time, meridiem] = deliveryTime.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    hours -= 5;
    if (hours < 0) hours += 24;
    const period = hours >= 12 ? "PM" : "AM";
    const display = hours % 12 === 0 ? 12 : hours % 12;
    return `${display}:${String(minutes).padStart(2, "0")} ${period}`;
  } catch {
    return "—";
  }
}

function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ── MAIN ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [togglePrintTarget, setTogglePrintTarget] = useState(null);
  const [printConfirm, setPrintConfirm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(getToday());
  const [printFilter, setPrintFilter] = useState("all");

  const pigCount = bookings.filter(
    (b) =>
      !b.deletedAt &&
      ["lechon_package", "lechon_only"].includes(b.productTypeName),
  ).length;

  const bellyCount = bookings.filter(
    (b) =>
      !b.deletedAt &&
      ["belly_package", "belly_only"].includes(b.productTypeName),
  ).length;

  const loadBookings = async (date = filterDate) => {
    const data = await getOrders({ date });
    setBookings(data);
  };

  useEffect(() => {
    loadBookings(filterDate);
  }, [filterDate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleDelete = async () => {
    await softDeleteOrder(deleteTarget.id);
    setDeleteTarget(null);
    loadBookings(filterDate);
  };

  const handleRestore = async () => {
    await restoreOrder(restoreTarget.id);
    setRestoreTarget(null);
    loadBookings(filterDate);
  };

  const handleUpdate = async (updatedData) => {
    await updateOrder(editingBooking.id, updatedData);
    setEditingBooking(null);
    loadBookings(filterDate);
  };

  // ── PRINT HANDLER ─────────────────────────────────────────────
  const handlePrintOrders = async () => {
    setPrintConfirm(false);
    const unprintedIds = filtered
      .filter((b) => !b.isPrinted && !b.deletedAt)
      .map((b) => b.id);
    if (unprintedIds.length > 0) {
      await markOrdersAsPrinted(unprintedIds);
      await loadBookings(filterDate);
    }
    await generateOrderDoc(filtered, filterDate); // downloads .docx
  };

  // ── TOGGLE PRINT STATUS (with confirm modal) ──────────────────
  const handleTogglePrinted = async () => {
    await toggleOrderPrinted(
      togglePrintTarget.id,
      !togglePrintTarget.isPrinted,
    );
    setTogglePrintTarget(null);
    loadBookings(filterDate);
  };

  // ── FILTERED LIST ─────────────────────────────────────────────
  const filtered = bookings
    .filter((b) => {
      const matchDeleted = showDeleted ? !!b.deletedAt : !b.deletedAt;
      const matchSearch = search
        ? b.customerName.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchPrint =
        printFilter === "all"
          ? true
          : printFilter === "unprinted"
            ? !b.isPrinted
            : b.isPrinted;
      return matchDeleted && matchSearch && matchPrint;
    })
    .sort((a, b) => parseTime(a.deliveryTime) - parseTime(b.deliveryTime));

  const unprintedCount = bookings.filter(
    (b) => !b.isPrinted && !b.deletedAt,
  ).length;
  const printedCount = bookings.filter(
    (b) => b.isPrinted && !b.deletedAt,
  ).length;
  const grandTotal = filtered.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── TOPBAR ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-xl">🐷</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none">
                Jojo's Lechon
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Admin Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 font-medium hidden sm:block">
              Logged in as{" "}
              <span className="text-gray-700 font-bold">Admin</span>
            </span>
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
        </div>
      </header>

      <main className="w-full px-16 py-8">
        {/* ── PAGE TITLE ── */}
        <div className="mb-8 print:hidden bg-red-600 text-white rounded-2xl px-6 py-5">
          <h2 className="text-2xl font-black">Bookings</h2>
          <p className="text-sm font-medium mt-0.5">
            View and manage all customer orders
          </p>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200/70 shadow-sm p-4 mb-8 print:hidden">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* LEFT */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* SEARCH */}
              <div className="relative flex-1 sm:flex-none min-w-[260px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-400"
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
                </div>
                <input
                  type="text"
                  placeholder="Search customer records..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-300 hover:text-slate-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* DATE */}
              <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200 rounded-xl px-2 py-1">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-transparent px-2 py-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-tight outline-none cursor-pointer"
                />
                {filterDate && filterDate !== getToday() && (
                  <button
                    onClick={() => setFilterDate(getToday())}
                    className="p-1 hover:bg-white rounded-md text-slate-400 hover:text-red-500 transition-all"
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
                        strokeWidth="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {/* PIG & BELLY COUNTS */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
                  <span className="text-base">🐷</span>
                  <div>
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-none">
                      Lechon
                    </p>
                    <p className="text-sm font-black text-red-600 leading-none mt-0.5">
                      {pigCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl">
                  <span className="text-base">🥩</span>
                  <div>
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none">
                      Belly
                    </p>
                    <p className="text-sm font-black text-orange-600 leading-none mt-0.5">
                      {bellyCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
              <div className="hidden xl:flex items-center px-3 py-1 bg-slate-100 rounded-full mr-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "Entry" : "Entries"}
                </span>
              </div>

              {/* TRASH TOGGLE */}
              <button
                onClick={() => setShowDeleted(!showDeleted)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                  showDeleted
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
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
                {showDeleted ? "Viewing Trash" : "Trash"}
              </button>

              {/* PRINT BUTTON */}
              <button
                onClick={() => setPrintConfirm(true)}
                className="flex items-center gap-2.5 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:bg-black transition-all shadow-md active:scale-95"
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
                    strokeWidth="2.5"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Orders
                {filtered.filter((b) => !b.isPrinted && !b.deletedAt).length >
                  0 && (
                  <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {
                      filtered.filter((b) => !b.isPrinted && !b.deletedAt)
                        .length
                    }{" "}
                    new
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── PRINT STATUS TABS ── */}
        <div className="flex items-center gap-2 mb-6 print:hidden">
          <button
            onClick={() => setPrintFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
              printFilter === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            All
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                printFilter === "all"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {bookings.filter((b) => !b.deletedAt).length}
            </span>
          </button>

          <button
            onClick={() => setPrintFilter("unprinted")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
              printFilter === "unprinted"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-500 border-gray-200 hover:bg-red-50 hover:border-red-200"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {unprintedCount > 0 && printFilter !== "unprinted" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  printFilter === "unprinted" ? "bg-white" : "bg-red-500"
                }`}
              />
            </span>
            Not Printed
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                printFilter === "unprinted"
                  ? "bg-white/20 text-white"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {unprintedCount}
            </span>
          </button>

          <button
            onClick={() => setPrintFilter("printed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
              printFilter === "printed"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-500 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200"
            }`}
          >
            ✅ Printed
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                printFilter === "printed"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              {printedCount}
            </span>
          </button>
        </div>

        {/* ── PRINT HEADER ── */}
        <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                Jojo's Lechon
              </h1>
              <p className="text-slate-500 font-bold text-xs tracking-widest uppercase mt-1">
                Master Order Log
              </p>
            </div>
            <div className="text-right">
              {filterDate && (
                <p className="text-sm font-bold text-slate-900">
                  Delivery: {filterDate}
                </p>
              )}
              <p className="text-[10px] text-slate-400 font-medium">
                Generated: {new Date().toLocaleDateString("en-PH")}
              </p>
            </div>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden print:shadow-none print:rounded-none">
          <div
            className="overflow-auto"
            style={{ maxHeight: "calc(100vh - 320px)" }}
          >
            <table className="w-full text-sm print:text-xs border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="border-b-2 border-gray-100 bg-red-600 font-bold text-white">
                  <Th>Delivery Time</Th>
                  <Th>Customer</Th>
                  <Th>Order Type</Th>
                  <Th className="min-w-[450px] whitespace-nowrap">
                    Order Details
                  </Th>
                  <Th>Total Amount</Th>
                  <Th>Process Time</Th>
                  <Th>Location</Th>
                  <Th className="print:hidden">Facebook</Th>
                  <Th>Contact</Th>
                  <Th>Payment</Th>
                  <Th className="print:hidden">Status</Th>
                  <Th className="print-only">Rider</Th>
                  <Th className="print:hidden">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <svg
                          className="w-10 h-10 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <p className="font-bold text-base">
                          {filterDate
                            ? `No bookings for ${filterDate}`
                            : "No bookings found"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      onView={() => setSelectedBooking(booking)}
                      onEdit={() => setEditingBooking(booking)}
                      onDelete={() => setDeleteTarget(booking)}
                      onRestore={() => setRestoreTarget(booking)}
                      onTogglePrinted={() => setTogglePrintTarget(booking)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400">
              Showing {filtered.length} of {bookings.length}{" "}
              {showDeleted ? "deleted" : "active"} bookings
              {filterDate && ` for ${filterDate}`}
            </p>
            {filtered.length > 0 && (
              <p className="text-sm font-black text-gray-700">
                Grand Total:{" "}
                <span className="text-red-600">{fmt(grandTotal)}</span>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}
      {selectedBooking && (
        <ViewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
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
          message={`Delete the booking for "${deleteTarget.customerName}"? This can be restored later.`}
          confirmLabel="Delete"
          confirmColor="red"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {restoreTarget && (
        <ConfirmModal
          title="Restore Booking"
          message={`Restore the booking for "${restoreTarget.customerName}"?`}
          confirmLabel="Restore"
          confirmColor="green"
          onConfirm={handleRestore}
          onCancel={() => setRestoreTarget(null)}
        />
      )}
      {togglePrintTarget && (
        <ConfirmModal
          title={
            togglePrintTarget.isPrinted
              ? "Mark as Not Printed?"
              : "Mark as Printed?"
          }
          message={
            togglePrintTarget.isPrinted
              ? `Remove printed status from "${togglePrintTarget.customerName}"? It will show as a new/rush order again.`
              : `Mark "${togglePrintTarget.customerName}" as printed? This means they've been followed up.`
          }
          confirmLabel={
            togglePrintTarget.isPrinted ? "Mark Not Printed" : "Mark Printed"
          }
          confirmColor={togglePrintTarget.isPrinted ? "red" : "green"}
          onConfirm={handleTogglePrinted}
          onCancel={() => setTogglePrintTarget(null)}
        />
      )}
      {printConfirm && (
        <ConfirmModal
          title="Print Orders"
          message={`Mark ${filtered.filter((b) => !b.isPrinted && !b.deletedAt).length} unprinted orders as printed and open print dialog?`}
          confirmLabel="Print"
          confirmColor="green"
          onConfirm={handlePrintOrders}
          onCancel={() => setPrintConfirm(false)}
          className="print:hidden"
        />
      )}

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .hidden.print\\:block { display: block !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

// ── TABLE HEADER CELL ─────────────────────────────────────────────
function Th({ children, wide, className = "" }) {
  return (
    <th
      className={`px-5 py-4 text-left text-base font-bold text-white uppercase tracking-widest whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}

// ── BOOKING ROW ───────────────────────────────────────────────────
function BookingRow({
  booking,
  onView,
  onEdit,
  onDelete,
  onRestore,
  onTogglePrinted,
}) {
  const extraDishes = booking.dishes?.extra?.filter(Boolean) || [];
  const discount = Math.abs(Number(booking.promoAmount || 0));
  console.log(discount);
  const processTime = getProcessTime(booking.deliveryTime);

  return (
    <tr
      className={`hover:bg-gray-50/80 transition-colors ${booking.deletedAt ? "opacity-40" : ""}`}
    >
      {/* DELIVERY TIME */}
      <td className="px-5 py-4 whitespace-nowrap border border-gray-200">
        <span className="font-black text-gray-800 text-sm">
          {booking.deliveryTime || "—"}
        </span>
      </td>

      {/* CUSTOMER */}
      <td className="px-5 py-4 whitespace-nowrap border border-gray-200">
        <p className="font-black text-gray-900 text-sm">
          {booking.customerName}
        </p>
      </td>

      {/* ORDER TYPE */}
      <td className="px-5 py-4 border border-gray-200">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            booking.orderType === "delivery"
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {booking.orderType === "delivery" ? "Delivery" : "Pickup"}
        </span>
      </td>

      {/* ORDER DETAILS */}
      <td className="px-5 py-4 border border-gray-200">
        <p className="text-base font-black text-gray-900 mb-2">
          {booking.productName || "—"}
        </p>
        {booking.dishes?.required?.filter(Boolean).length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Included Dishes ({booking.dishes.required.length})
            </p>
            <p className="text-sm text-black font-bold leading-relaxed">
              {booking.dishes.required.filter(Boolean).join(" · ")}
            </p>
          </div>
        )}
        {extraDishes.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-1">
              Extra Dishes ({extraDishes.length} × ₱700)
            </p>
            <p className="text-sm text-black font-bold leading-relaxed">
              {extraDishes.join(" · ")}
            </p>
          </div>
        )}
        {booking.freebies?.freebies?.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider mb-1">
              Freebies
            </p>
            <p className="text-sm text-black font-bold leading-relaxed">
              {booking.freebies.freebies.join(" · ")}
            </p>
          </div>
        )}
      </td>

      {/* TOTAL AMOUNT */}
      <td className="px-5 py-4 whitespace-nowrap border border-gray-200">
        <p className="text-base font-black text-gray-900">
          {fmt(booking.totalAmount)}
        </p>
        {discount > 0 && (
          <p className="text-xs text-emerald-500 font-bold mt-0.5">
            -{fmt(discount)} disc.
          </p>
        )}
      </td>

      {/* PROCESS TIME */}
      <td className="px-5 py-4 whitespace-nowrap border border-gray-200">
        <span className="text-sm font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
          {processTime}
        </span>
      </td>

      {/* LOCATION */}
      <td className="px-5 py-4 min-w-[120px] border border-gray-200">
        {booking.orderType === "delivery" ? (
          <div>
            <p className="text-sm text-gray-500">{booking.zone || "—"}</p>
            {booking.address && (
              <p className="text-xs text-black font-bold mt-0.5 max-w-[160px]">
                {booking.address}
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm font-bold text-amber-600">Pickup</span>
        )}
      </td>

      {/* FACEBOOK */}
      <td className="print-hidden px-5 py-4 border border-gray-200">
        {booking.facebookProfile ? (
          <a
            href={booking.facebookProfile}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-blue-500 hover:text-blue-700 hover:underline transition-colors"
          >
            View Profile
          </a>
        ) : (
          <span className="text-gray-300 text-sm">—</span>
        )}
      </td>

      {/* CONTACT */}
      <td className="px-5 py-4 whitespace-nowrap border border-gray-200">
        <p className="text-sm font-bold text-gray-700">
          {booking.contacts?.filter(Boolean).join(", ") || "—"}
        </p>
      </td>

      {/* PAYMENT */}
      <td className="px-5 py-4 whitespace-nowrap border border-gray-200">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            booking.paymentMethod === "gcash"
              ? "bg-blue-50 text-blue-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {booking.paymentMethod === "gcash" ? "GCash" : "COD"}
        </span>
      </td>

      {/* STATUS / PRINT BADGE — clickable */}
      <td className="print-hidden px-5 py-4 whitespace-nowrap border border-gray-200">
        <button
          onClick={onTogglePrinted}
          title={
            booking.isPrinted
              ? "Click to mark as not printed"
              : "Click to mark as printed"
          }
          className={`text-[9px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
            booking.isPrinted
              ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
              : "text-red-500 bg-red-50 hover:bg-red-100"
          }`}
        >
          {booking.isPrinted ? "✅ Printed" : "🔴 Not Printed"}
        </button>
        {booking.isPrinted && booking.printedAt && (
          <p className="text-[9px] text-gray-400 font-medium mt-1">
            {new Date(booking.printedAt).toLocaleTimeString("en-PH", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </td>

      {/* RIDER (print only) */}
      <td className="px-5 py-4 print-only border border-gray-200">
        <p className="text-sm font-bold text-gray-700">&nbsp;</p>
      </td>

      {/* ACTIONS */}
      <td className="px-5 py-4 print:hidden border border-gray-200">
        <div className="flex items-center gap-1.5">
          <ActionBtn
            onClick={onView}
            color="gray"
            title="View"
            icon="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
          {booking.deletedAt ? (
            <ActionBtn
              onClick={onRestore}
              color="green"
              title="Restore"
              icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          ) : (
            <>
              <ActionBtn
                onClick={onEdit}
                color="blue"
                title="Edit"
                icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
              <ActionBtn
                onClick={onDelete}
                color="red"
                title="Delete"
                icon="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── ACTION BUTTON ─────────────────────────────────────────────────
function ActionBtn({ onClick, color, title, icon }) {
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
        className="w-4 h-4"
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

// ── VIEW MODAL ────────────────────────────────────────────────────
function ViewModal({ booking, onClose }) {
  const extraDishes = booking.dishes?.extra?.filter(Boolean) || [];
  const extraTotal = extraDishes.length * EXTRA_DISH_PRICE;
  const discount = Math.abs(Number(booking.promoAmount || 0));


  const processTime = getProcessTime(booking.deliveryTime);

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Booking Details"
        subtitle={booking.orderNumber}
        onClose={onClose}
      />
      <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
        <Section title="Customer" icon="👤">
          <Row label="Name" value={booking.customerName} />
          <Row label="Contact" value={booking.contacts?.join(", ")} />
          {booking.facebookProfile && (
            <Row label="Facebook" value={booking.facebookProfile} />
          )}
        </Section>
        <Section title="Delivery" icon="🚚">
          <Row label="Type" value={booking.orderType} highlight />
          <Row
            label="Delivery Date"
            value={new Date(booking.deliveryDate).toLocaleDateString()}
          />
          <Row label="Delivery Time" value={booking.deliveryTime} />
          <Row label="Process Time" value={processTime} highlight />
          {booking.orderType === "delivery" && (
            <>
              <Row label="Address" value={booking.address} />
              <Row label="Zone" value={booking.zone} />
            </>
          )}
        </Section>
        <Section title="Order" icon="🍖">
          <Row label="Product" value={booking.productName} />
          <Row
            label="Included Dishes"
            value={
              booking.dishes?.required?.length > 0
                ? booking.dishes.required.join(", ")
                : "None"
            }
          />
          {extraDishes.length > 0 && (
            <Row label="Extra Dishes" value={extraDishes.join(", ")} />
          )}
          {booking.freebies?.freebies?.length > 0 && (
            <Row
              label="Freebies"
              value={booking.freebies.freebies.join(", ")}
              green
            />
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
              {fmt(booking.totalAmount)}
            </span>
          </div>
        </Section>
        <Section title="Payment" icon="💳">
          <Row
            label="Method"
            value={
              booking.paymentMethod === "gcash"
                ? "📱 GCash"
                : "💵 Cash on Delivery"
            }
          />
        </Section>
      </div>
    </Modal>
  );
}
const zoneKeywords = [
  {
    zoneName: "Talisay-Proper",
    keywords: [
      "talisay",
      "biasong",
      "bulacao",
      "tabunok",
      "mohon",
      "pooc",
      "lawaan",
    ],
  },
  { zoneName: "Talisay-Mountain", keywords: ["camp 4", "manipis", "tapul"] },
  {
    zoneName: "Cebu-Proper",
    keywords: [
      "cebu",
      "mambaling",
      "pardo",
      "lahug",
      "mabolo",
      "banilad",
      "talamban",
    ],
  },
  {
    zoneName: "Cebu-Mountain",
    keywords: ["busay", "sirao", "sudlon", "babag", "tops", "transcentral"],
  },
  {
    zoneName: "Mandaue-Proper",
    keywords: [
      "mandaue",
      "basak",
      "cabancalan",
      "opao",
      "tipolo",
      "subangdaku",
    ],
  },
  {
    zoneName: "Minglanilla-Proper",
    keywords: ["minglanilla", "tungkop", "tunghaan", "camp 8"],
  },
  {
    zoneName: "Minglanilla-Mountain",
    keywords: ["guindaruhan", "manduang", "camp 7"],
  },
  { zoneName: "Naga-Proper", keywords: ["naga", "inala", "tinaan", "mayana"] },
  { zoneName: "Naga-Mountain", keywords: ["alpaco", "pulangbato", "tabunan"] },
  {
    zoneName: "LapuLapu-Proper",
    keywords: ["lapu", "mactan", "pusok", "basak", "aginid"],
  },
  {
    zoneName: "Consolacion-Proper",
    keywords: ["consolacion", "tayud", "lamac", "sacsac"],
  },
  {
    zoneName: "Liloan-Proper",
    keywords: ["liloan", "cotcot", "jublag", "tayud", "yati"],
  },
  { zoneName: "Liloan-Mountain", keywords: ["cansaga", "pitogo"] },
  {
    zoneName: "Danao-Proper",
    keywords: ["danao", "guinsay", "cogon", "binaliw"],
  },
  {
    zoneName: "Compostela-Proper",
    keywords: ["compostela", "nangka", "tugbongan"],
  },
  {
    zoneName: "Carcar-Proper",
    keywords: ["carcar", "poblacion", "napo", "tuyom"],
  },
  {
    zoneName: "San Fernando-Proper",
    keywords: ["san fernando", "cabatbatan", "pitalo"],
  },
  { zoneName: "Sibonga-Proper", keywords: ["sibonga", "simala", "abugon"] },
  {
    zoneName: "Moalboal-Proper",
    keywords: ["moalboal", "panagsama", "basdiot", "white beach"],
  },
  { zoneName: "Argao-Proper", keywords: ["argao", "talo-ot", "colawin"] },
];

const getAvailableTimes = (deliveryDate) => {
  const allTimes = [
    "12:00 AM",
    "1:00 AM",
    "2:00 AM",
    "3:00 AM",
    "4:00 AM",
    "5:00 AM",
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];
  if (!deliveryDate) return allTimes;
  const today = new Date().toISOString().split("T")[0];
  if (deliveryDate !== today) return allTimes;
  const now = new Date();
  const cutoffHour = now.getHours() + 5;
  const currentMinutes = now.getMinutes();
  return allTimes.filter((timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    if (hours > cutoffHour) return true;
    if (hours === cutoffHour && minutes >= currentMinutes) return true;
    return false;
  });
};
// ── EDIT MODAL ────────────────────────────────────────────────────
function EditModal({ booking, onClose, onSave }) {
  const EXTRA_DISH_PRICE = 700;

  const [form, setForm] = useState({
    orderType: booking.orderType || "delivery",
    deliveryDate: booking.deliveryDate?.split("T")[0] ?? "",
    deliveryTime: booking.deliveryTime || "",
    address: booking.address || "",
    zone: booking.zone?.trim() || "", // trim whitespace just in case
    paymentMethod: booking.paymentMethod || "cod",
  });

  const [allProducts, setAllProducts] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(
    booking.productId ?? booking.product?.id ?? null,
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requiredDishes, setRequiredDishes] = useState([]);
  const [extraDishes, setExtraDishes] = useState([]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  // Auto-detect zone from address
  useEffect(() => {
    if (!form.address || form.orderType !== "delivery") return;
    const lower = form.address.toLowerCase().replace(/\s+/g, "");
    for (const z of zoneKeywords) {
      if (z.keywords.some((k) => lower.includes(k.replace(/\s+/g, "")))) {
        set("zone", z.zoneName);
        return;
      }
    }
    set("zone", "");
  }, [form.address, form.orderType]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, productsRes, dishesRes, chargesRes] =
          await Promise.all([
            api.get("/products/types"),
            api.get("/products"),
            api.get("/products/dishes"),
            api.get("/products/delivery-charges"),
          ]);

        setProductTypes(typesRes.data ?? []);
        setAllDishes(dishesRes.data ?? []);
        setDeliveryCharges(chargesRes.data ?? []);

        const mapped = (productsRes.data ?? []).map((p) => ({
          id: p.id,
          productName: p.productName,
          amount: p.amount,
          promoAmount: p.promoAmount,
          productTypeId: p.productTypeId,
          NoOfDishes: p.noOfIncludedDishes ?? 0,
          freebies: (p.freebies ?? []).map((f) => f.freebieName),
          defaultDishes: p.defaultDishes ?? [],
        }));
        setAllProducts(mapped);

        const productId = booking.productId ?? booking.product?.id;
        if (productId) {
          const current = mapped.find((p) => p.id === productId);
          if (current) {
            setSelectedProduct(current);
            setSelectedProductId(current.id);

            const nameToId = Object.fromEntries(
              (dishesRes.data ?? []).map((d) => [d.dishName, d.id]),
            );

            const toId = (val) => {
              if (!val) return "";
              if (typeof val === "number") return String(val);
              return String(nameToId[val] ?? "");
            };

            const requiredIds = (booking.dishes?.required ?? []).map(toId);
            const extraIds = (booking.dishes?.extra ?? [])
              .map(toId)
              .filter(Boolean);

            const slots = current.NoOfDishes || 0;
            const paddedRequired = [...requiredIds];
            while (paddedRequired.length < slots) paddedRequired.push("");

            setRequiredDishes(paddedRequired);
            setExtraDishes(extraIds);
          }
        }
      } catch (err) {
        console.error("Failed to load edit data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductChange = (productId) => {
    const product = allProducts.find((p) => p.id === Number(productId));
    setSelectedProductId(productId ? Number(productId) : null);
    setSelectedProduct(product || null);

    if (product) {
      const defaultIds = (product.defaultDishes ?? []).map((d) =>
        String(d.dishId),
      ); // ← d.dishId
      const slots = product.NoOfDishes || 0;
      const padded = [...defaultIds];
      while (padded.length < slots) padded.push("");
      setRequiredDishes(padded);
    } else {
      setRequiredDishes([]);
    }

    setExtraDishes([]);
  };

  const deliveryFee =
    form.orderType === "delivery"
      ? (() => {
          const charge = deliveryCharges.find(
            (c) =>
              c.zoneName?.trim().toLowerCase() ===
              form.zone?.trim().toLowerCase(),
          );
          // console.log("form.zone:", form.zone);
          // console.log("deliveryCharges:", deliveryCharges);
          return charge
            ? Number((charge.baseFee || 0) + (charge.surcharge || 0))
            : 0;
        })()
      : 0;

  const packageTotal = selectedProduct?.amount ?? 0;
  const extraTotal = extraDishes.filter(Boolean).length * EXTRA_DISH_PRICE;
  const discount = selectedProduct?.promoAmount
    ? Math.abs(Number(selectedProduct.promoAmount))
    : 0;
  const total = packageTotal + extraTotal + deliveryFee - discount;

  const handleSave = () => {
    onSave({
      orderType: form.orderType,
      deliveryDate: form.deliveryDate,
      deliveryTime: form.deliveryTime,
      // ← only send address/zone if delivery
      address: form.orderType === "delivery" ? form.address : null,
      zone: form.orderType === "delivery" ? form.zone : null,
      paymentMethod: form.paymentMethod,
      totalAmount: total,
      productId: selectedProductId,
      dishes: {
        required: requiredDishes.filter(Boolean).map(Number),
        extra: extraDishes.filter(Boolean).map(Number),
      },
    });
  };

  const productsByType = productTypes
    .map((pt) => ({
      ...pt,
      products: allProducts.filter((p) => p.productTypeId === pt.id),
    }))
    .filter((pt) => pt.products.length > 0);

  if (loading) {
    return (
      <Modal onClose={onClose}>
        <ModalHeader
          title="Edit Booking"
          subtitle={`#${booking.id}`}
          onClose={onClose}
        />
        <div className="p-12 text-center text-gray-400 font-bold">
          Loading order data...
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Edit Booking"
        subtitle={`#${booking.id}`}
        onClose={onClose}
      />
      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <Section title="Delivery Details" icon="🚚">
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {["delivery", "pickup"].map((type) => (
                <button
                  key={type}
                  onClick={() => set("orderType", type)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                    form.orderType === type
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {type === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditField
                label="Date"
                value={form.deliveryDate}
                onChange={(v) => set("deliveryDate", v)}
                type="date"
              />
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Time
                </label>
                <select
                  value={form.deliveryTime}
                  onChange={(e) => set("deliveryTime", e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select time</option>
                  {getAvailableTimes(form.deliveryDate).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {form.orderType === "delivery" && (
              <>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter address"
                  />
                  {form.orderType === "delivery" && (
                    <div
                      className={`mt-1.5 px-3 py-2 rounded-lg text-xs font-bold ${
                        form.zone
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {form.zone
                        ? `📍 ${form.zone}`
                        : "Zone not detected — try a more specific address"}
                    </div>
                  )}
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["cod", "💵 Cash on Delivery"],
                  ["gcash", "📱 GCash"],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => set("paymentMethod", val)}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all border-2 ${
                      form.paymentMethod === val
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Package" icon="🍖">
          <div className="pt-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
              Select Package
            </label>
            <select
              value={selectedProductId || ""}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">No package</option>
              {productsByType.map((pt) => (
                <optgroup
                  key={pt.id}
                  label={pt.typeName?.replace("_", " ").toUpperCase()}
                >
                  {pt.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.productName} — ₱{Number(p.amount).toLocaleString()}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {selectedProduct?.freebies?.length > 0 && (
              <div className="mt-3 bg-emerald-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">
                  Freebies
                </p>
                <p className="text-xs font-bold text-emerald-800">
                  {selectedProduct.freebies.join(" · ")}
                </p>
              </div>
            )}
          </div>
        </Section>

        {requiredDishes.length > 0 && (
          <Section
            title={`Included Dishes (${requiredDishes.length} slots)`}
            icon="🥘"
          >
            <div className="pt-2 space-y-2">
              {requiredDishes.map((dishId, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">
                    Dish {i + 1}
                  </label>
                  <select
                    value={dishId}
                    onChange={(e) => {
                      const updated = [...requiredDishes];
                      updated[i] = e.target.value;
                      setRequiredDishes(updated);
                    }}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="">Select dish</option>
                    {allDishes.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.dishName}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Section>
        )}

        {selectedProduct && (
          <Section title="Extra Dishes" icon="➕">
            <div className="pt-2 space-y-2">
              {extraDishes.map((dishId, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={dishId}
                    onChange={(e) => {
                      const updated = [...extraDishes];
                      updated[i] = e.target.value;
                      setExtraDishes(updated);
                    }}
                    className="flex-1 p-2.5 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="">Select dish</option>
                    {allDishes.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.dishName}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      setExtraDishes(extraDishes.filter((_, idx) => idx !== i))
                    }
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setExtraDishes([...extraDishes, ""])}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs font-black text-gray-400 hover:border-red-300 hover:text-red-500 transition-all"
              >
                + Add Extra Dish (₱700 each)
              </button>
            </div>
          </Section>
        )}

        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            Pricing Summary
          </p>
          {selectedProduct && (
            <div className="flex justify-between text-sm">
              <span className="font-bold text-gray-500">Package</span>
              <span className="font-black text-gray-800">
                {fmt(packageTotal)}
              </span>
            </div>
          )}
          {extraDishes.filter(Boolean).length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-bold text-gray-500">
                Extra Dishes ({extraDishes.filter(Boolean).length})
              </span>
              <span className="font-black text-gray-800">
                {fmt(extraTotal)}
              </span>
            </div>
          )}
          {form.orderType === "delivery" && (
            <div className="flex justify-between text-sm">
              <span className="font-bold text-gray-500">Delivery Fee</span>
              <span className="font-black text-gray-800">
                {fmt(deliveryFee)}
              </span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-bold text-emerald-600">Discount</span>
              <span className="font-black text-emerald-600">
                -{fmt(discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200 mt-2">
            <span className="text-sm font-black text-gray-800">Total</span>
            <span className="text-lg font-black text-red-600">
              {fmt(total)}
            </span>
          </div>
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

// ── CONFIRM MODAL ─────────────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}) {
  const colors = {
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-emerald-600 hover:bg-emerald-700",
  };
  const icons = {
    red: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    green: "M5 13l4 4L19 7",
  };
  return (
    <Modal onClose={onCancel}>
      <div className="p-8 text-center">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            confirmColor === "red" ? "bg-red-50" : "bg-emerald-50"
          }`}
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
              d={icons[confirmColor]}
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
            className={`flex-1 py-3 rounded-xl text-white font-black text-sm transition-all ${colors[confirmColor]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── SHARED SHELLS ─────────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
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
        className={`text-xs font-black px-2 py-0.5 rounded-lg max-w-[60%] text-right ${
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
