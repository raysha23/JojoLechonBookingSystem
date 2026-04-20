import React from "react";

export default function Step3({ setStep }) {
  return (
    <div className="space-y-6 pb-20">
      {/* 1. CUSTOMER DETAILS CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-black text-gray-800 mb-4 tracking-tight">
          Customer Details
        </h3>

        <div className="space-y-3">
          <DetailRow label="Name:" value="N/A" />
          <DetailRow label="Contact:" value="N/A" />
          <DetailRow label="Delivery Date:" value="N/A" />
          <DetailRow label="Delivery Time:" value="N/A" />

          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-bold text-gray-500">
              Payment Method:
            </span>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
              <span className="text-xs">📱</span>
              <span className="text-sm font-black text-gray-800">GCash</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ORDER ITEMS CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-black text-gray-800 mb-4 tracking-tight">
          Order Items
        </h3>

        <div className="space-y-4">
          <ItemRow name="Small Package (Pickup)" price="₱3,200" />
          <ItemRow name="Lumpiang Shanghai x1" price="₱250" />
          <ItemRow name="Dinuguan x1" price="₱350" />
        </div>
      </div>

      {/* 3. FREEBIES */}
      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6">
        <h3 className="font-black text-emerald-800 mb-4 tracking-tight">
          Included Freebies
        </h3>

        <ul className="space-y-2">
          <FreebieItem text="Disposable Plates & Utensils" />
          <FreebieItem text="Lechon Sauce (Special Recipe)" />
        </ul>
      </div>
    </div>
  );
}

// ===== SUB COMPONENTS =====
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm font-bold text-gray-500">{label}</span>
      <span className="text-sm font-black text-gray-800">{value}</span>
    </div>
  );
}

function ItemRow({ name, price }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-sm font-bold text-gray-700">{name}</span>
      <span className="text-sm font-black text-gray-800">{price}</span>
    </div>
  );
}

function FreebieItem({ text }) {
  return (
    <li className="flex items-center gap-2 text-emerald-700">
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span className="text-sm font-bold">{text}</span>
    </li>
  );
}
