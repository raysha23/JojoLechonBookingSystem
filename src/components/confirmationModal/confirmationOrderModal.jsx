import { useEffect } from "react";
import { deliveryCharges } from "../../data/deliveryfee-data";

const EXTRA_DISH_PRICE = 700;

function getDeliveryFee(zone) {
  if (!zone) return 0;
  for (const charge of deliveryCharges) {
    if (charge.zones.includes(zone)) return charge.minAmount;
  }
  return 0;
}

export default function ConfirmOrderModal({
  orderState,
  onConfirm,
  onCancel,
  isSubmitting,
}) {
  const {
    customerName,
    contacts,
    facebookProfile,
    orderType,
    zone,
    address,
    deliveryDate,
    deliveryTime,
    selectedProduct,
    extraDishes,
    paymentMethod,
  } = orderState;

  const fmt = (n) =>
    "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

  const filledExtraDishes = (extraDishes || []).filter((d) => d !== "");
  const extraDishesTotal = filledExtraDishes.length * EXTRA_DISH_PRICE;
  const packageTotal = selectedProduct ? selectedProduct.amount : 0;
  const deliveryFee = orderType === "delivery" ? getDeliveryFee(zone) : 0;
  const discount = selectedProduct?.promoAmount
    ? Math.abs(Number(selectedProduct.promoAmount))
    : 0;
  const subtotal = packageTotal + extraDishesTotal + deliveryFee;
  const total = subtotal - discount;

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* TOP ACCENT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700" />

        {/* HEADER */}
        <div className="px-8 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Confirm Order
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                Please review before submitting
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="px-8 py-6 space-y-5 max-h-[55vh] overflow-y-auto">
          {/* CUSTOMER */}
          <Section title="Customer" icon="👤">
            <Row label="Name" value={customerName || "—"} />
            <Row
              label="Contact"
              value={contacts.filter(Boolean).join(", ") || "—"}
            />
            {facebookProfile && (
              <Row label="Facebook" value={facebookProfile} />
            )}
          </Section>

          {/* DELIVERY */}
          <Section title="Delivery" icon="🚚">
            <Row
              label="Type"
              value={orderType === "delivery" ? "Delivery" : "Pickup"}
              highlight={orderType === "delivery"}
            />
            <Row label="Date" value={deliveryDate || "—"} />
            <Row label="Time" value={deliveryTime || "—"} />
            {orderType === "delivery" && (
              <>
                <Row label="Address" value={address || "—"} />
                <Row label="Zone" value={zone || "—"} />
              </>
            )}
          </Section>

          {/* ORDER */}
          <Section title="Order" icon="🍖">
            <Row
              label="Product"
              value={selectedProduct ? selectedProduct.productName : "—"}
            />
            {filledExtraDishes.length > 0 && (
              <Row
                label="Extra Dishes"
                value={`${filledExtraDishes.length} dish${filledExtraDishes.length > 1 ? "es" : ""}`}
              />
            )}
          </Section>

          {/* PRICING */}
          <Section title="Pricing" icon="💰">
            <Row label="Product total" value={fmt(packageTotal)} />
            {filledExtraDishes.length > 0 && (
              <Row label="Extra dishes" value={fmt(extraDishesTotal)} />
            )}
            {orderType === "delivery" && (
              <Row label="Delivery fee" value={fmt(deliveryFee)} />
            )}
            {discount > 0 && (
              <Row label="Discount" value={`-${fmt(discount)}`} green />
            )}
            <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-black text-gray-800">Total</span>
              <span className="text-lg font-black text-red-600">
                {fmt(total)}
              </span>
            </div>
          </Section>

          {/* PAYMENT */}
          <Section title="Payment" icon="💳">
            <Row
              label="Method"
              value={
                paymentMethod === "gcash" ? "📱 GCash" : "💵 Cash on Delivery"
              }
            />
          </Section>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          {/* CANCEL */}
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Recording...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SUB COMPONENTS ─────────────────────────────────────────────── */

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
          {title}
        </p>
      </div>
      <div className="bg-gray-50 rounded-2xl px-4 py-1 space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, highlight = false, green = false }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-bold text-gray-400">{label}</span>
      <span
        className={`text-xs font-black px-2 py-0.5 rounded-lg ${
          green
            ? "text-emerald-600 bg-emerald-50"
            : highlight
              ? "text-red-600 bg-red-50"
              : "text-gray-700 bg-white border border-gray-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
