import { useEffect, useState } from "react";
import api from "../config/axios";
import Confetti from "react-confetti";

export default function BookingConfirmation() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      const res = await api.get("/bookings/latest");
      setBooking(res.data.booking);
    }
    fetchBooking();
  }, []);

  if (!booking) return <div className="p-10 text-center">Loading...</div>;

  const { business, unit, startDate, endDate, totalAmount, id } = booking;

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-10 text-center">
      <Confetti numberOfPieces={220} recycle={false} />
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6">🎉 Booking Confirmed!</h1>
      <div className="bg-white rounded-3xl shadow-xl border p-6 relative overflow-hidden">
        <div className="text-left px-2">
          <h2 className="text-2xl font-semibold">{business.name}</h2>
          <p className="text-gray-500">{business.location}</p>
        </div>
        <hr className="my-5" />
        <div className="grid grid-cols-2 text-left px-2">
          <div>
            <p className="text-sm text-gray-500">Check-in</p>
            <p className="text-lg font-medium">{new Date(startDate).toDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Check-out</p>
            <p className="text-lg font-medium">{new Date(endDate).toDateString()}</p>
          </div>
        </div>
        <div className="mt-5 px-2 flex justify-between text-left">
          <p className="font-medium">{unit.name}</p>
          <p className="text-blue-600 font-bold">₹ {totalAmount}</p>
        </div>
        <hr className="my-5" />
        <p className="text-sm text-gray-500">Booking ID</p>
        <p className="font-mono text-lg">{id}</p>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <a href="/bookings" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-center">View My Bookings</a>
        <button onClick={() => window.print()} className="px-6 py-3 border rounded-xl hover:bg-gray-50 transition">
          Download Ticket (PDF)
        </button>
      </div>
    </div>
  );
}