import React from "react";

export default function StepBar({ currentStep }) {
  const steps = [
    { label: "Order Details" },
    { label: "Customer Info" },
    { label: "Order Summary" },
  ];

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10 mb-5">
      {/*
        Two-row CSS Grid:
          Row 1 → circles + connector lines (all align-items: center)
          Row 2 → labels (sit directly below their circle)
        This guarantees the line is always at the true vertical center
        of the circles, at any screen size.
      */}
      <div className="step-track">
        {steps.map((step, i) => {
          const active = i + 1 <= currentStep;
          const lineActive = i + 1 < currentStep;
          const col = i * 2 + 1; // circles on odd columns: 1, 3, 5

          return (
            <React.Fragment key={i}>
              {/* Circle — row 1 */}
              <div className="step-node" style={{ gridColumn: col }}>
                <div
                  className={`step-circle rounded-full flex items-center justify-center transition-all duration-300 ${
                    active
                      ? "bg-red-600 shadow-lg shadow-red-200"
                      : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`step-icon ${active ? "text-white" : "text-gray-300"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {getStepIcon(i + 1)}
                  </svg>
                </div>
              </div>

              {/* Label — row 2, same column */}
              <div className="step-label-cell" style={{ gridColumn: col }}>
                <span
                  className={`step-label text-center leading-tight transition-colors duration-300 ${
                    active
                      ? "font-bold text-gray-800"
                      : "font-semibold text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector — row 1, even columns between circles */}
              {i < steps.length - 1 && (
                <div className="step-connector" style={{ gridColumn: col + 1 }}>
                  <div
                    className={`step-connector-line transition-colors duration-500 ${
                      lineActive ? "bg-red-500" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        .step-track {
          display: grid;
          grid-template-columns: auto 1fr auto 1fr auto;
          grid-template-rows: auto auto;
          align-items: center;
          width: 100%;
          max-width: 48rem;
          margin: 0 auto;
        }
        /* Row assignments */
        .step-node       { grid-row: 1; display: flex; justify-content: center; }
        .step-label-cell { grid-row: 2; display: flex; justify-content: center; padding-top: 0.5rem; }
        .step-connector  { grid-row: 1; align-self: center; padding: 0 clamp(0.25rem, 1vw, 1rem); }

        /* Fluid sizing */
        .step-circle {
          width: clamp(2.5rem, 5vw, 4rem);
          height: clamp(2.5rem, 5vw, 4rem);
          flex-shrink: 0;
        }
        .step-icon {
          width: clamp(1.1rem, 2.5vw, 1.8rem);
          height: clamp(1.1rem, 2.5vw, 1.8rem);
        }
        .step-label {
          font-size: clamp(0.6rem, 1.8vw, 0.875rem);
          max-width: clamp(4rem, 12vw, 7rem);
          display: block;
        }
        .step-connector-line {
          height: 1.5px;
          width: 100%;
          border-radius: 1px;
        }
      `}</style>
    </div>
  );
}

function getStepIcon(stepNum) {
  const icons = {
    1: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
    2: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    3: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  };
  return icons[stepNum];
}
