import { useEffect, useState } from "react";
import { api } from "../config/api";
import Navbar from "../components/Navbar";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get("/booking/my-bookings");
      setBookings(res.data.bookings);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 && (
          <p className="text-gray-600">No bookings yet.</p>
        )}

        <div className="space-y-6">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white shadow rounded-xl p-5 flex gap-5">

              <img
                src={b.room.images[0]}
                className="w-32 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold">{b.room.title}</h2>

                <p className="text-gray-600 mt-1">
                  {new Date(b.checkIn).toDateString()}
                  {" → "}
                  {new Date(b.checkOut).toDateString()}
                </p>

                <p className="mt-2 font-semibold text-blue-600">
                  ₹{b.totalPrice}
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    b.status === "confirmed"
                      ? "text-green-600"
                      : b.status === "cancelled"
                      ? "text-red-500"
                      : "text-yellow-600"
                  }`}
                >
                  {b.status.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}