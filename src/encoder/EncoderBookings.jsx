import { useEffect, useState } from "react";
import { getMyBookings } from "../api/orderApi";

function toLocalDateString(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDeliveryDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EncoderBookings({
  encoderId,
  encoderName,
  view,
  setView,
}) {
  const [selectedDate, setSelectedDate] = useState(toLocalDateString());
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async (date) => {
    setIsLoading(true);
    const data = await getMyBookings({ encoderId, date });
    setBookings(Array.isArray(data) ? data : []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings(selectedDate);
  }, [selectedDate]);

  const isToday = selectedDate === toLocalDateString();
  const totalAmount = bookings.reduce(
    (sum, b) => sum + Number(b.totalAmount),
    0,
  );
  const deliveryCount = bookings.filter(
    (b) => b.orderType === "delivery",
  ).length;
  const pickupCount = bookings.filter((b) => b.orderType !== "delivery").length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto">
        {/* ── HEADER (mirrors App.jsx header exactly) ── */}
        <header className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-4">
          {/* LEFT — Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-red-700 rounded-full flex items-center justify-center border-2 border-white shadow-md overflow-hidden flex-shrink-0">
              <span className="text-xl md:text-3xl">🐷</span>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-red-900 tracking-tight leading-none">
                Jojo's Lechon
              </h1>
              <p className="text-gray-500 font-medium mt-1 text-[10px] md:text-sm uppercase tracking-wider">
                Order Encoder Dashboard
              </p>
            </div>
          </div>

          {/* CENTER — Nav tabs */}
          {setView && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
              {[
                { key: "book", label: "New Booking" },
                { key: "bookings", label: "My Bookings Today" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    view === tab.key
                      ? "bg-white text-red-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* RIGHT — Encoder badge + logout */}
          {encoderName && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Logged in as
                </p>
                <p className="text-sm font-black text-red-700">{encoderName}</p>
              </div>
              <button
                onClick={() => {
                  sessionStorage.removeItem("encoder");
                  window.location.href = "/#/encoder/login";
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-red-100 text-red-600 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition-all"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </header>

        {/* ── PAGE CONTENT CARD ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
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
                <h2 className="text-lg font-bold text-gray-800 leading-none">
                  My Bookings
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {isToday ? "Today — " : ""}
                  {formatDisplayDate(selectedDate)}
                </p>
              </div>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 h-9 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(toLocalDateString())}
                  className="text-xs px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-500 hover:bg-gray-50 h-9 font-medium transition-all"
                >
                  Today
                </button>
              )}
            </div>
          </div>

          {/* ── STATS ROW ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 border-b border-gray-100">
            {[
              { label: "Total Bookings", value: bookings.length, icon: "📋" },
              { label: "Delivery", value: deliveryCount, icon: "🚚" },
              { label: "Pickup", value: pickupCount, icon: "🏪" },
              {
                label: "Total Amount",
                value: `₱${totalAmount.toLocaleString()}`,
                green: true,
                icon: "💰",
              },
            ].map((s) => (
              <div key={s.label} className="bg-white px-5 py-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {s.label}
                </p>
                <p
                  className={`text-2xl font-extrabold ${s.green ? "text-emerald-600" : "text-gray-800"}`}
                >
                  {isLoading ? (
                    <span className="inline-block w-12 h-6 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    s.value
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* ── TABLE ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    "Order #",
                    "Customer",
                    "Type",
                    "Delivery Date & Time",
                    "Payment",
                    "Amount",
                    "Encoded At",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Loading skeleton rows
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div
                            className="h-4 bg-gray-100 rounded animate-pulse"
                            style={{ width: `${60 + Math.random() * 30}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-7 h-7 text-gray-400"
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
                        </div>
                        <p className="text-sm font-bold text-gray-500">
                          No bookings found for this date.
                        </p>
                        <p className="text-xs text-gray-400">
                          Bookings you encode will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-red-50/30 border-b border-gray-50 last:border-0 transition-colors"
                    >
                      {/* Order # */}
                      <td className="px-4 py-3">
                        <span className="font-black text-red-600 text-xs tracking-wide">
                          {b.orderNumber}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-800 text-sm leading-none">
                          {b.customerName}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          {b.contacts?.[0]}
                        </p>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold ${
                            b.orderType === "delivery"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {b.orderType === "delivery" ? "Delivery" : "Pickup"}
                        </span>
                      </td>

                      {/* Delivery Date */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700 font-medium leading-none">
                          {formatDeliveryDate(b.deliveryDate)}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          {b.deliveryTime}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-bold ${
                            b.paymentMethod?.toLowerCase() === "gcash"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {b.paymentMethod?.toLowerCase() === "gcash"
                            ? "GCash"
                            : "Cash"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3">
                        <span className="font-black text-gray-800 text-sm">
                          ₱{Number(b.totalAmount).toLocaleString()}
                        </span>
                      </td>

                      {/* Encoded at */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-400 font-medium">
                          {formatTime(b.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── FOOTER — New Booking CTA ── */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-medium">
              {isLoading
                ? "Loading..."
                : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} on this date`}
            </p>
            <button
              onClick={() => setView("book")}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
