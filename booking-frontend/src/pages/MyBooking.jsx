import { useEffect, useState } from "react";
import api from "../config/axios";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/bookings/me");
        setBookings(res.data.bookings || []);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (bookings.length === 0)
    return (
      <div className="text-center py-20 text-gray-600">
        No bookings yet.
        <br />
        <Link to="/" className="text-blue-600 font-medium mt-2 inline-block">Start exploring →</Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
      {bookings.map((b) => (
        <div key={b.id} className="bg-white shadow rounded-2xl overflow-hidden border hover:shadow-lg transition">
          {b.business.images?.length > 0 && <img src={b.business.images[0]} className="w-full h-48 object-cover" alt={b.business.name} />}
          <div className="p-4">
            <h2 className="text-xl font-semibold">{b.business.name}</h2>
            <p className="text-gray-600 text-sm">{b.business.location}</p>
            <div className="mt-3 text-sm text-gray-700">🏨 Room: <span className="font-medium">{b.unit.name}</span></div>
            <div className="mt-1 text-sm text-gray-700">📅 {new Date(b.startDate).toDateString()} → {new Date(b.endDate).toDateString()}</div>
            <p className="mt-2 text-blue-600 font-semibold text-lg">₹ {b.totalAmount}</p>
            <div className="mt-4 flex gap-3">
              <Link to={`/business/${b.business.id}`} className="flex-1 py-2 text-center rounded-lg bg-gray-100 hover:bg-gray-200 transition">View Place</Link>
              <button onClick={() => window.print()} className="flex-1 py-2 text-center rounded-lg border hover:bg-gray-50 transition">Download Ticket</button>
              {b.status === "CONFIRMED" && (
                <button onClick={async () => {` await api.patch(/bookings/${b.id}/cancel); window.location.reload(); `}}
                  className="flex-1 py-2 text-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}