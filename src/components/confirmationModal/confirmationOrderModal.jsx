import { useEffect, useRef, useState } from "react";

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
    upgradeAmount,
  } = orderState;

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const receiptRef = useRef(null);

  const fmt = (n) =>
    "PHP " + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

  const getUpgradeKg = (amount) => {
    if (amount === 500) return "1kg";
    if (amount === 1000) return "2-3kg";
    if (amount === 2000) return "5-6kg";
    return "";
  };

  const filledExtraDishes = (extraDishes || []).filter((d) => d !== "");
  const extraDishesTotal = filledExtraDishes.length * EXTRA_DISH_PRICE;
  const packageTotal = selectedProduct ? selectedProduct.amount : 0;
  const deliveryFee =
    orderType === "delivery" ? getDeliveryFee(zone, deliveryCharges) : 0;
  const discount = selectedProduct?.promoAmount
    ? Math.abs(Number(selectedProduct.promoAmount))
    : 0;
  const upgradeTotal = upgradeAmount || 0;
  const subtotal = packageTotal + extraDishesTotal + deliveryFee + upgradeTotal;
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
    const {default: jsPDF} = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a5" });

    const W = doc.internal.pageSize.getWidth(); // 148mm
    const margin = 14;
    const contentW = W - margin * 2;
    let y = 0;

    // ── COLOR PALETTE ─────────────────────────────────────────────
    const RED = [185, 28, 28];
    const RED_LIGHT = [254, 226, 226];
    const DARK = [17, 24, 39];
    const MID = [107, 114, 128];
    const LIGHT = [209, 213, 219];
    const BG = [249, 250, 251];
    const GREEN = [5, 150, 105];
    const WHITE = [255, 255, 255];

    // ── UTILS ──────────────────────────────────────────────────────
    const setFont = (size, style = "normal", color = DARK) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", style);
      doc.setTextColor(...color);
    };

    const fillRect = (x, fy, w, h, color, radius = 0) => {
      doc.setFillColor(...color);
      if (radius > 0) doc.roundedRect(x, fy, w, h, radius, radius, "F");
      else doc.rect(x, fy, w, h, "F");
    };

    const hRule = (fy, color = LIGHT) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.15);
      doc.line(margin, fy, W - margin, fy);
    };

    const labelValue = (label, value, fy, opts = {}) => {
      const { valBold = false, valColor = DARK, small = false } = opts;
      const fs = small ? 7.5 : 8.5;
      setFont(fs, "normal", MID);
      doc.text(label, margin + 3, fy);
      setFont(fs, valBold ? "bold" : "normal", valColor);
      doc.text(String(value), W - margin - 3, fy, { align: "right" });
    };

    // ── HEADER BLOCK ───────────────────────────────────────────────
    // Full-width red header
    fillRect(0, 0, W, 30, RED);

    // Brand name
    setFont(18, "bold", WHITE);
    doc.text("Jojo's Lechon", W / 2, 13, { align: "center" });

    // Subtitle
    setFont(8, "normal", [254, 202, 202]);
    doc.text("Official Order Receipt", W / 2, 20, { align: "center" });

    // Thin white underline accent
    doc.setDrawColor(...WHITE);
    doc.setLineWidth(0.4);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(W / 2 - 20, 23, W / 2 + 20, 23);
    doc.setLineDashPattern([], 0);

    y = 36;

    // ── ORDER META ROW ─────────────────────────────────────────────
    // Order number pill
    fillRect(margin, y - 4.5, 38, 7, RED_LIGHT, 2);
    setFont(7.5, "bold", RED);
    doc.text(orderNumber, margin + 3, y);

    // Date right-aligned
    setFont(7.5, "normal", MID);
    doc.text(
      new Date().toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      W - margin - 3,
      y,
      { align: "right" },
    );

    y += 5;
    hRule(y, RED);
    y += 7;

    // ── SECTION HELPER ─────────────────────────────────────────────
    const section = (title) => {
      // Section label with left accent bar
      fillRect(margin, y - 3.5, 2.5, 7, RED, 1);
      setFont(7, "bold", MID);
      doc.text(title.toUpperCase(), margin + 5, y);

      // Subtle bg strip
      fillRect(margin, y + 1.5, contentW, 0.3, LIGHT);
      y += 7;
    };

    const row = (label, value, opts = {}) => {
      labelValue(label, value, y, opts);
      y += 5.5;
      hRule(y - 1.5);
    };

    // ── CUSTOMER ───────────────────────────────────────────────────
    section("Customer Information");
    row("Full Name", customerName || "—", { valBold: true });
    row("Contact", contacts.filter(Boolean).join("  •  ") || "—");
    if (facebookProfile) row("Facebook", facebookProfile);
    y += 3;

    // ── DELIVERY ───────────────────────────────────────────────────
    section("Delivery Details");
    row("Order Type", orderType === "delivery" ? "Delivery" : "Pickup", {
      valBold: true,
      valColor: RED,
    });
    row("Date", deliveryDate || "—");
    row("Time", deliveryTime || "—");
    if (orderType === "delivery") {
      row("Address", address || "—");
      row("Zone", zone || "—");
    }
    row(
      "Payment Method",
      paymentMethod === "gcash" ? "GCash" : "Cash on Delivery",
    );
    y += 3;

    // ── ORDER ──────────────────────────────────────────────────────
    section("Order Details");

    if (selectedProduct) {
      // Package name in a highlighted box
      fillRect(margin, y - 3.5, contentW, 9, BG, 2);
      setFont(8.5, "bold", DARK);
      doc.text(selectedProduct.productName, margin + 4, y);
      setFont(8.5, "bold", RED);
      doc.text(fmt(packageTotal), W - margin - 4, y, { align: "right" });
      y += 9;
    }

    // Upgrade
    if (upgradeTotal > 0) {
      y += 2;
      setFont(8, "bold", DARK);
      doc.text(`UPGRADE (${getUpgradeKg(upgradeAmount).toUpperCase()})`, margin + 4, y);
      setFont(8, "bold", RED);
      doc.text(fmt(upgradeTotal), W - margin - 4, y, { align: "right" });
      y += 6;
    }

    // Included dishes
    if (resolvedRequiredDishes.length > 0) {
      y += 2;
      setFont(7, "bold", MID);
      doc.text("INCLUDED DISHES", margin + 3, y);
      y += 4.5;
      resolvedRequiredDishes.forEach((d) => {
        // Dot bullet
        doc.setFillColor(...MID);
        doc.circle(margin + 4.5, y - 1.5, 0.8, "F");
        setFont(8, "normal", DARK);
        doc.text(d.dishName, margin + 7, y);
        y += 5;
      });
    }

    // Extra dishes
    if (resolvedExtraDishes.length > 0) {
      y += 2;
      setFont(7, "bold", MID);
      doc.text("EXTRA DISHES", margin + 3, y);
      y += 4.5;
      resolvedExtraDishes.forEach((d) => {
        doc.setFillColor(...RED);
        doc.circle(margin + 4.5, y - 1.5, 0.8, "F");
        setFont(8, "normal", DARK);
        doc.text(d.dishName, margin + 7, y);
        setFont(8, "bold", DARK);
        doc.text(fmt(EXTRA_DISH_PRICE), W - margin - 3, y, { align: "right" });
        y += 5;
      });
    }

    y += 4;

    // ── PRICING ────────────────────────────────────────────────────
    section("Pricing Summary");

    if (selectedProduct) row("Package", fmt(packageTotal));
    if (filledExtraDishes.length > 0)
      row("Extra Dishes", fmt(extraDishesTotal));
    if (upgradeTotal > 0) row(`Upgrade (${getUpgradeKg(upgradeAmount)})`, fmt(upgradeTotal));
    if (orderType === "delivery") row("Delivery Fee", fmt(deliveryFee));
    if (discount > 0)
      row("Discount", `-${fmt(discount)}`, { valColor: GREEN, valBold: true });

    y += 4;

    // ── TOTAL BAR ──────────────────────────────────────────────────
    // Shadow effect (slightly larger dark rect behind)
    fillRect(margin + 0.5, y + 0.5, contentW, 14, [150, 20, 20], 3);
    fillRect(margin, y, contentW, 14, RED, 3);

    setFont(9, "bold", WHITE);
    doc.text("TOTAL AMOUNT DUE", margin + 5, y + 9);

    setFont(13, "bold", WHITE);
    doc.text(fmt(total), W - margin - 5, y + 9, { align: "right" });

    y += 22;

    // ── FOOTER ─────────────────────────────────────────────────────
    hRule(y, LIGHT);
    y += 5;
    setFont(7, "italic", [180, 180, 180]);
    doc.text("Thank you for choosing Jojo's Lechon!", W / 2, y, {
      align: "center",
    });
    y += 4;
    setFont(6.5, "normal", [200, 200, 200]);
    doc.text("This is an electronically generated receipt.", W / 2, y, {
      align: "center",
    });

    doc.save(`JojosLechon_${orderNumber}.pdf`);
  };

  const handleDownloadImage = async () => {
    const {default: html2canvas} = await import("html2canvas");
    const hiddenDiv = document.getElementById("receipt-full-capture");
    if (!hiddenDiv) return;

    hiddenDiv.style.display = "block";
    try {
      const canvas = await html2canvas(hiddenDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `JojosLechon_${orderNumber}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      hiddenDiv.style.display = "none";
    }
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
            <div ref={receiptRef}>
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
                  {upgradeTotal > 0 && (
                    <ReceiptRow
                      label={`Upgrade (${getUpgradeKg(upgradeAmount)})`}
                      value={fmt(upgradeTotal)}
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
                  {upgradeTotal > 0 && (
                    <ReceiptRow label={`Upgrade (${getUpgradeKg(upgradeAmount)})`} value={fmt(upgradeTotal)} />
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
                onClick={handleDownloadImage}
                className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
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
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
                Save as Image
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
                {upgradeTotal > 0 && (
                  <Row
                    label={`Upgrade (${getUpgradeKg(upgradeAmount)})`}
                    value={fmt(upgradeTotal)}
                  />
                )}
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
                {upgradeTotal > 0 && (
                  <Row
                    label={`Upgrade (${getUpgradeKg(upgradeAmount)})`}
                    value={fmt(upgradeTotal)}
                  />
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

      {/* HIDDEN FULL RECEIPT FOR IMAGE CAPTURE */}
      {orderSuccess && (
        <div
          id="receipt-full-capture"
          style={{
            display: "none",
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "480px",
            backgroundColor: "#ffffff",
            padding: "0",
            fontFamily: "sans-serif",
          }}
        >
          {/* RED HEADER */}
          <div
            style={{
              backgroundColor: "#b91c1c",
              padding: "24px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#fff" }}>
              Jojo's Lechon
            </div>
            <div
              style={{ fontSize: "11px", color: "#fecaca", marginTop: "4px" }}
            >
              Order Receipt
            </div>
          </div>

          {/* ORDER NUMBER + DATE */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 24px 10px",
              borderBottom: "2px solid #b91c1c",
            }}
          >
            <span
              style={{ fontWeight: "900", color: "#b91c1c", fontSize: "13px" }}
            >
              {orderNumber}
            </span>
            <span style={{ color: "#aaa", fontSize: "12px" }}>
              {new Date().toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* BODY */}
          <div style={{ padding: "0 24px 24px" }}>
            {/* CUSTOMER */}
            <CaptureSection title="Customer">
              <CaptureRow label="Name" value={customerName || "—"} />
              <CaptureRow
                label="Contact"
                value={contacts.filter(Boolean).join(", ") || "—"}
              />
              {facebookProfile && (
                <CaptureRow label="Facebook" value={facebookProfile} />
              )}
            </CaptureSection>

            {/* DELIVERY */}
            <CaptureSection title="Delivery">
              <CaptureRow
                label="Type"
                value={orderType === "delivery" ? "Delivery" : "Pickup"}
              />
              <CaptureRow label="Date" value={deliveryDate || "—"} />
              <CaptureRow label="Time" value={deliveryTime || "—"} />
              {orderType === "delivery" && (
                <>
                  <CaptureRow label="Address" value={address || "—"} />
                  <CaptureRow label="Zone" value={zone || "—"} />
                </>
              )}
              <CaptureRow
                label="Payment"
                value={paymentMethod === "gcash" ? "GCash" : "Cash on Delivery"}
              />
            </CaptureSection>

            {/* ORDER */}
            <CaptureSection title="Order">
              {selectedProduct && (
                <CaptureRow
                  label="Package"
                  value={selectedProduct.productName}
                />
              )}
              {resolvedRequiredDishes.length > 0 && (
                <div
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: "800",
                      color: "#aaa",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Included Dishes
                  </div>
                  {resolvedRequiredDishes.map((d, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        padding: "2px 0",
                      }}
                    >
                      • {d.dishName}
                    </div>
                  ))}
                </div>
              )}
              {resolvedExtraDishes.length > 0 && (
                <div style={{ padding: "8px 0" }}>
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: "800",
                      color: "#aaa",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Extra Dishes
                  </div>
                  {resolvedExtraDishes.map((d, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        color: "#555",
                        padding: "2px 0",
                      }}
                    >
                      <span>• {d.dishName}</span>
                      <span style={{ fontWeight: "700", color: "#111" }}>
                        {fmt(EXTRA_DISH_PRICE)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {upgradeTotal > 0 && (
                <CaptureRow
                  label={`Upgrade (${getUpgradeKg(upgradeAmount)})`}
                  value={fmt(upgradeTotal)}
                />
              )}
            </CaptureSection>

            {/* PRICING */}
            <CaptureSection title="Pricing">
              {selectedProduct && (
                <CaptureRow label="Package" value={fmt(packageTotal)} />
              )}
              {filledExtraDishes.length > 0 && (
                <CaptureRow
                  label="Extra Dishes"
                  value={fmt(extraDishesTotal)}
                />
              )}
              {upgradeTotal > 0 && (
                <CaptureRow
                  label={`Upgrade (${getUpgradeKg(upgradeAmount)})`}
                  value={fmt(upgradeTotal)}
                />
              )}
              {orderType === "delivery" && (
                <CaptureRow label="Delivery Fee" value={fmt(deliveryFee)} />
              )}
              {discount > 0 && (
                <CaptureRow
                  label="Discount"
                  value={`-${fmt(discount)}`}
                  green
                />
              )}
            </CaptureSection>

            {/* TOTAL */}
            <div
              style={{
                backgroundColor: "#b91c1c",
                borderRadius: "12px",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: "900", fontSize: "14px" }}
              >
                TOTAL
              </span>
              <span
                style={{ color: "#fff", fontWeight: "900", fontSize: "20px" }}
              >
                {fmt(total)}
              </span>
            </div>

            {/* FOOTER */}
            <div
              style={{
                textAlign: "center",
                marginTop: "18px",
                color: "#bbb",
                fontSize: "10px",
              }}
            >
              Thank you for ordering from Jojo's Lechon!
              <br />
              This receipt was generated electronically.
            </div>
          </div>
        </div>
      )}
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

function CaptureSection({ title, children }) {
  return (
    <div style={{ marginTop: "16px" }}>
      <div
        style={{
          fontSize: "9px",
          fontWeight: "900",
          color: "#aaa",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          padding: "4px 14px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CaptureRow({ label, value, green = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "9px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <span style={{ fontSize: "11px", fontWeight: "700", color: "#aaa" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "11px",
          fontWeight: "800",
          color: green ? "#059669" : "#222",
        }}
      >
        {value}
      </span>
    </div>
  );
}
