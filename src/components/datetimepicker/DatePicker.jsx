// components/DatePicker.jsx
import { useState, useEffect, useRef } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DatePicker({ value, onChange, attempted }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const wrapRef = useRef(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const changeMonth = (dir) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m > 11) {
      m = 0;
      y++;
    }
    if (m < 0) {
      m = 11;
      y--;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const selectDate = (date) => {
    // ✅ Fixed: build ISO string using local date, not UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const iso = `${year}-${month}-${day}`;
    onChange(iso);
    setOpen(false);
  };

  const buildDays = () => {
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    const days = [];

    for (let i = first - 1; i >= 0; i--) {
      days.push({
        day: daysInPrev - i,
        month: viewMonth - 1,
        year: viewYear,
        other: true,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, month: viewMonth, year: viewYear, other: false });
    }
    const remaining = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, month: viewMonth + 1, year: viewYear, other: true });
    }
    return days;
  };

  const isToday = (date) => date.getTime() === today.getTime();
  const isSelected = (date) =>
    selectedDate && date.getTime() === selectedDate.getTime();
  const isPast = (date) => date < today;

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isToday_ = value === today.toISOString().split("T")[0];

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Input trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full p-3 border rounded-xl flex items-center justify-between text-left transition-all outline-none ${
          open
            ? "border-red-500 ring-2 ring-red-500"
            : attempted && !value
              ? "border-red-500 ring-1 ring-red-400"
              : "border-gray-200 hover:border-red-300"
        }`}
      >
        <span
          className={
            displayValue ? "text-gray-700 text-sm" : "text-gray-400 text-sm"
          }
        >
          {displayValue ?? "Select a date"}
        </span>
        <svg
          className="w-4 h-4 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-lg leading-none"
            >
              ‹
            </button>
            <span className="text-sm font-bold text-gray-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-lg leading-none"
            >
              ›
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 px-3 pt-2 pb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-bold text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 px-3 pb-4 gap-0.5">
            {buildDays().map(({ day, month, year, other }, i) => {
              const date = new Date(year, month, day);
              date.setHours(0, 0, 0, 0);
              const past = isPast(date);
              const selected = isSelected(date);
              const todayMark = isToday(date);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={past}
                  onClick={() => selectDate(date)}
                  className={`aspect-square flex items-center justify-center text-[13px] font-medium rounded-lg transition-colors
                    ${selected ? "bg-red-600 text-white font-bold" : ""}
                    ${!selected && todayMark ? "text-red-600 font-black" : ""}
                    ${!selected && !past && !other ? "text-gray-700 hover:bg-red-50 hover:text-red-700" : ""}
                    ${other && !past ? "text-gray-300" : ""}
                    ${past ? "text-gray-200 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning for same-day */}
      {isToday_ && (
        <p className="text-xs text-amber-600 mt-1">
          ⏱️ Processing time: 5 hours. Available times shown below.
        </p>
      )}
      {/* Error message */}
      {attempted && !value && (
        <p className="text-xs text-red-500 font-medium mt-1">
          ⚠ Please select a delivery date.
        </p>
      )}

      {/* Warning for same-day */}
      {isToday_ && (
        <p className="text-xs text-amber-600 mt-1">
          ⏱️ Processing time: 5 hours. Available times shown below.
        </p>
      )}
    </div>
  );
}
