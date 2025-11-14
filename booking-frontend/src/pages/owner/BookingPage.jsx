import { useMemo, useState } from "react";
import { createBooking } from "../../config/services/bookings";

export default function BookingPage() {
  const params = new URLSearchParams(window.location.search);
  const placeId = params.get("placeId");
  const name = params.get("name") || "Your Stay";
  const price = Number(params.get("price") || 0);
  const img = decodeURIComponent(params.get("img") || "") || "";

  const [checkIn, setCheckIn] = useState(new Date().toISOString().split("T")[0]);
  const defaultCheckOut = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const nights = useMemo(() => {
    const a = new Date(checkIn), b = new Date(checkOut);
    const diff = Math.ceil((b - a) / (1000*60*60*24));
    return Math.max(1, diff || 1);
  }, [checkIn, checkOut]);

  const total = useMemo(() => price * nights * rooms, [price, nights, rooms]);

  const startPayment = async () => {
    try {
      setLoading(true);
      const data = await createBooking({ placeId, checkIn, checkOut, guests, rooms, pricePerNight: price, notes });
      const options = {
        key: data.razorpay.key,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: "Easy Stay",
        description: `${name} • ${nights} night(s) • ${rooms} room(s)`,
        image: "/logos/easystay.png",
        order_id: data.razorpay.orderId,
        handler: () => {
          alert("Payment submitted! We'll confirm your booking shortly.");
          window.location.href = "/bookings";
        },
        theme: { color: "#2563EB" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch  {
      alert("Failed to start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24 max-w-xl mx-auto">
      <div className="bg-white dark:bg-[#0D1117] rounded-2xl shadow overflow-hidden">
        {img && <img src={img} className="w-full h-56 object-cover" />}
        <div className="p-4">
          <h1 className="text-xl font-semibold">{name}</h1>
          <p className="text-sm text-gray-500">₹{price} / night</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs">Check-in</label>
              <input type="date" className="w-full border rounded-xl px-3 py-2" value={checkIn} onChange={e=>setCheckIn(e.target.value)} />
            </div>
            <div>
              <label className="text-xs">Check-out</label>
              <input type="date" className="w-full border rounded-xl px-3 py-2" value={checkOut} onChange={e=>setCheckOut(e.target.value)} />
            </div>
            <div>
              <label className="text-xs">Guests</label>
              <input type="number" min="1" className="w-full border rounded-xl px-3 py-2" value={guests} onChange={e=>setGuests(+e.target.value)} />
            </div>
            <div>
              <label className="text-xs">Rooms</label>
              <input type="number" min="1" className="w-full border rounded-xl px-3 py-2" value={rooms} onChange={e=>setRooms(+e.target.value)} />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs">Notes (optional)</label>
            <textarea className="w-full border rounded-xl px-3 py-2" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} />
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-black/20 rounded-xl flex justify-between items-center">
            <span className="text-sm">Total ({nights} night{nights>1?"s":""})</span>
            <span className="text-lg font-semibold">₹{total}</span>
          </div>

          <button disabled={loading} onClick={startPayment} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
            {loading ? "Processing…" : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}