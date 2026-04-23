import { useState } from "react";

import StepBar from "./components/stepper/StepBar";
import OrderSummary from "./components/summary/OrderSummary";
import NavButtons from "./components/navigation/NavButtons";

import ConfirmOrderModal from "./components/confirmationModal/confirmationOrderModal";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";
import { deliveryCharges } from "./data/deliveryfee-data";

function getDeliveryFee(zone) {
  if (!zone) return 0;
  for (const charge of deliveryCharges) {
    if (charge.zones.includes(zone)) return charge.minAmount;
  }
  return 0;
}
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

  const hasValidContacts = contacts.some(
    (contact) => contact.trim() !== "" && /^[0-9]+$/.test(contact.trim()),
  );
  const hasInvalidContacts = contacts.some(
    (contact) => contact.trim() !== "" && !/^[0-9]+$/.test(contact.trim()),
  );
  const isFacebookValid =
    facebookProfile.trim() === "" ||
    facebookProfile.includes("facebook.com") ||
    facebookProfile.includes("fb.com");

  const isStep1Valid =
    orderType &&
    deliveryDate &&
    deliveryTime &&
    productType &&
    (productType === "dish_only" || selectedProduct !== null) &&
    (orderType !== "delivery" || (address.trim() !== "" && zone.trim() !== ""));

  const isStep2Valid =
    customerName.trim() !== "" &&
    /^[a-zA-Z\s]+$/.test(customerName.trim()) &&
    hasValidContacts &&
    !hasInvalidContacts &&
    isFacebookValid;

  const isStep3Valid = isStep1Valid && isStep2Valid;

  const getBlockedMessage = () => {
    if (step === 1) {
      return "Complete Step 1 required fields: order type, date/time, delivery details (if delivery), product type, and product selection.";
    }

    if (step === 2) {
      return "Complete Step 2 required fields: valid customer name and at least one valid contact number.";
    }

    return "Please complete all required order details before recording.";
  };

  const canProceedCurrentStep =
    step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid;

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
    if (!isStep3Valid) {
      alert("Please complete all required fields before recording the order.");
      return;
    }

    setShowConfirmModal(true);
  };

  // Called when user clicks "Confirm Order" inside the modal
  const handleConfirm = async () => {
    setIsSubmitting(true);
    //  selectedProduct?.id ?? null to handle case when user doesn't select a package and just adds extra dishes
    const payload = {
      customerName,
      contacts: contacts.filter(Boolean),
      facebookProfile,
      orderType,
      address,
      zone,
      deliveryDate,
      deliveryTime,
      productId: selectedProduct?.id ?? null,
      paymentMethod,
      totalAmount: (() => {
        const deliveryFee = orderType === "delivery" ? getDeliveryFee(zone) : 0;
        const packageTotal = selectedProduct?.amount ?? 0;
        const extraTotal = extraDishes.filter(Boolean).length * 700;
        const discount = selectedProduct?.promoAmount 
          ? Math.abs(Number(selectedProduct.promoAmount))
          : 0;
        return packageTotal + extraTotal + deliveryFee - discount;
      })(),
      dishes: {
        required: requiredDishes.filter(Boolean).map(Number),
        extra: extraDishes.filter(Boolean).map(Number),
      },
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to record order");

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
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center space-x-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-red-700 rounded-full flex items-center justify-center border-2 border-white shadow-md overflow-hidden flex-shrink-0">
            <span className="text-xl md:text-3xl">🐷</span>
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-red-900 tracking-tight leading-none">
              Jojo's Lechon
            </h1>
            <p className="text-gray-500 font-medium mt-1 text-[10px] md:text-sm uppercase tracking-wider">
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
                canProceed={canProceedCurrentStep}
                blockedMessage={getBlockedMessage()}
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
              canProceed={canProceedCurrentStep}
              blockedMessage={getBlockedMessage()}
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
