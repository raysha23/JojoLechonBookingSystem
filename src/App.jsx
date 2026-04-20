import { useState } from "react";

import StepBar from "./components/stepper/StepBar";
import OrderSummary from "./components/summary/OrderSummary";
import NavButtons from "./components/navigation/NavButtons";

import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";

function App() {
  const [step, setStep] = useState(1);

  const showSidebar = step !== 2;

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
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </div>

        {/* RIGHT SIDEBAR (hidden on step 2) */}
        {showSidebar && (
          <div className="lg:col-span-1 sticky top-6 self-start space-y-4">
            <OrderSummary />
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
