import { useState } from "react";

import StepBar from "./components/stepper/StepBar";
import OrderSummary from "./components/summary/OrderSummary";
import NavButtons from "./components/navigation/NavButtons";

import ConfirmOrderModal from "./components/confirmationModal/confirmationOrderModal";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";

function App() {
  const [step, setStep] = useState(1);

  // ─── SHARED ORDER STATE ───────────────────────────────────────────
  const [orderType, setOrderType] = useState("delivery");
  const [zone, setZone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [productType, setProductType] = useState("");
  const [selectedProductIndex, setSelectedProductIndex] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requiredDishes, setRequiredDishes] = useState([]);
  const [extraDishes, setExtraDishes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  // ─── CUSTOMER STATE ───────────────────────────────────────────────
  const [customerName, setCustomerName] = useState("");
  const [contacts, setContacts] = useState([""]);
  const [facebookProfile, setFacebookProfile] = useState("");

  // ─── MODAL STATE ──────────────────────────────────────────────────
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ─────────────────────────────────────────────────────────────────

  const orderState = {
    orderType,
    setOrderType,
    zone,
    setZone,
    address,
    setAddress,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    productType,
    setProductType,
    selectedProductIndex,
    setSelectedProductIndex,
    selectedProduct,
    setSelectedProduct,
    requiredDishes,
    setRequiredDishes,
    extraDishes,
    setExtraDishes,
    paymentMethod,
    setPaymentMethod,
    customerName,
    setCustomerName,
    contacts,
    setContacts,
    facebookProfile,
    setFacebookProfile,
  };

  // Opens the confirmation modal
  const handleRecordOrder = () => {
    setShowConfirmModal(true);
  };

  // Called when user clicks "Confirm Order" inside the modal
  const handleConfirm = async () => {
    setIsSubmitting(true);

    // ── BUILD PAYLOAD ──────────────────────────────────────────────
    const payload = {
      customer: {
        name: customerName,
        contacts: contacts.filter(Boolean),
        facebookProfile,
      },
      order: {
        orderType,
        address,
        zone,
        deliveryDate,
        deliveryTime,
      },
      product: selectedProduct
        ? {
            productName: selectedProduct.productName,
            amount: selectedProduct.amount,
            NoOfDishes: selectedProduct.NoOfDishes || 0,
            promoAmount: selectedProduct.promoAmount,
          }
        : null,
      dishes: {
        required: requiredDishes,
        extra: extraDishes.filter(Boolean),
      },
      payment: {
        method: paymentMethod,
      },
    };
    // ──────────────────────────────────────────────────────────────

    try {
      // 🔌 Replace this URL with your actual backend endpoint
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to record order");

      // Success — close modal, you can redirect or show a success screen here
      setShowConfirmModal(false);
      alert("Order recorded successfully!");
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSidebar = step !== 2;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div class="max-w-6xl mx-auto">
        <header class="flex items-center space-x-3 mb-6 md:mb-8">
          <div class="w-10 h-10 md:w-14 md:h-14 bg-red-700 rounded-full flex items-center justify-center border-2 border-white shadow-md overflow-hidden flex-shrink-0">
            <span class="text-xl md:text-3xl">🐷</span>
          </div>
          <div>
            <h1 class="text-xl md:text-3xl font-extrabold text-red-900 tracking-tight leading-none">
              Jojo's Lechon
            </h1>
            <p class="text-gray-500 font-medium mt-1 text-[10px] md:text-sm uppercase tracking-wider">
              Order Encoder Dashboard
            </p>
          </div>
        </header>

        <StepBar currentStep={step} />

        {/* MAIN LAYOUT */}
        <div
          className={`grid grid-cols-1 gap-6 ${
            step === 2 ? "lg:grid-cols-1" : "lg:grid-cols-3"
          }`}
        >
          {/* LEFT CONTENT */}
          <div className={step === 2 ? "space-y-6" : "lg:col-span-2 space-y-6"}>
            {step === 1 && <Step1 orderState={orderState} />}
            {step === 2 && <Step2 orderState={orderState} />}
            {step === 3 && <Step3 orderState={orderState} />}
          </div>

          {/* RIGHT SIDEBAR (hidden on step 2) */}
          {showSidebar && (
            <div className="lg:col-span-1 sticky top-6 self-start space-y-4">
              <OrderSummary orderState={orderState} />
              <NavButtons
                step={step}
                setStep={setStep}
                onRecordOrder={handleRecordOrder}
              />
            </div>
          )}
        </div>

        {/* STEP 2 BOTTOM NAV */}
        {step === 2 && (
          <div className="mt-10">
            <NavButtons
              step={step}
              setStep={setStep}
              onRecordOrder={handleRecordOrder}
            />
          </div>
        )}

        {/* CONFIRMATION MODAL */}
        {showConfirmModal && (
          <ConfirmOrderModal
            orderState={orderState}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirmModal(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default App;
