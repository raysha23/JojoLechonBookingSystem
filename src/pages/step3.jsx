import React from "react";

export default function Step3() {
  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. CUSTOMER DETAILS */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
            Customer Details
          </h3>
        </div>
        <div className="p-6 space-y-1">
          <DetailRow label="Name" value="N/A" />
          <DetailRow label="Contact Number" value="N/A" />
          <DetailRow label="Facebook Profile" value="N/A" />
        </div>
      </div>

      {/* 2. DELIVERY DETAILS */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
            Delivery Details
          </h3>
        </div>
        <div className="p-6 space-y-1">
          <DetailRow label="Delivery Type" value="Pickup" isHighlight />
          <DetailRow label="Delivery Date" value="N/A" />
          <DetailRow label="Delivery Time" value="N/A" />
          <DetailRow label="Address" value="N/A" />
          <DetailRow label="Delivery Fee" value="₱0.00" />
          <div className="flex justify-between items-center py-3">
            <span className="text-sm font-bold text-gray-400">
              Payment Method
            </span>
            <div className="flex items-center gap-2 bg-[#0d0d0d] text-white px-3 py-1.5 rounded-xl shadow-lg">
              <span className="text-xs">📱</span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                GCash
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ORDER DETAILS (Package Bundle + Extras) */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
            Order Details
          </h3>
        </div>

        <div className="p-6">
          {/* PACKAGE & INCLUDED SIDES */}
          <div className="mb-8">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-3">
              Selected Package
            </p>

            {/* Main Package Title */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-base font-black text-gray-900">
                Lechon Package A
              </span>
              <span className="text-base font-black text-gray-900">₱3,200</span>
            </div>

            {/* Included Side Dishes (Nested Style) */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-dashed border-gray-200">
              <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
                Included Sides:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {["Whole Lechon", "Pancit Guisado", "Rice (1 Tray)"].map(
                  (side, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <span className="text-xs font-bold">{side}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ADDITIONAL DISHES (EXTRAS) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Additional Dishes
              </p>
              <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                Extras
              </span>
            </div>

            <div className="space-y-3">
              <ItemRow name="Lumpiang Shanghai x1" price="₱250" />
              <ItemRow name="Dinuguan x1" price="₱350" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. FREEBIES */}
      <div className="bg-emerald-50/40 rounded-[2rem] border border-emerald-100 p-6 relative overflow-hidden">
        <h3 className="font-black text-emerald-800 mb-4 tracking-tight">
          Included Freebies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FreebieCard text="Disposable Plates & Utensils" />
          <FreebieCard text="Lechon Sauce (Special Recipe)" />
        </div>
      </div>
    </div>
  );
}

/* ================= REFINED SUB COMPONENTS ================= */

function DetailRow({ label, value, isHighlight = false }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 group">
      <span className="text-sm font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
        {label}
      </span>
      <span
        className={`text-sm font-black px-2 py-0.5 rounded-md ${isHighlight ? "text-red-600 bg-red-50" : "text-gray-800 bg-gray-50"}`}
      >
        {value}
      </span>
    </div>
  );
}

function ItemRow({ name, price, isBold = false }) {
  return (
    <div
      className={`flex justify-between items-center ${isBold ? "pb-3 border-b-2 border-gray-100" : ""}`}
    >
      <span
        className={`text-sm font-bold ${isBold ? "text-gray-900" : "text-gray-500"}`}
      >
        {name}
      </span>
      <span
        className={`font-black ${isBold ? "text-gray-900 text-lg" : "text-sm text-gray-800"}`}
      >
        {price}
      </span>
    </div>
  );
}

function FreebieCard({ text }) {
  return (
    <div className="flex items-center gap-3 bg-white/80 border border-emerald-100 p-3.5 rounded-2xl shadow-sm transition-transform hover:scale-[1.02]">
      <div className="bg-emerald-500 rounded-full p-1 flex-shrink-0">
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span className="text-[11px] font-black text-emerald-800 uppercase tracking-tight leading-tight">
        {text}
      </span>
    </div>
  );
}
