import React, { useEffect } from "react";

const EXTRA_DISH_PRICE = 700;

function getDeliveryFee(zone, deliveryCharges = []) {
  if (!zone || deliveryCharges.length === 0) return 0;
  const charge = deliveryCharges.find((item) => item.zoneName === zone);
  return charge
    ? Number(charge.baseFee || 0) + Number(charge.surcharge || 0)
    : 0;
}

export default function OrderSummary({ orderState }) {
  const {
    orderType,
    zone,
    productType,
    selectedProduct,
    requiredDishes,
    extraDishes,
    paymentMethod,
    setPaymentMethod,
    deliveryCharges,
    upgradeAmount,
    setTotalAmount, // ✅ destructure here
  } = orderState;

  const fmt = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

  const getUpgradeKg = (amount) => {
    if (amount === 500) return "1kg";
    if (amount === 1000) return "2-3kg";
    if (amount === 2000) return "5-6kg";
    return "";
  };

  // ── CALCULATIONS ─────────────────────────────────────────────────
  const packageTotal = selectedProduct ? selectedProduct.amount : 0;

  const requiredDishCount =
    productType === "dish_only"
      ? (requiredDishes || []).filter(Boolean).length
      : selectedProduct?.NoOfDishes || 0;

  const filledExtraDishes = (extraDishes || []).filter((d) => d !== "");
  const extraDishesTotal = filledExtraDishes.length * EXTRA_DISH_PRICE;

  const deliveryFee =
    orderType === "delivery" ? getDeliveryFee(zone, deliveryCharges) : 0;

  const discount = selectedProduct?.promoAmount
    ? Math.abs(Number(selectedProduct.promoAmount))
    : 0;

  const totalDishCount = requiredDishCount + filledExtraDishes.length;
  const freebiesCount = selectedProduct?.freebies?.length || 0;
  const upgradeTotal = upgradeAmount || 0;

  const subtotal = packageTotal + extraDishesTotal + deliveryFee + upgradeTotal;
  const total = subtotal - discount; // ✅ declared ONCE, in the right order

  useEffect(() => {
    setTotalAmount(total);
  }, [total]);
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#0d0d0d] text-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
      <h2 className="text-2xl font-black mb-1">Order Summary</h2>
      <div className="w-12 h-1 bg-red-600 mb-8"></div>

      <div className="space-y-5">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-sm tracking-tight">Product total</p>
              <p className="text-[10px] text-gray-500 font-medium">
                {selectedProduct
                  ? selectedProduct.productName
                  : "No product selected"}
              </p>
            </div>
            <p
              className={`font-bold text-lg ${packageTotal > 0 ? "text-white" : "text-gray-600"}`}
            >
              {fmt(packageTotal)}
            </p>
          </div>

          {filledExtraDishes.length > 0 && (
            <div className="flex justify-between items-start border-t border-gray-800 pt-4">
              <div>
                <p className="font-bold text-sm tracking-tight">
                  {productType === "dish_only"
                    ? "Dishes total"
                    : "Extra dishes total"}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  {filledExtraDishes.length}{" "}
                  {filledExtraDishes.length === 1 ? "dish" : "dishes"} × ₱700
                </p>
              </div>
              <p className="font-bold text-lg">{fmt(extraDishesTotal)}</p>
            </div>
          )}

          {upgradeTotal > 0 && (
            <div className="flex justify-between items-start border-t border-gray-800 pt-4">
              <div>
                <p className="font-bold text-sm tracking-tight">Upgrade</p>
                <p className="text-[10px] text-gray-500 font-medium">
                  {getUpgradeKg(upgradeAmount)} additional weight
                </p>
              </div>
              <p className="font-bold text-lg">{fmt(upgradeTotal)}</p>
            </div>
          )}

          {orderType === "delivery" && (
            <div className="flex justify-between items-start border-t border-gray-800 pt-4">
              <div>
                <p className="font-bold text-sm tracking-tight">Delivery fee</p>
                <p className="text-[10px] text-gray-500 font-medium">
                  {zone || "No zone selected"}
                </p>
              </div>
              <p
                className={`font-bold text-lg ${deliveryFee > 0 ? "text-white" : "text-gray-600"}`}
              >
                {fmt(deliveryFee)}
              </p>
            </div>
          )}

          <div className="pt-2">
            <div className="flex justify-between items-center border-t border-gray-800 pt-5 mb-4">
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                SUBTOTAL
              </p>
              <p className="text-xl font-bold">{fmt(subtotal)}</p>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-start border-t border-gray-800 pt-4">
                <div>
                  <p className="font-bold text-sm tracking-tight text-emerald-400">
                    Discount
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Promo — {selectedProduct.productName}
                  </p>
                </div>
                <p className="font-bold text-lg text-emerald-400">
                  -{fmt(discount)}
                </p>
              </div>
            )}
          </div>

          <div className="bg-red-600 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-90 leading-none mb-1">
                TOTAL AMOUNT
              </p>
              <p className="text-[11px] font-medium opacity-80">
                {orderType === "delivery" ? "With delivery" : "Pickup"}
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-black">{fmt(total)}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <h3 className="text-white font-bold text-sm mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-3 pt-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-red-500 text-2xl font-bold leading-none mb-1">
              {totalDishCount}
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              DISHES
            </p>
          </div>
          <div className="text-center border-x border-gray-800">
            <p className="text-emerald-500 text-2xl font-bold leading-none mb-1">
              {freebiesCount}
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              FREEBIES
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 text-2xl font-bold leading-none mb-1">
              {selectedProduct ? 1 : 0}
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
