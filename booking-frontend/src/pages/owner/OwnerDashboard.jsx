import { useState } from "react";
import BusinessInfo from "./sections/BusinessInfo";
import UnitsManager from "./sections/UnitsManager";
import OwnerBookings from "./sections/OwnerBookings";

const tabs = [
  { key: "business", label: "My Business" },
  { key: "units", label: "Rooms / Units" },
  { key: "bookings", label: "Bookings" },
];

export default function OwnerDashboard() {
  const [active, setActive] = useState("business");
  return (
    <div className="min-h-screen">
      <div className="backdrop-blur bg-white/40 border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex gap-6 px-4 py-3 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActive(t.key)}
              className={`pb-1 border-b-2 transition ${active===t.key ? "border-blue-600 text-blue-700 font-medium" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {active === "business" && <BusinessInfo />}
        {active === "units" && <UnitsManager />}
        {active === "bookings" && <OwnerBookings />}
      </div>
    </div>
  );
}