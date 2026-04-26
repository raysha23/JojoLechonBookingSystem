import { useEffect, useState } from "react";

import StepBar from "./components/stepper/StepBar";
import OrderSummary from "./components/summary/OrderSummary";
import NavButtons from "./components/navigation/NavButtons";
import { getProductsByType, getDishes } from "./api/productApi";
import ConfirmOrderModal from "./components/confirmationModal/confirmationOrderModal";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";

import { getLandingData } from "./api/landingApi";
import { createOrder } from "./api/orderApi";

function getDeliveryFee(zone, deliveryCharges = []) {
  if (!zone || deliveryCharges.length === 0) return 0;
  const charge = deliveryCharges.find((item) => item.zoneName === zone);
  return charge ? Number(charge.minAmount || 0) : 0;
}

function App({ submittedByUserId = null, encoderName = null }) {
  const [step, setStep] = useState(1);
  const [productTypes, setProductTypes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const [upgradeAmount, setUpgradeAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // ─── CUSTOMER STATE ───────────────────────────────────────────────
  const [customerName, setCustomerName] = useState("");
  const [contacts, setContacts] = useState(["09"]);
  const [facebookProfile, setFacebookProfile] = useState("");

  // ─── ATTEMPTED STATE (per step) ──────────────────────────────────
  const [attemptedSteps, setAttemptedSteps] = useState({
    1: false,
    2: false,
    3: false,
  });

  // ─── MODAL STATE ──────────────────────────────────────────────────
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FETCH 1: on page load
  useEffect(() => {
    const fetchLanding = async () => {
      setIsLoading(true);
      try {
        const data = await getLandingData();
        setProductTypes(data.types ?? []);
        setDeliveryCharges(data.charges ?? []);
      } catch (error) {
        console.error("Failed to load landing data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLanding();
  }, []);

  // FETCH 2: when user picks a product type
  useEffect(() => {
    if (!productType) {
      setAllProducts([]);
      setDishes([]);
      return;
    }

    const fetchProductData = async () => {
      try {
        const [rawProducts, rawDishes] = await Promise.all([
          getProductsByType(productType),
          getDishes(),
        ]);

        const mappedProducts = rawProducts.map((product) => ({
          id: product.id,
          productName: product.productName,
          amount: product.amount,
          promoAmount: product.promoAmount,
          productTypeId: product.productTypeId,
          NoOfDishes: product.noOfIncludedDishes ?? 0,
          freebies: (product.freebies ?? []).map((f) => f.freebieName),
          defaultDishes: product.defaultDishes ?? [],
        }));

        setAllProducts(mappedProducts);
        setDishes(rawDishes);
      } catch (error) {
        console.error("Failed to load products/dishes:", error);
      }
    };

    fetchProductData();
  }, [productType]);

  // ─── VALIDATION ───────────────────────────────────────────────────
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

  const allDishesSelected =
    productType === "dish_only"
      ? extraDishes.length > 0 && extraDishes.every((d) => d !== "") // ← must have at least 1 dish filled
      : requiredDishes.every((d) => d !== "") &&
        extraDishes.every((d) => d !== "");

        
  const isStep1Valid =
    orderType &&
    deliveryDate &&
    deliveryTime &&
    productType &&
    (productType === "dish_only" || selectedProduct !== null) &&
    (orderType !== "delivery" ||
      (address.trim() !== "" && zone.trim() !== "")) &&
    allDishesSelected;

  const isStep2Valid =
    customerName.trim() !== "" &&
    /^[a-zA-Z\s]+$/.test(customerName.trim()) &&
    contacts.length > 0 &&
    contacts.every((c) => c.trim() !== "" && /^09\d{9}$/.test(c)) &&
    isFacebookValid;

  const isStep3Valid = isStep1Valid && isStep2Valid;

  const canProceedCurrentStep =
    step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid;

  const getBlockedMessage = () => {
    if (step === 1) {
      return "Complete Step 1 required fields: order type, date/time, delivery details (if delivery), product type, and product selection.";
    }
    if (step === 2) {
      return "Complete Step 2 required fields: valid customer name and at least one valid contact number.";
    }
    return "Please complete all required order details before recording.";
  };

  // ─── NAVIGATION HANDLERS ─────────────────────────────────────────
  const handleNext = () => {
    setAttemptedSteps((prev) => ({ ...prev, [step]: true }));
    if (!canProceedCurrentStep) return;
    setStep(step + 1);
  };

  const handleRecordOrder = () => {
    setAttemptedSteps({ 1: true, 2: true, 3: true });
    if (!isStep3Valid) return;
    setShowConfirmModal(true);
  };

  // ─── ORDER STATE OBJECT ───────────────────────────────────────────
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
    upgradeAmount,
    setUpgradeAmount,
    customerName,
    setCustomerName,
    contacts,
    setContacts,
    facebookProfile,
    setFacebookProfile,
    productTypes,
    products: allProducts,
    dishes,
    deliveryCharges,
    isLoading,
    totalAmount,
    setTotalAmount,
    attempted: attemptedSteps[step], // ← step-aware attempted flag
  };

  // Called when user clicks "Confirm Order" inside the modal
  const handleConfirm = async () => {
    setIsSubmitting(true);

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
      totalAmount,
      dishes: {
        required: requiredDishes.filter(Boolean).map(Number),
        extra: extraDishes.filter(Boolean).map(Number),
      },
      submittedByUserId: submittedByUserId ?? null,
    };

    try {
      const result = await createOrder(payload);
      console.log("Order success:", result);
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookAgain = () => {
    setShowConfirmModal(false);
    setAttemptedSteps({ 1: false, 2: false, 3: false }); // ← reset all steps
    setStep(1);
    setOrderType("delivery");
    setZone("");
    setAddress("");
    setDeliveryDate("");
    setDeliveryTime("");
    setProductType("");
    setSelectedProductIndex("");
    setSelectedProduct(null);
    setRequiredDishes([]);
    setExtraDishes([]);
    setPaymentMethod("gcash");
    setCustomerName("");
    setContacts([""]);
    setFacebookProfile("");
  };

  const showSidebar = step !== 2;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6 md:mb-8">
          {/* LEFT — Brand */}
          <div className="flex items-center space-x-3">
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
          </div>

          {/* RIGHT — Encoder badge + logout */}
          {encoderName && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Logged in as
                </p>
                <p className="text-sm font-black text-red-700">{encoderName}</p>
              </div>
              <button
                onClick={() => {
                  sessionStorage.removeItem("encoder");
                  window.location.href = "/#/encoder/login";
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 border-red-100 text-red-600 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
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
                onNext={handleNext}
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
              onNext={handleNext}
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
            onBookAgain={handleBookAgain}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default App;
