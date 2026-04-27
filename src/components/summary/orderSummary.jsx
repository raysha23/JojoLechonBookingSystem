import React, { useEffect, useMemo } from "react";

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
    items,
    deliveryCharges,
    paymentMethod,
    setPaymentMethod,
    totalAmount,
    setTotalAmount,
  } = orderState;

  const fmt = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

  // Pure calculation
  const orderTotal = useMemo(() => {
    let packageTotal = 0;
    let extraDishesTotal = 0;
    let upgradeTotal = 0;
    let discount = 0;
    let totalDishCount = 0;
    let freebiesCount = 0;

    items.forEach((item) => {
      if (item.selectedProduct) {
        packageTotal += Number(item.selectedProduct.amount || 0);
        upgradeTotal += Number(item.upgradeAmount || 0);
        if (item.selectedProduct.promoAmount) {
          discount += Math.abs(Number(item.selectedProduct.promoAmount));
        }
        const filledExtra = (item.extraDishes || []).filter(Boolean).length;
        extraDishesTotal += filledExtra * EXTRA_DISH_PRICE;
        totalDishCount += (item.requiredDishes?.length || 0) + filledExtra;
        freebiesCount += item.selectedProduct.freebies?.length || 0;
      }
    });

    const deliveryFee =
      orderType === "delivery" ? getDeliveryFee(zone, deliveryCharges) : 0;
    const subtotal =
      packageTotal + extraDishesTotal + deliveryFee + upgradeTotal;
    const total = subtotal - discount;

    return {
      packageTotal,
      extraDishesTotal,
      upgradeTotal,
      deliveryFee,
      discount,
      subtotal,
      total,
      totalDishCount,
      freebiesCount,
      itemCount: items.filter((i) => i.selectedProduct).length,
    };
  }, [items, orderType, zone, deliveryCharges]);

  useEffect(() => {
    setTotalAmount(orderTotal.total);
  }, [orderTotal.total, setTotalAmount]);

  const productNames = items
    .filter((item) => item.selectedProduct)
    .map((item) => item.selectedProduct.productName);

  return (
    <div className="bg-[#0d0d0d] text-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
      <h2 className="text-2xl font-black mb-1">Order Summary</h2>
      <div className="w-12 h-1 bg-red-600 mb-8"></div>

      <div className="space-y-5">
        {/* PRODUCTS */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm tracking-tight">
                {orderTotal.itemCount} Package
                {orderTotal.itemCount !== 1 ? "s" : ""}
              </p>
              <div className="mt-1 text-[10px] text-gray-400 font-medium max-w-[160px] space-y-0.5">
                {productNames.map((name, idx) => (
                  <div key={idx} className="truncate" title={name}>
                    {name}
                  </div>
                ))}
                {orderTotal.itemCount === 0 && (
                  <div className="text-gray-600">No products selected</div>
                )}
              </div>
            </div>
            <p className="font-bold text-lg">{fmt(orderTotal.packageTotal)}</p>
          </div>

          {orderTotal.upgradeTotal > 0 && (
            <div className="flex justify-between items-start border-t border-gray-800 pt-4">
              <div>
                <p className="font-bold text-sm tracking-tight">Upgrades</p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Weight upgrades
                </p>
              </div>
              <p className="font-bold text-lg">
                {fmt(orderTotal.upgradeTotal)}
              </p>
            </div>
          )}

          {orderTotal.extraDishesTotal > 0 && (
            <div className="flex justify-between items-start border-t border-gray-800 pt-4">
              <div>
                <p className="font-bold text-sm tracking-tight">Extra Dishes</p>
                <p className="text-[10px] text-gray-500 font-medium">
                  {orderTotal.totalDishCount} total dishes
                </p>
              </div>
              <p className="font-bold text-lg">
                {fmt(orderTotal.extraDishesTotal)}
              </p>
            </div>
          )}

          {orderType === "delivery" && orderTotal.deliveryFee > 0 && (
            <div className="flex justify-between items-start border-t border-gray-800 pt-4">
              <div>
                <p className="font-bold text-sm tracking-tight">Delivery</p>
                <p className="text-[10px] text-gray-500 font-medium">{zone}</p>
              </div>
              <p className="font-bold text-lg">{fmt(orderTotal.deliveryFee)}</p>
            </div>
          )}

          <div className="pt-2">
            <div className="flex justify-between items-center border-t border-gray-800 pt-5 mb-4">
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                SUBTOTAL
              </p>
              <p className="text-xl font-bold">{fmt(orderTotal.subtotal)}</p>
            </div>
            {orderTotal.discount > 0 && (
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-sm tracking-tight text-emerald-400">
                    Discounts Applied
                  </p>
                  <p className="font-bold text-lg text-emerald-400">
                    -{fmt(orderTotal.discount)}
                  </p>
                </div>

                {/* Individual discounts */}
                <div className="space-y-1.5 max-h-20 overflow-y-auto pr-2">
                  {items
                    .filter((item) => item.selectedProduct?.promoAmount)
                    .map((item, idx) => {
                      const discount = Math.abs(
                        Number(item.selectedProduct.promoAmount),
                      );
                      return (
                        <div
                          key={item.id || idx}
                          className="flex items-center justify-between text-xs text-emerald-300 bg-emerald-500/10 p-2 rounded-lg"
                        >
                          <span className="truncate font-medium">
                            {item.selectedProduct.productName}
                          </span>
                          <span className="font-bold">{fmt(discount)}</span>
                        </div>
                      );
                    })}
                </div>
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
            <p className="text-2xl sm:text-3xl font-black">
              {fmt(orderTotal.total)}
            </p>
          </div>
        </div>

        {/* ✅ PAYMENT METHOD RESTORED */}
        <div className="pt-6 border-t border-gray-800">
          <h3 className="text-white font-bold text-sm mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center group hover:scale-[1.02] ${
                paymentMethod === "cod"
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25"
                  : "border-gray-700 hover:border-gray-600 bg-gray-900/50"
              }`}
            >
              <div
                className={`text-xl mb-1 transition-transform group-hover:scale-110 ${paymentMethod === "cod" ? "text-blue-400" : "text-gray-400"}`}
              >
                💵
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${paymentMethod === "cod" ? "text-white" : "text-gray-400"}`}
              >
                Cash
                <br />
                Delivery
              </span>
            </button>

            <button
              onClick={() => setPaymentMethod("gcash")}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center group hover:scale-[1.02] ${
                paymentMethod === "gcash"
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/25"
                  : "border-gray-700 hover:border-gray-600 bg-gray-900/50"
              }`}
            >
              <div
                className={`text-xl mb-1 transition-transform group-hover:scale-110 ${paymentMethod === "gcash" ? "text-green-400" : "text-gray-400"}`}
              >
                📱
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${paymentMethod === "gcash" ? "text-white" : "text-gray-400"}`}
              >
                GCash
              </span>
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 pt-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-red-500 text-2xl font-bold leading-none mb-1">
              {orderTotal.totalDishCount}
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              DISHES
            </p>
          </div>
          <div className="text-center border-x border-gray-800">
            <p className="text-emerald-500 text-2xl font-bold leading-none mb-1">
              {orderTotal.freebiesCount}
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              FREEBIES
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 text-2xl font-bold leading-none mb-1">
              {orderTotal.itemCount}
            </p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              PACKAGES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
