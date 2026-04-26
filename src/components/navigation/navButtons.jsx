export default function NavButtons({ step, setStep, onNext, onRecordOrder }) {
  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const isFinalStep = step === 3;

  return (
    <div className="flex items-center justify-between w-full mt-8 gap-4 sm:gap-6">
      {/* BACK BUTTON */}
      <div className="flex-1 flex justify-start">
        {step > 1 ? (
          <button
            onClick={back}
            className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-6 sm:py-3 min-w-[100px] sm:min-w-[140px] bg-white text-gray-700 rounded-full font-bold shadow-md border border-gray-100 hover:bg-gray-50 transition-all group"
          >
            <div className="bg-gray-100 p-1.5 sm:p-2 rounded-full group-hover:-translate-x-1 transition-transform">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
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
            <span className="text-xs sm:text-sm font-bold">Previous</span>
          </button>
        ) : (
          <div className="invisible" />
        )}
      </div>

      {/* NEXT / RECORD BUTTON */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={isFinalStep ? onRecordOrder : onNext}
          className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-6 sm:py-3 min-w-[120px] sm:min-w-[160px] rounded-full font-bold shadow-lg transition-all group bg-red-600 text-white hover:bg-red-700 active:scale-95"
        >
          <span className="text-xs sm:text-sm font-black tracking-tight whitespace-nowrap">
            {isFinalStep ? "Record Order" : "Next"}
          </span>
          <div className="bg-red-500 p-1.5 sm:p-2 rounded-full group-hover:translate-x-1 transition-transform">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
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
    </div>
  );
}
