import { useEffect, useState } from "react";
import { getMyBookings } from "../config/api/bookings";

export default function MyBookings() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getMyBookings().then(setRows).catch(console.error);
  }, []);

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">My Bookings</h2>
      {rows.map((b) => (
        <div
          key={b.id}
          className="bg-white dark:bg-[#0D1117] rounded-xl shadow p-3 mb-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Booking #{b.id.slice(0, 6)}</p>
              <p className="text-sm text-gray-500">
                {new Date(b.checkIn).toDateString()} →{" "}
                {new Date(b.checkOut).toDateString()}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                b.status === "CONFIRMED"
                  ? "bg-green-100 text-green-700"
                  : b.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {b.status}
            </span>
          </div>
          <p className="mt-2 text-sm">
            Amount: ₹{Math.round(b.totalAmount / 100)}
          </p>
        </div>
      ))}
      {!rows.length && (
        <p className="text-sm text-gray-500">No bookings yet.</p>
      )}
    </div>
  );
}