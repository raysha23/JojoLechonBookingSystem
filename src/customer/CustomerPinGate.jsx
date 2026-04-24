import { useState } from "react";

const CORRECT_PIN = "122303";

export default function CustomerPinGate({ children }) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 6) return;
    const next = pin + d;
    setPin(next);
    setError(false);

    if (next.length === 6) {
      if (next === CORRECT_PIN) {
        setUnlocked(true);
      } else {
        setError(true);
        setTimeout(() => setPin(""), 600);
      }
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  if (unlocked) return children;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xs overflow-hidden">
        <div className="bg-red-700 px-8 py-8 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🐷</span>
          </div>
          <h1 className="text-xl font-black text-white">Jojo's Lechon</h1>
          <p className="text-red-200 text-xs mt-1 font-medium uppercase tracking-widest">
            Customer Booking
          </p>
        </div>

        <div className="px-8 py-8">
          <p className="text-center text-sm font-bold text-gray-500 mb-6">
            Enter access PIN to continue
          </p>

          {/* PIN DOTS */}
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  i < pin.length
                    ? error
                      ? "bg-red-500"
                      : "bg-red-700"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* KEYPAD */}
          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
              (key, i) => {
                if (key === "") return <div key={i} />;
                return (
                  <button
                    key={i}
                    onClick={() =>
                      key === "⌫" ? handleDelete() : handleDigit(key)
                    }
                    className={`py-4 rounded-2xl text-lg font-black transition-all active:scale-95 ${
                      key === "⌫"
                        ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        : "bg-gray-50 text-gray-800 hover:bg-red-50 hover:text-red-700 border-2 border-gray-100"
                    }`}
                  >
                    {key}
                  </button>
                );
              },
            )}
          </div>

          {error && (
            <p className="text-center text-xs font-bold text-red-500 mt-5">
              Incorrect PIN. Try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
