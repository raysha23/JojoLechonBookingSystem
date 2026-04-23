import { useEffect, useState } from "react";

const EXTRA_DISH_PRICE = 700;

function getDeliveryFee(zone, deliveryCharges = []) {
  if (!zone || deliveryCharges.length === 0) return 0;
  const charge = deliveryCharges.find((item) => item.zoneName === zone);
  return charge ? Number(charge.minAmount || 0) : 0;
}

export default function ConfirmOrderModal({
  orderState,
  onConfirm,
  onCancel,
  onBookAgain,
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
    requiredDishes,
    extraDishes,
    paymentMethod,
    deliveryCharges,
    dishes,
  } = orderState;

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const fmt = (n) =>
    "PHP " + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

  const filledExtraDishes = (extraDishes || []).filter((d) => d !== "");
  const extraDishesTotal = filledExtraDishes.length * EXTRA_DISH_PRICE;
  const packageTotal = selectedProduct ? selectedProduct.amount : 0;
  const deliveryFee =
    orderType === "delivery" ? getDeliveryFee(zone, deliveryCharges) : 0;
  const discount = selectedProduct?.promoAmount
    ? Math.abs(Number(selectedProduct.promoAmount))
    : 0;
  const subtotal = packageTotal + extraDishesTotal + deliveryFee;
  const total = subtotal - discount;

  const resolvedRequiredDishes = (requiredDishes || [])
    .filter(Boolean)
    .map((id) => dishes?.find((d) => String(d.id) === String(id)))
    .filter(Boolean);

  const resolvedExtraDishes = filledExtraDishes
    .map((id) => dishes?.find((d) => String(d.id) === String(id)))
    .filter(Boolean);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && !orderSuccess) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel, orderSuccess]);

  // Wrap onConfirm to handle receipt transition
  const handleConfirm = async () => {
    try {
      await onConfirm();
      // Generate a simple order number for the receipt
      const num = "ORD-" + Date.now().toString().slice(-6);
      setOrderNumber(num);
      setOrderSuccess(true);
    } catch {
      // error handling is done in parent
    }
  };

  // ── PDF DOWNLOAD ──────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    const { jsPDF } =
      await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    const doc = new jsPDF({ unit: "mm", format: "a5" });

    const W = doc.internal.pageSize.getWidth();
    let y = 15;

    const lineH = 6;
    const sectionGap = 5;
    const indent = 14;
    const rightEdge = W - indent;

    // ── helpers ──
    const drawLine = (yPos, color = [220, 220, 220]) => {
      doc.setDrawColor(...color);
      doc.line(indent, yPos, rightEdge, yPos);
    };

    const sectionTitle = (text) => {
      y += sectionGap;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(indent, y - 4, W - indent * 2, 8, 2, 2, "F");
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(150, 150, 150);
      doc.text(text.toUpperCase(), indent + 3, y + 1);
      y += lineH + 1;
    };

    const row = (label, value, bold = false) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(label, indent + 3, y);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(value), rightEdge, y, { align: "right" });
      y += lineH;
      drawLine(y - 1);
    };

    // ── HEADER ──
    doc.setFillColor(185, 28, 28);
    doc.rect(0, 0, W, 22, "F");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Jojo's Lechon", W / 2, 10, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 200, 200);
    doc.text("Order Receipt", W / 2, 16, { align: "center" });

    y = 28;

    // Order number + date
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(185, 28, 28);
    doc.text(orderNumber, indent, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(
      new Date().toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      rightEdge,
      y,
      { align: "right" },
    );
    y += 3;
    drawLine(y, [185, 28, 28]);
    y += sectionGap;

    // ── CUSTOMER ──
    sectionTitle("Customer");
    row("Name", customerName || "—");
    row("Contact", contacts.filter(Boolean).join(", ") || "—");
    if (facebookProfile) row("Facebook", facebookProfile);

    // ── DELIVERY ──
    sectionTitle("Delivery");
    row("Type", orderType === "delivery" ? "Delivery" : "Pickup");
    row("Date", deliveryDate || "—");
    row("Time", deliveryTime || "—");
    if (orderType === "delivery") {
      row("Address", address || "—");
      row("Zone", zone || "—");
    }
    row("Payment", paymentMethod === "gcash" ? "GCash" : "Cash on Delivery");

    // ── ORDER ──
    sectionTitle("Order");
    if (selectedProduct) {
      row("Package", selectedProduct.productName);
      row("Package Price", fmt(packageTotal));
    }

    if (resolvedRequiredDishes.length > 0) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text("Included Dishes:", indent + 3, y);
      y += lineH;
      resolvedRequiredDishes.forEach((d) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`  • ${d.dishName}`, indent + 3, y);
        y += lineH - 1;
      });
    }

    if (resolvedExtraDishes.length > 0) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text("Extra Dishes:", indent + 3, y);
      y += lineH;
      resolvedExtraDishes.forEach((d) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`  • ${d.dishName}`, indent + 3, y);
        doc.text(fmt(EXTRA_DISH_PRICE), rightEdge, y, { align: "right" });
        y += lineH - 1;
      });
    }

    // ── PRICING ──
    sectionTitle("Pricing Summary");
    if (selectedProduct) row("Package", fmt(packageTotal));
    if (filledExtraDishes.length > 0)
      row("Extra Dishes", fmt(extraDishesTotal));
    if (orderType === "delivery") row("Delivery Fee", fmt(deliveryFee));
    if (discount > 0) row("Discount", `-${fmt(discount)}`);

    // Total
    y += 2;
    doc.setFillColor(185, 28, 28);
    doc.roundedRect(indent, y - 4, W - indent * 2, 10, 2, 2, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("TOTAL", indent + 4, y + 2);
    doc.text(fmt(total), rightEdge - 2, y + 2, { align: "right" });
    y += 14;

    // ── FOOTER ──
    drawLine(y, [185, 28, 28]);
    y += 5;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(160, 160, 160);
    doc.text("Thank you for ordering from Jojo's Lechon!", W / 2, y, {
      align: "center",
    });
    y += 4;
    doc.text("This receipt was generated electronically.", W / 2, y, {
      align: "center",
    });

    doc.save(`JojosLechon_${orderNumber}.pdf`);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && !orderSuccess) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel, orderSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!orderSuccess ? onCancel : undefined}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* TOP ACCENT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700" />

        {orderSuccess ? (
          /* ══════════════════════════════════════
             RECEIPT VIEW
          ══════════════════════════════════════ */
          <>
            {/* HEADER */}
            <div className="px-8 pt-7 pb-5 border-b border-gray-100 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-7 h-7 text-emerald-500"
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
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Order Recorded!
              </h2>
              <p className="text-sm text-gray-400 font-medium mt-1">
                <span className="font-black text-red-600">{orderNumber}</span>
              </p>
            </div>

            {/* RECEIPT BODY */}
            <div className="px-8 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
              <ReceiptSection title="Customer">
                <ReceiptRow label="Name" value={customerName || "—"} />
                <ReceiptRow
                  label="Contact"
                  value={contacts.filter(Boolean).join(", ") || "—"}
                />
                {facebookProfile && (
                  <ReceiptRow label="Facebook" value={facebookProfile} />
                )}
              </ReceiptSection>

              <ReceiptSection title="Delivery">
                <ReceiptRow
                  label="Type"
                  value={orderType === "delivery" ? "Delivery" : "Pickup"}
                  highlight
                />
                <ReceiptRow label="Date" value={deliveryDate || "—"} />
                <ReceiptRow label="Time" value={deliveryTime || "—"} />
                {orderType === "delivery" && (
                  <>
                    <ReceiptRow label="Address" value={address || "—"} />
                    <ReceiptRow label="Zone" value={zone || "—"} />
                  </>
                )}
                <ReceiptRow
                  label="Payment"
                  value={
                    paymentMethod === "gcash"
                      ? "📱 GCash"
                      : "💵 Cash on Delivery"
                  }
                />
              </ReceiptSection>

              <ReceiptSection title="Order">
                {selectedProduct && (
                  <ReceiptRow
                    label="Package"
                    value={selectedProduct.productName}
                  />
                )}
                {resolvedRequiredDishes.length > 0 && (
                  <div className="py-2 border-b border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5">
                      Included Dishes
                    </p>
                    {resolvedRequiredDishes.map((d, i) => (
                      <p
                        key={i}
                        className="text-xs text-gray-600 font-medium py-0.5"
                      >
                        • {d.dishName}
                      </p>
                    ))}
                  </div>
                )}
                {resolvedExtraDishes.length > 0 && (
                  <div className="py-2 border-b border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5">
                      Extra Dishes
                    </p>
                    {resolvedExtraDishes.map((d, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-gray-600 font-medium py-0.5"
                      >
                        <span>• {d.dishName}</span>
                        <span className="text-gray-800 font-black">
                          {fmt(EXTRA_DISH_PRICE)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ReceiptSection>

              <ReceiptSection title="Pricing">
                {selectedProduct && (
                  <ReceiptRow label="Package" value={fmt(packageTotal)} />
                )}
                {filledExtraDishes.length > 0 && (
                  <ReceiptRow
                    label="Extra Dishes"
                    value={fmt(extraDishesTotal)}
                  />
                )}
                {orderType === "delivery" && (
                  <ReceiptRow label="Delivery Fee" value={fmt(deliveryFee)} />
                )}
                {discount > 0 && (
                  <ReceiptRow
                    label="Discount"
                    value={`-${fmt(discount)}`}
                    green
                  />
                )}
                <div className="mt-2 pt-3 border-t-2 border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-800">
                    Total
                  </span>
                  <span className="text-lg font-black text-red-600">
                    {fmt(total)}
                  </span>
                </div>
              </ReceiptSection>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 px-6 py-3 rounded-2xl bg-gray-900 text-white font-black text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Receipt
              </button>
              <button
                onClick={onBookAgain}
                className="flex-1 px-6 py-3 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
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
                Book Again
              </button>
            </div>
          </>
        ) : (
          /* ══════════════════════════════════════
             CONFIRM VIEW (original)
          ══════════════════════════════════════ */
          <>
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
              <Section title="Customer">
                <Row label="Name" value={customerName || "—"} />
                <Row
                  label="Contact"
                  value={contacts.filter(Boolean).join(", ") || "—"}
                />
                {facebookProfile && (
                  <Row label="Facebook" value={facebookProfile} />
                )}
              </Section>

              <Section title="Delivery">
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

              <Section title="Order">
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

              <Section title="Pricing">
                <Row label="Package total" value={fmt(packageTotal)} />
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
                  <span className="text-sm font-black text-gray-800">
                    Total
                  </span>
                  <span className="text-lg font-black text-red-600">
                    {fmt(total)}
                  </span>
                </div>
              </Section>

              <Section title="Payment">
                <Row
                  label="Method"
                  value={
                    paymentMethod === "gcash"
                      ? "📱 GCash"
                      : "💵 Cash on Delivery"
                  }
                />
              </Section>
            </div>

            {/* FOOTER */}
            <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
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
          </>
        )}
      </div>
    </div>
  );
}

/* ── RECEIPT SUB COMPONENTS ─────────────────────────────────────── */

function ReceiptSection({ title, children }) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">
        {title}
      </p>
      <div className="bg-gray-50 rounded-2xl px-4 py-1 space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function ReceiptRow({ label, value, highlight = false, green = false }) {
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

/* ── CONFIRM VIEW SUB COMPONENTS ────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[12px] font-black text-gray-600 uppercase tracking-[0.15em] mb-3">
        {title}
      </p>
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
