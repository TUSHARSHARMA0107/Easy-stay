import { useState } from "react";
import { DateRange } from "react-date-range";

export default function DateSelector({ onChange }) {
  const [range, setRange] = useState([{
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate()+1)),
    key: "selection"
  }]);

  const handleChange = (item) => {
    setRange([item.selection]);
    onChange(item.selection);
  };

  return (
    <div className="mt-8 border rounded-2xl p-4 shadow bg-white">
      <h2 className="text-lg font-semibold mb-3">Select Dates</h2>
      <DateRange ranges={range} onChange={handleChange} moveRangeOnFirstSelection={false} editableDateInputs minDate={new Date()} rangeColors={["#2563eb"]} />
    </div>
  );
}