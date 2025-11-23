// src/pages/user/RoomBooking.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import PageHeader from "../../components/user/PageHeader";

export default function RoomBooking() {
  const { id } = useParams(); // roomId
  const navigate = useNavigate();
  const location = useLocation();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    // Optional: dates from query string
    const params = new URLSearchParams(location.search);
    if (params.get("checkIn")) setCheckIn(params.get("checkIn"));
    if (params.get("checkOut")) setCheckOut(params.get("checkOut"));
  }, [location.search]);

  useEffect(() => {
    const load = async () => {
      try {
        // Better: backend GET /api/room/:id (if banaya hai)
        const res = await api.get("/business/all");
        let foundRoom = null;
        for (const b of res.data.businesses || []) {
          const r = b.rooms.find((x) => x.id === id);
          if (r) {
            foundRoom = { ...r, business: b };
            break;
          }
        }
        setRoom(foundRoom);
      } catch (err) {
        console.log("Room load error:", err);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const goToPayment = () => {
    if (!checkIn || !checkOut) {
      return alert("Please select check-in and check-out dates");
    }

    navigate(`/pay/${id}`, {
      state: {
        room,
        checkIn,
        checkOut,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <PageHeader title="Loading room..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <PageHeader title="Room not found" />
      </div>
    );
  }

  const pricePerNight = room.price;
  let nights = 0;
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    nights = (d2 - d1) / (1000 * 60 * 60 * 24);
  }
  const total = nights > 0 ? nights * pricePerNight : 0;

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <PageHeader
        title={room.title}
        subtitle={room.business?.name || "Booking details"}
      />

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6">
        <p className="text-sm text-slate-600 mb-1">
          Location: {room.business?.address}
        </p>
        <p className="font-semibold text-xl text-slate-900 mb-4">
          ₹{pricePerNight} <span className="text-sm text-slate-500">/ night</span>
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3"
          />

          <label className="block text-sm font-medium text-slate-700 mt-3">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3"
          />
        </div>

        {nights > 0 && (
          <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-sm text-slate-700">
              {nights} nights × ₹{pricePerNight} / night
            </p>
            <p className="text-lg font-bold text-slate-900 mt-2">
              Total: ₹{total}
            </p>
          </div>
        )}

        <button
          onClick={goToPayment}
          className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-semibold"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}