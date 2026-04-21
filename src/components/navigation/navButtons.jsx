export default function NavButtons({ step, setStep, onRecordOrder }) {
  const next = () => {
    if (step < 3) setStep(step + 1);
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const isFinalStep = step === 3;

  const handleNext = () => {
    if (isFinalStep) {
      onRecordOrder(); // triggers the confirmation modal in App.jsx
    } else {
      next();
    }
  };

  return (
    <div className="flex justify-between items-center w-full mt-8">
      {/* BACK */}
      {step > 1 ? (
        <button
          onClick={back}
          className="bg-white text-gray-700 px-6 py-3 rounded-full font-bold flex items-center space-x-4 shadow-md border border-gray-100 hover:bg-gray-50 transition-all group"
        >
          <div className="bg-gray-100 p-2 rounded-full group-hover:-translate-x-1 transition-transform">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span className="text-sm font-bold">Previous</span>
        </button>
      ) : (
        <div />
      )}

      {/* NEXT / RECORD */}
      <button
        onClick={handleNext}
        className="bg-red-600 text-white px-6 py-3 rounded-full font-bold flex items-center space-x-4 shadow-lg hover:bg-red-700 transition-all group"
      >
        <span className="text-sm font-black tracking-tight">
          {isFinalStep ? "Record Order" : "Next"}
        </span>
        <div className="bg-red-500 p-2 rounded-full group-hover:translate-x-1 transition-transform">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d={isFinalStep ? "M5 13l4 4L19 7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </div>
      </button>
    </div>
  );
}
