import { useEffect, useRef, useState } from "react";

const EXTRA_DISH_PRICE = 700;

function getDeliveryFee(zone, deliveryCharges = []) {
  if (!zone || deliveryCharges.length === 0) return 0;
  const charge = deliveryCharges.find((item) => item.zoneName === zone);
  return charge
    ? Number(charge.baseFee || 0) + Number(charge.surcharge || 0)
    : 0;
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
    items, // ✅ MULTIPLE ITEMS SUPPORT
    paymentMethod,
    deliveryCharges,
    dishes,
  } = orderState;

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const receiptRef = useRef(null);
  const jsPDFRef = useRef(null);
  const html2canvasRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    import("jspdf").then((m) => (jsPDFRef.current = m.default));
    import("html2canvas").then((m) => (html2canvasRef.current = m.default));
  }, []);

  // ✅ SAME CALCULATIONS AS STEP 3
  const deliveryFee =
    orderType === "delivery" ? getDeliveryFee(zone, deliveryCharges) : 0;

  const allExtraDishes = items.flatMap((item) => item.extraDishes || []);
  const filledExtraDishes = allExtraDishes.filter((d) => d !== "");
  const dishesTotal = filledExtraDishes.length * EXTRA_DISH_PRICE;

  const packageTotal = items.reduce((sum, item) => {
    const pkg = item.selectedProduct?.amount || 0;
    const upgrade = item.upgradeAmount || 0;
    return sum + pkg + upgrade;
  }, 0);

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

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && !orderSuccess) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel, orderSuccess]);

  const handleConfirm = async () => {
    try {
      const result = await onConfirm();
      console.log("onConfirm result:", result); // 👈 check this in console
      const num = result?.orderNumber || result?.data?.orderNumber;
      setOrderNumber(num);
      setOrderSuccess(true);
    } catch {
      // error handling is done in parent
    }
  };

  const handleDownloadPDF = async () => {
    const jsPDF = jsPDFRef.current;
    if (!jsPDF) return;

    const doc = new jsPDF({ unit: "mm", format: "a5" });
    const W = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentW = W - margin * 2;
    let y = 0;

    const RED = [185, 28, 28];
    const RED_LIGHT = [254, 226, 226];
    const DARK = [17, 24, 39];
    const MID = [107, 114, 128];
    const LIGHT = [209, 213, 219];
    const BG = [249, 250, 251];
    const GREEN = [5, 150, 105];
    const WHITE = [255, 255, 255];

    // ✅ PDF-safe currency formatter (₱ renders as ± in jsPDF)
    const pdfFmt = (n) =>
      "PHP " + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });

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

    // Header
    fillRect(0, 0, W, 30, RED);
    setFont(18, "bold", WHITE);
    doc.text("Jojo's Lechon", W / 2, 13, { align: "center" });
    setFont(8, "normal", [254, 202, 202]);
    doc.text("Official Order Receipt", W / 2, 20, { align: "center" });
    y = 36;

    // Order info
    fillRect(margin, y - 4.5, 50, 7, RED_LIGHT, 2);
    setFont(7.5, "bold", RED);
    doc.text(orderNumber, margin + 3, y);
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
    y += 12;
    hRule(y);
    y += 7;

    const section = (title) => {
      fillRect(margin, y - 3.5, 2.5, 7, RED, 1);
      setFont(7, "bold", MID);
      doc.text(title.toUpperCase(), margin + 5, y);
      fillRect(margin, y + 1.5, contentW, 0.3, LIGHT);
      y += 7;
    };

    const row = (label, value, opts = {}) => {
      labelValue(label, value, y, opts);
      y += 5.5;
      hRule(y - 1.5);
    };

    // Customer
    section("Customer Information");
    row("Full Name", customerName || "—", { valBold: true });
    row("Contact", contacts.filter(Boolean).join("  •  ") || "—");
    if (facebookProfile) row("Facebook", facebookProfile);
    y += 3;

    // Delivery
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
    row("Payment Method", paymentLabel);
    y += 3;

    // Order Details
    section("Order Details");
    items.forEach((item, index) => {
      if (!item.selectedProduct) return;

      fillRect(margin, y - 3.5, contentW, 9, BG, 2);
      setFont(8.5, "bold", DARK);
      doc.text(
        `${index + 1}. ${item.selectedProduct.productName}`,
        margin + 4,
        y,
      );
      setFont(8.5, "bold", RED);
      doc.text(pdfFmt(item.selectedProduct.amount), W - margin - 4, y, {
        align: "right",
      });
      y += 9;

      if (item.upgradeAmount > 0) {
        y += 2;
        setFont(8, "bold", DARK);
        doc.text(
          `UPGRADE (${getUpgradeKg(item.upgradeAmount).toUpperCase()})`,
          margin + 4,
          y,
        );
        setFont(8, "bold", RED);
        doc.text(pdfFmt(item.upgradeAmount), W - margin - 4, y, {
          align: "right",
        });
        y += 6;
      }

      const requiredDishes = (item.requiredDishes || []).filter(
        (d) => d !== "",
      );
      if (requiredDishes.length > 0) {
        y += 2;
        setFont(7, "bold", MID);
        doc.text("INCLUDED DISHES", margin + 3, y);
        y += 4.5;
        requiredDishes.slice(0, 3).forEach((dishId) => {
          const dish = dishes.find((d) => String(d.id) === String(dishId));
          doc.setFillColor(...MID);
          doc.circle(margin + 4.5, y - 1.5, 0.8, "F");
          setFont(8, "normal", DARK);
          doc.text(dish?.dishName || "Dish", margin + 7, y);
          y += 5;
        });
      }
    });

    // Extra dishes
    if (filledExtraDishes.length > 0) {
      y += 2;
      setFont(7, "bold", MID);
      doc.text(`EXTRA DISHES (${filledExtraDishes.length})`, margin + 3, y);
      y += 4.5;
      filledExtraDishes.slice(0, 3).forEach((dishId) => {
        const dish = dishes.find((d) => String(d.id) === String(dishId));
        doc.setFillColor(...RED);
        doc.circle(margin + 4.5, y - 1.5, 0.8, "F");
        setFont(8, "normal", DARK);
        doc.text(dish?.dishName || "Selected Dish", margin + 7, y);
        setFont(8, "bold", DARK);
        doc.text(pdfFmt(EXTRA_DISH_PRICE), W - margin - 3, y, {
          align: "right",
        });
        y += 5;
      });
    }

    y += 4;
    section("Pricing Summary");
    row("Subtotal", pdfFmt(packageTotal));
    if (dishesTotal > 0) row("Extra Dishes", pdfFmt(dishesTotal));
    if (deliveryFee > 0) row("Delivery Fee", pdfFmt(deliveryFee));
    if (discount > 0)
      row("Discount", `-${pdfFmt(discount)}`, {
        valColor: GREEN,
        valBold: true,
      });

    // Total
    fillRect(margin + 0.5, y + 0.5, contentW, 14, [150, 20, 20], 3);
    fillRect(margin, y, contentW, 14, RED, 3);
    setFont(9, "bold", WHITE);
    doc.text("TOTAL AMOUNT DUE", margin + 5, y + 9);
    setFont(13, "bold", WHITE);
    doc.text(pdfFmt(total), W - margin - 5, y + 9, { align: "right" });

    y += 22;
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
    const html2canvas = html2canvasRef.current;
    if (!html2canvas) return;

    const hiddenDiv = document.getElementById("receipt-full-capture");
    if (!hiddenDiv) return;
    setIsDownloading(true);

    hiddenDiv.style.display = "block";
    try {
      const canvas = await html2canvas(hiddenDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
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
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!orderSuccess ? onCancel : undefined}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* TOP ACCENT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700" />

        {orderSuccess ? (
          <ReceiptView
            orderNumber={orderNumber}
            customerName={customerName}
            contacts={contacts}
            facebookProfile={facebookProfile}
            orderType={orderType}
            zone={zone}
            address={address}
            deliveryDate={deliveryDate}
            deliveryTime={deliveryTime}
            items={items}
            dishes={dishes}
            filledExtraDishes={filledExtraDishes}
            packageTotal={packageTotal}
            dishesTotal={dishesTotal}
            deliveryFee={deliveryFee}
            discount={discount}
            total={total}
            paymentMethod={paymentMethod}
            fmt={fmt}
            getUpgradeKg={getUpgradeKg}
            onBookAgain={onBookAgain}
            onDownloadPDF={handleDownloadPDF}
            onDownloadImage={handleDownloadImage}
            isDownloading={isDownloading}
          />
        ) : (
          <ConfirmView
            customerName={customerName}
            contacts={contacts}
            facebookProfile={facebookProfile}
            orderType={orderType}
            zone={zone}
            address={address}
            deliveryDate={deliveryDate}
            deliveryTime={deliveryTime}
            items={items}
            dishes={dishes}
            filledExtraDishes={filledExtraDishes}
            packageTotal={packageTotal}
            dishesTotal={dishesTotal}
            deliveryFee={deliveryFee}
            discount={discount}
            total={total}
            paymentMethod={paymentMethod}
            paymentLabel={paymentLabel}
            paymentIcon={paymentIcon}
            fmt={fmt}
            getUpgradeKg={getUpgradeKg}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirm}
            onCancel={onCancel}
          />
        )}
      </div>

      {/* HIDDEN FULL RECEIPT FOR IMAGE CAPTURE */}
      {orderSuccess && (
        <FullReceiptCapture
          orderNumber={orderNumber}
          customerName={customerName}
          contacts={contacts}
          facebookProfile={facebookProfile}
          orderType={orderType}
          zone={zone}
          address={address}
          deliveryDate={deliveryDate}
          deliveryTime={deliveryTime}
          items={items}
          dishes={dishes}
          filledExtraDishes={filledExtraDishes}
          packageTotal={packageTotal}
          dishesTotal={dishesTotal}
          deliveryFee={deliveryFee}
          discount={discount}
          total={total}
          paymentMethod={paymentMethod}
          fmt={fmt}
          getUpgradeKg={getUpgradeKg}
        />
      )}
    </div>
  );
}

