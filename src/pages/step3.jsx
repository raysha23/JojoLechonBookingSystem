import React from "react";

const EXTRA_DISH_PRICE = 700;

function getDeliveryFee(zone, deliveryCharges = []) {
  if (!zone || deliveryCharges.length === 0) return 0;
  const charge = deliveryCharges.find((item) => item.zoneName === zone);
  return charge ? Number(charge.minAmount || 0) : 0;
}

export default function Step3({ orderState }) {
  const {
    orderType,
    zone,
    address,
    deliveryDate,
    deliveryTime,
    selectedProduct,
    extraDishes,
    paymentMethod,
    customerName,
    contacts,
    facebookProfile,
    dishes,
    deliveryCharges,
  } = orderState;

  const deliveryFee = orderType === "delivery" ? getDeliveryFee(zone, deliveryCharges) : 0;
  const filledExtraDishes = (extraDishes || []).filter((d) => d !== "");
  const dishesTotal = filledExtraDishes.length * EXTRA_DISH_PRICE;
  const packageTotal = selectedProduct ? selectedProduct.amount : 0;
  const discount = selectedProduct?.promoAmount
    ? Math.abs(Number(selectedProduct.promoAmount))
    : 0;
  const total = packageTotal + dishesTotal + deliveryFee - discount;

  const fmt = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

  const paymentLabel = paymentMethod === "gcash" ? "GCash" : "Cash on Delivery";
  const paymentIcon = paymentMethod === "gcash" ? "📱" : "💵";

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
          <DetailRow label="Name" value={customerName || "N/A"} />
          <DetailRow
            label="Contact Number"
            value={contacts.filter((c) => c !== "").join(", ") || "N/A"}
          />
          <DetailRow
            label="Facebook Profile"
            value={facebookProfile || "N/A"}
          />
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
          <DetailRow
            label="Delivery Type"
            value={orderType === "delivery" ? "Delivery" : "Pickup"}
            isHighlight
          />
          <DetailRow label="Delivery Date" value={deliveryDate || "N/A"} />
          <DetailRow label="Delivery Time" value={deliveryTime || "N/A"} />
          {orderType === "delivery" && (
            <>
              <DetailRow label="Address" value={address || "N/A"} />
              <DetailRow label="Zone" value={zone || "N/A"} />
              <DetailRow label="Delivery Fee" value={fmt(deliveryFee)} />
            </>
          )}
          <div className="flex justify-between items-center py-3">
            <span className="text-sm font-bold text-gray-400">
              Payment Method
            </span>
            <div className="flex items-center gap-2 bg-[#0d0d0d] text-white px-3 py-1.5 rounded-xl shadow-lg">
              <span className="text-xs">{paymentIcon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {paymentLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ORDER DETAILS */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
            Order Details
          </h3>
        </div>

        <div className="p-6">
          {/* SELECTED PACKAGE */}
          {selectedProduct ? (
            <div className="mb-8">
              <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-3">
                Selected Package
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-black text-gray-900">
                  {selectedProduct.productName}
                </span>
                <span className="text-base font-black text-gray-900">
                  {fmt(selectedProduct.amount)}
                </span>
              </div>

              {/* Included dishes from package */}
              {selectedProduct.freebies &&
                selectedProduct.freebies.length > 0 && (
                  <div className="bg-gray-50/80 rounded-2xl p-4 border border-dashed border-gray-200">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">
                      Included Sides:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedProduct.freebies.map((side, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <span className="text-xs font-bold">{side}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-8">
              No package selected.
            </p>
          )}

          {/* EXTRA DISHES */}
          {filledExtraDishes.length > 0 && (
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
                {filledExtraDishes.map((dishIndex, i) => {
                  const dish = dishes.find((item) => String(item.id) === String(dishIndex));
                  return dish ? (
                    <ItemRow
                      key={i}
                      name={dish.dishName || dish.productName || "Selected Dish"}
                      price={fmt(EXTRA_DISH_PRICE)}
                    />
                  ) : (
                    <ItemRow
                      key={i}
                      name="Unknown dish"
                      price={fmt(EXTRA_DISH_PRICE)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* TOTAL */}
          <div className="mt-6 pt-4 border-t-2 border-gray-100">
            <ItemRow name="Total" price={fmt(total)} isBold />
          </div>
        </div>
      </div>

      {/* 3. FREEBIES */}
      {selectedProduct?.freebies && selectedProduct.freebies.length > 0 && (
        <div className="bg-emerald-50/40 rounded-[2rem] border border-emerald-100 p-6 relative overflow-hidden">
          <h3 className="font-black text-emerald-800 mb-4 tracking-tight">
            Included Freebies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedProduct.freebies.map((text, i) => (
              <FreebieCard key={i} text={text} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function DetailRow({ label, value, isHighlight = false }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 group">
      <span className="text-sm font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
        {label}
      </span>
      <span
        className={`text-sm font-black px-2 py-0.5 rounded-md ${
          isHighlight ? "text-red-600 bg-red-50" : "text-gray-800 bg-gray-50"
        }`}
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
