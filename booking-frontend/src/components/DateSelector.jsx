import { useState } from "react";
import { CalendarDays } from "lucide-react";

export default function DateSelector({ onChange }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleCheckIn = (e) => {
    const value = e.target.value;
    setCheckIn(value);

    if (onChange) onChange({ checkIn: value, checkOut });
  };

  const handleCheckOut = (e) => {
    const value = e.target.value;
    setCheckOut(value);

    if (onChange) onChange({ checkIn, checkOut: value });
  };

  return (
    <div className="bg-white dark:bg-[#0D1117] p-4 rounded-xl shadow space-y-4">
      <div>
        <label className="text-sm text-gray-500 dark:text-gray-400">Check-in</label>
        <div className="flex items-center gap-3 p-3 rounded-xl border dark:border-gray-700 bg-gray-100 dark:bg-[#111826]">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={checkIn}
            onChange={handleCheckIn}
            className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-500 dark:text-gray-400">Check-out</label>
        <div className="flex items-center gap-3 p-3 rounded-xl border dark:border-gray-700 bg-gray-100 dark:bg-[#111826]">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={handleCheckOut}
            className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}