import React from "react";

export default function StepBar({ currentStep }) {
  const steps = [
    { label: "Order Details" },
    { label: "Customer Info" },
    { label: "Order Summary" },
  ];

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
      <div className="flex items-start justify-between w-full max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            {/* Step Circle & Label */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  i + 1 <= currentStep
                    ? "bg-red-600 shadow-xl shadow-red-200"
                    : "bg-gray-100"
                }`}
              >
                <svg
                  className={`w-6 h-6 md:w-8 md:h-8 ${
                    i + 1 <= currentStep ? "text-white" : "text-gray-300"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {getStepIcon(i + 1)}
                </svg>
              </div>

              <span
                className={`mt-4 text-[11px] md:text-sm text-center leading-tight transition-colors duration-300 ${
                  i + 1 <= currentStep
                    ? "font-bold text-gray-800"
                    : "font-semibold text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* The Connecting Line */}
            {i < steps.length - 1 && (
              <div className="flex-1 px-4 self-center -mt-8 md:-mt-10">
                <div
                  className={`h-[1px] w-full transition-colors duration-500 ${
                    i + 1 < currentStep ? "bg-red-600" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function getStepIcon(stepNum, isActive) {
  const color = isActive ? "#ffffff" : "#d1d5db"; // white / gray-300

  const icons = {
    1: (
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
    2: (
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    3: (
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  };

  return icons[stepNum];
}
