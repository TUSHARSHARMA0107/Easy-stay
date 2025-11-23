// src/pages/user/MyBookings.jsx
import { useEffect, useState } from "react";
import api from "../../config/api";
import PageHeader from "../../components/user/PageHeader";
import BookingCard from "../../components/user/Bookingcard.jsx";
import HotelSkeleton from "../../components/skeletons/HotelSkeletons.jsx";

export default function MyBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/mine"); // backend: GET /api/booking/mine
      setList(res.data.bookings || []);
    } catch (err) {
      console.log("Bookings load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <PageHeader
        title="My Bookings"
        subtitle="View all your upcoming and past reservations."
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <HotelSkeleton key={n} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-slate-500 text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {list.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}