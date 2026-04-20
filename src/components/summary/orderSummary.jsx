import React, { useState } from "react";

export default function OrderSummary() {
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  return (
    <div className="bg-[#0d0d0d] text-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
      {/* HEADER */}
      <h2 className="text-2xl font-black mb-1">Order Summary</h2>
      <div className="w-12 h-1 bg-red-600 mb-8"></div>

      <div className="space-y-5">
        {/* PRICE BREAKDOWN */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-sm tracking-tight">Package total</p>
              <p className="text-[10px] text-gray-500 font-medium">
                Premium package (delivery)
              </p>
            </div>
            <p className="font-bold text-lg">₱0.00</p>
          </div>

          <div className="flex justify-between items-start border-t border-gray-800 pt-4">
            <div>
              <p className="font-bold text-sm tracking-tight">Dishes total</p>
              <p className="text-[10px] text-gray-500 font-medium">0 items</p>
            </div>
            <p className="font-bold text-lg">₱0</p>
          </div>

          <div className="flex justify-between items-start border-t border-gray-800 pt-4">
            <div>
              <p className="font-bold text-sm tracking-tight text-emerald-500">
                Discount
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                Premium package bonus
              </p>
            </div>
            <p className="font-bold text-lg text-emerald-500">₱0.00</p>
          </div>
        </div>

        {/* TOTAL SECTION */}
        <div className="pt-2">
          <div className="flex justify-between items-center border-t border-gray-800 pt-5 mb-4">
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              SUBTOTAL
            </p>
            <p className="text-xl font-bold">₱0.00</p>
          </div>

          <div className="bg-red-600 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-90 leading-none mb-1">
                TOTAL AMOUNT
              </p>
              <p className="text-[11px] font-medium opacity-80">
                With delivery
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-black">₱0.00</p>
          </div>
        </div>
        {/* PAYMENT METHOD SECTION */}
        <div className="pt-4 border-t border-gray-800">
          <h3 className="text-white font-bold text-sm mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* COD Button */}
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${
                paymentMethod === "cod"
                  ? "border-blue-600 bg-[#0a1221] shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                  : "border-gray-800 bg-[#1a1a1a] hover:border-gray-700"
              }`}
            >
              <div className="text-xl mb-2 group-hover:scale-110 transition-transform">
                💵
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${paymentMethod === "cod" ? "text-white" : "text-gray-500"}`}
              >
                Cash on Delivery
              </span>
            </button>

            {/* GCash Button */}
            <button
              onClick={() => setPaymentMethod("gcash")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${
                paymentMethod === "gcash"
                  ? "border-blue-600 bg-[#0a1221] shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                  : "border-gray-800 bg-[#1a1a1a] hover:border-gray-700"
              }`}
            >
              <div className="text-xl mb-2 group-hover:scale-110 transition-transform">
                📱
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${paymentMethod === "gcash" ? "text-white" : "text-gray-500"}`}
              >
                GCash
              </span>
            </button>
          </div>
        </div>
        {/* FOOTER STATS */}
        <div className="grid grid-cols-3 pt-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-red-500 text-2xl font-bold leading-none mb-1">
              0
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              DISHES
            </p>
          </div>
          <div className="text-center border-x border-gray-800">
            <p className="text-emerald-500 text-2xl font-bold leading-none mb-1">
              0
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              FREEBIES
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 text-2xl font-bold leading-none mb-1">
              0
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              PACKAGE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
