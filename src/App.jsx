import { useState } from "react";

import StepBar from "./components/stepper/StepBar";
import OrderSummary from "./components/summary/OrderSummary";
import NavButtons from "./components/navigation/NavButtons";

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
  // ─────────────────────────────────────────────────────────────────

  const showSidebar = step !== 2;

  // Bundle all order state into one object to pass around cleanly
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
            <NavButtons step={step} setStep={setStep} />
          </div>
        )}
      </div>

      {/* STEP 2 BOTTOM LAYOUT */}
      {step === 2 && (
        <div className="mt-10">
          <NavButtons step={step} setStep={setStep} />
        </div>
      )}
    </div>
  );
}

export default App;
