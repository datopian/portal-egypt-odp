// @ts-nocheck -- vendored from PortalJS Cloud default template; datepicker
// swapped for native date inputs (react-tailwindcss-datepicker is React-18-only).
import { useState } from "react";

const DateRange = ({ onSelect }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const update = (s, e) => {
    setStart(s);
    setEnd(e);
    onSelect([s || null, e || null]);
  };

  const inputClass =
    "rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/40";

  return (
    <div className="flex items-center gap-1">
      <input
        type="date"
        value={start}
        onChange={(e) => update(e.target.value, end)}
        aria-label="Start date"
        className={inputClass}
      />
      <span className="text-gray-400">–</span>
      <input
        type="date"
        value={end}
        onChange={(e) => update(start, e.target.value)}
        aria-label="End date"
        className={inputClass}
      />
    </div>
  );
};

export default DateRange;
