import React from "react";

const EXTRA_DISH_PRICE = 700;

function getDeliveryFee(zone, deliveryCharges = []) {
  if (!zone || deliveryCharges.length === 0) return 0;
  const charge = deliveryCharges.find((item) => item.zoneName === zone);
  return charge
    ? Number(charge.baseFee || 0) + Number(charge.surcharge || 0)
    : 0;
}

export default function Step3({ orderState }) {
  const {
    orderType,
    zone,
    address,
    deliveryDate,
    deliveryTime,
    items, // ✅ FIXED: Use items array
    paymentMethod,
    customerName,
    contacts,
    facebookProfile,
    dishes,
    deliveryCharges,
  } = orderState;

  // ✅ FIXED: Calculate totals for ALL items
  const deliveryFee =
    orderType === "delivery" ? getDeliveryFee(zone, deliveryCharges) : 0;

  const allExtraDishes = items.flatMap((item) => item.extraDishes || []);
  const filledExtraDishes = allExtraDishes.filter((d) => d !== "");
  const dishesTotal = filledExtraDishes.length * EXTRA_DISH_PRICE;

  // Sum all packages + upgrades
  const packageTotal = items.reduce((sum, item) => {
    const pkg = item.selectedProduct?.amount || 0;
    const upgrade = item.upgradeAmount || 0;
    return sum + pkg + upgrade;
  }, 0);

  // Calculate total discount
  const discount = items.reduce((sum, item) => {
    return (
      sum +
      (item.selectedProduct?.promoAmount
        ? Math.abs(Number(item.selectedProduct.promoAmount))
        : 0)
    );
  }, 0);

  const total = packageTotal + dishesTotal + deliveryFee - discount;

  const fmt = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });
  const getUpgradeKg = (amount) => {
    if (amount === 500) return "1kg";
    if (amount === 1000) return "2-3kg";
    if (amount === 2000) return "5-6kg";
    return "";
  };

  const paymentLabel = paymentMethod === "gcash" ? "GCash" : "Cash on Delivery";
  const paymentIcon = paymentMethod === "gcash" ? "📱" : "💵";

  return (
    <div className="space-y-6 pb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            value={
              facebookProfile ? (
                <span className="truncate block max-w-[200px]">
                  {facebookProfile}
                </span>
              ) : (
                "N/A"
              )
            }
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
              <DetailRow
                label="Delivery Fee"
                value={deliveryFee > 0 ? fmt(deliveryFee) : "FREE"}
              />
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

      {/* 3. ORDER ITEMS - ✅ FIXED MULTIPLE ITEMS */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
            Order Summary ({items.length}{" "}
            {items.length === 1 ? "item" : "items"})
          </h3>
        </div>
        <div className="p-6">
          {/* ALL ORDER ITEMS */}
          {items.map((item, index) => (
            <OrderItemSummary
              key={item.id}
              item={item}
              index={index + 1}
              dishes={dishes}
              fmt={fmt}
            />
          ))}

          {/* EXTRA DISHES */}
          {filledExtraDishes.length > 0 && (
            <>
              <div className="h-px bg-gray-200 my-6"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Additional Dishes ({filledExtraDishes.length})
                </p>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  ₱{EXTRA_DISH_PRICE} each
                </span>
              </div>
              <div className="space-y-2 mb-6">
                {filledExtraDishes.map((dishIndex, i) => {
                  const dish = dishes.find(
                    (d) => String(d.id) === String(dishIndex),
                  );
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl"
                    >
                      <span className="text-sm font-bold text-gray-700">
                        {dish?.dishName || "Selected Dish"}
                      </span>
                      <span className="font-black text-gray-900">
                        {fmt(EXTRA_DISH_PRICE)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* GRAND TOTAL */}
          <div className="mt-8 pt-6 border-t-2 border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">{fmt(packageTotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-bold text-green-600">
                  - {fmt(discount)}
                </span>
              </div>
            )}
            {dishesTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Extra Dishes</span>
                <span className="font-bold">{fmt(dishesTotal)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-bold">{fmt(deliveryFee)}</span>
              </div>
            )}
            <div className="h-px bg-gray-200 my-2"></div>
            <ItemRow name="TOTAL" price={fmt(total)} isBold />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ NEW: Order Item Summary Component
function OrderItemSummary({ item, index, dishes, fmt }) {
  if (!item.selectedProduct) return null;

  const requiredDishes = (item.requiredDishes || []).filter((d) => d !== "");
  const dishNames = requiredDishes.map((dishId) => {
    const dish = dishes.find((d) => String(d.id) === String(dishId));
    return dish?.dishName || "Dish";
  });

  return (
    <div className="mb-6 pb-6 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
      {/* Item Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black shrink-0">
            {index}
          </div>
          <div>
            <p className="font-black text-lg text-gray-900 leading-tight">
              {item.selectedProduct.productName}
            </p>
            {item.upgradeAmount > 0 && (
              <p className="text-sm text-red-600 font-bold">
                + Upgrade ({getUpgradeKg(item.upgradeAmount)})
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-lg">
            {fmt(item.selectedProduct.amount)}
          </p>
          {item.upgradeAmount > 0 && (
            <p className="text-sm text-gray-500">+ {fmt(item.upgradeAmount)}</p>
          )}
        </div>
      </div>

      {/* Included Dishes */}
      {requiredDishes.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
            Included Dishes:
          </p>
          <div className="flex flex-wrap gap-2">
            {dishNames.map((name, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white text-xs font-bold text-gray-700 rounded-full shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Keep your existing sub-components (DetailRow, ItemRow, FreebieCard)
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
      className={`flex justify-between items-center py-2 ${isBold ? "pt-3 pb-4" : ""}`}
    >
      <span
        className={`text-sm font-bold ${isBold ? "text-xl text-gray-900" : "text-gray-500"}`}
      >
        {name}
      </span>
      <span
        className={`font-black ${isBold ? "text-2xl text-gray-900" : "text-sm text-gray-800"}`}
      >
        {price}
      </span>
    </div>
  );
}