// ✅ CONFIRM VIEW - IDENTICAL TO STEP 3
function ConfirmView({
  customerName,
  contacts,
  facebookProfile,
  orderType,
  zone,
  address,
  deliveryDate,
  deliveryTime,
  items,
  dishes,
  filledExtraDishes,
  packageTotal,
  dishesTotal,
  deliveryFee,
  discount,
  total,
  paymentMethod,
  paymentLabel,
  paymentIcon,
  fmt,
  getUpgradeKg,
  isSubmitting,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      {/* HEADER */}
      <div className="px-8 pt-7 pb-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
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
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-40"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* BODY - SAME AS STEP 3 */}
      <div className="px-8 py-6 space-y-6 max-h-[55vh] overflow-y-auto">
        {/* 1. CUSTOMER DETAILS */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2 text-sm">
              <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
              Customer Details
            </h3>
          </div>
          <div className="p-4 space-y-1">
            <DetailRow label="Name" value={customerName || "N/A"} />
            <DetailRow
              label="Contact Number"
              value={contacts.filter((c) => c !== "").join(", ") || "N/A"}
            />
            <DetailRow
              label="Facebook Profile"
              value={facebookProfile || "N/A"}
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
            <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2 text-sm">
              <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
              Delivery Details
            </h3>
          </div>
          <div className="p-4 space-y-1">
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

        {/* 3. ORDER ITEMS - SAME AS STEP 3 */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-black text-gray-800 tracking-tight flex items-center gap-2 text-sm">
              <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
              Order Summary ({items.length}{" "}
              {items.length === 1 ? "item" : "items"})
            </h3>
          </div>
          <div className="p-4">
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
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Additional Dishes ({filledExtraDishes.length})
                  </p>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    ₱{EXTRA_DISH_PRICE} each
                  </span>
                </div>
                <div className="space-y-2 mb-4 max-h-20 overflow-y-auto">
                  {filledExtraDishes.slice(0, 4).map((dishIndex, i) => {
                    const dish = dishes.find(
                      (d) => String(d.id) === String(dishIndex),
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl text-xs"
                      >
                        <span className="font-bold text-gray-700 truncate">
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
            <div className="mt-6 pt-4 border-t-2 border-gray-100 space-y-2">
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
              <div className="h-px bg-gray-200 my-1"></div>
              <ItemRow name="TOTAL" price={fmt(total)} isBold />
            </div>
          </div>
        </div>
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
    </>
  );
}

// ✅ RECEIPT VIEW - UPDATED FOR MULTIPLE ITEMS
function ReceiptView({
  orderNumber,
  customerName,
  contacts,
  facebookProfile,
  orderType,
  zone,
  address,
  deliveryDate,
  deliveryTime,
  items,
  dishes,
  filledExtraDishes,
  packageTotal,
  dishesTotal,
  deliveryFee,
  discount,
  total,
  paymentMethod,
  fmt,
  getUpgradeKg,
  onBookAgain,
  onDownloadPDF,
  onDownloadImage,
  isDownloading,
}) {
  return (
    <>
      {/* HEADER */}
      <div className="px-8 pt-7 pb-5 border-b border-gray-100 text-center relative">
        <button
          onClick={onBookAgain}
          className="absolute top-4 right-6 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

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

      {/* BODY */}
      <div className="px-8 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
        <ReceiptSection title="Customer">
          <ReceiptRow label="Name" value={customerName || "—"} />
          <ReceiptRow
            label="Contact"
            value={contacts.filter(Boolean).join(", ") || "—"}
          />
          {facebookProfile && (
            <ReceiptRow
              label="Facebook"
              value={
                <span className="truncate block max-w-[200px]">
                  {facebookProfile}
                </span>
              }
            />
          )}{" "}
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
              paymentMethod === "gcash" ? "📱 GCash" : "💵 Cash on Delivery"
            }
          />
        </ReceiptSection>

        <ReceiptSection
          title={`Order (${items.length} ${items.length === 1 ? "item" : "items"})`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="mb-3 pb-3 border-b border-gray-50 last:border-b-0 last:mb-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {item.selectedProduct?.productName}
                  </span>
                </div>
                <span className="text-xs font-black text-gray-900">
                  {fmt(item.selectedProduct?.amount || 0)}
                </span>
              </div>
              {item.upgradeAmount > 0 && (
                <div className="flex justify-between text-xs text-red-600 font-bold ml-8">
                  <span>+ Upgrade ({getUpgradeKg(item.upgradeAmount)})</span>
                  <span>+ {fmt(item.upgradeAmount)}</span>
                </div>
              )}
            </div>
          ))}

          {filledExtraDishes.length > 0 && (
            <div className="py-2 border-t border-gray-50 mt-2">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5">
                Extra Dishes ({filledExtraDishes.length})
              </p>
              {filledExtraDishes.slice(0, 3).map((dishIndex, i) => {
                const dish = dishes.find(
                  (d) => String(d.id) === String(dishIndex),
                );
                return (
                  <div
                    key={i}
                    className="flex justify-between text-xs text-gray-600 font-medium py-0.5"
                  >
                    <span>• {dish?.dishName || "Selected Dish"}</span>
                    <span className="text-gray-800 font-black">
                      {fmt(EXTRA_DISH_PRICE)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </ReceiptSection>

        <ReceiptSection title="Pricing">
          <ReceiptRow label="Subtotal" value={fmt(packageTotal)} />
          {discount > 0 && (
            <ReceiptRow label="Discount" value={`-${fmt(discount)}`} green />
          )}
          {dishesTotal > 0 && (
            <ReceiptRow label="Extra Dishes" value={fmt(dishesTotal)} />
          )}
          {deliveryFee > 0 && (
            <ReceiptRow label="Delivery Fee" value={fmt(deliveryFee)} />
          )}
          <div className="mt-2 pt-3 border-t-2 border-gray-100 flex justify-between items-center">
            <span className="text-sm font-black text-gray-800">Total</span>
            <span className="text-lg font-black text-red-600">
              {fmt(total)}
            </span>
          </div>
        </ReceiptSection>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onDownloadPDF}
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
          onClick={onDownloadImage}
          disabled={isDownloading}
          className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isDownloading ? (
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
              Saving...
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
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
              Save as Image
            </>
          )}
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
  );
}

// ✅ STEP 3 COMPONENTS (REUSED)
function OrderItemSummary({ item, index, dishes, fmt }) {
  if (!item.selectedProduct) return null;

  const requiredDishes = (item.requiredDishes || []).filter((d) => d !== "");
  const dishNames = requiredDishes.map((dishId) => {
    const dish = dishes.find((d) => String(d.id) === String(dishId));
    return dish?.dishName || "Dish";
  });

  return (
    <div className="mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">
            {index}
          </div>
          <div>
            <p className="font-black text-sm text-gray-900 leading-tight">
              {item.selectedProduct.productName}
            </p>
            {item.upgradeAmount > 0 && (
              <p className="text-xs text-red-600 font-bold">
                + Upgrade ({getUpgradeKg(item.upgradeAmount)})
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-sm">
            {fmt(item.selectedProduct.amount)}
          </p>
          {item.upgradeAmount > 0 && (
            <p className="text-xs text-gray-500">+ {fmt(item.upgradeAmount)}</p>
          )}
        </div>
      </div>

      {requiredDishes.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-3 ml-9 mt-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
            Included Dishes:
          </p>
          <div className="flex flex-wrap gap-1">
            {dishNames.map((name, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-white text-[10px] font-bold text-gray-700 rounded-full shadow-sm"
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

function DetailRow({ label, value, isHighlight = false }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 group">
      <span className="text-xs font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
        {label}
      </span>
      <span
        className={`text-xs font-black px-2 py-0.5 rounded-md ${
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
      className={`flex justify-between items-center py-2 ${isBold ? "pt-2 pb-3" : ""}`}
    >
      <span
        className={`text-sm font-bold ${isBold ? "text-lg text-gray-900" : "text-gray-500"}`}
      >
        {name}
      </span>
      <span
        className={`font-black ${isBold ? "text-xl text-red-600" : "text-sm text-gray-800"}`}
      >
        {price}
      </span>
    </div>
  );
}

// Receipt components (unchanged)
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

// Full receipt capture (UPDATED FOR MULTIPLE ITEMS)
function FullReceiptCapture({
  orderNumber,
  customerName,
  contacts,
  facebookProfile,
  orderType,
  zone,
  address,
  deliveryDate,
  deliveryTime,
  items,
  dishes,
  filledExtraDishes,
  packageTotal,
  dishesTotal,
  deliveryFee,
  discount,
  total,
  paymentMethod,
  fmt,
  getUpgradeKg,
}) {
  return (
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
      {/* Header */}
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
        <div style={{ fontSize: "11px", color: "#fecaca", marginTop: "4px" }}>
          Order Receipt
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "14px 24px 10px",
          borderBottom: "2px solid #b91c1c",
        }}
      >
        <span style={{ fontWeight: "900", color: "#b91c1c", fontSize: "13px" }}>
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

      <div style={{ padding: "0 24px 24px" }}>
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

        <CaptureSection
          title={`Order (${items.length} ${items.length === 1 ? "item" : "items"})`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                marginBottom: "12px",
                paddingBottom: "12px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "#b91c1c",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "900",
                      fontSize: "12px",
                    }}
                  >
                    {index + 1}
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "800",
                      color: "#111",
                    }}
                  >
                    {item.selectedProduct?.productName}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "900",
                    color: "#b91c1c",
                  }}
                >
                  {fmt(item.selectedProduct?.amount || 0)}
                </span>
              </div>
              {item.upgradeAmount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginLeft: "32px",
                    fontSize: "11px",
                    color: "#b91c1c",
                    fontWeight: "700",
                  }}
                >
                  <span>Upgrade ({getUpgradeKg(item.upgradeAmount)})</span>
                  <span>{fmt(item.upgradeAmount)}</span>
                </div>
              )}
            </div>
          ))}

          {filledExtraDishes.length > 0 && (
            <div style={{ padding: "8px 0", borderTop: "1px solid #f0f0f0" }}>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: "800",
                  color: "#aaa",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Extra Dishes ({filledExtraDishes.length})
              </div>
              {filledExtraDishes.slice(0, 4).map((dishIndex, i) => {
                const dish = dishes.find(
                  (d) => String(d.id) === String(dishIndex),
                );
                return (
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
                    <span>• {dish?.dishName || "Selected Dish"}</span>
                    <span style={{ fontWeight: "700", color: "#111" }}>
                      {fmt(EXTRA_DISH_PRICE)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CaptureSection>

        <CaptureSection title="Pricing">
          <CaptureRow label="Subtotal" value={fmt(packageTotal)} />
          {discount > 0 && (
            <CaptureRow label="Discount" value={`-${fmt(discount)}`} green />
          )}
          {dishesTotal > 0 && (
            <CaptureRow label="Extra Dishes" value={fmt(dishesTotal)} />
          )}
          {deliveryFee > 0 && (
            <CaptureRow label="Delivery Fee" value={fmt(deliveryFee)} />
          )}
        </CaptureSection>

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
          <span style={{ color: "#fff", fontWeight: "900", fontSize: "14px" }}>
            TOTAL
          </span>
          <span style={{ color: "#fff", fontWeight: "900", fontSize: "20px" }}>
            {fmt(total)}
          </span>
        </div>

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
