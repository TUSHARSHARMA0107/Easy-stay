import { useEffect, useState } from "react";
import api from "../../config/axios";
import toast from "react-hot-toast";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/bookings/owner");
      setBookings(res.data.bookings || []);
    } catch { toast.error("Failed to load owner bookings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    await api.patch`(/bookings/${id}/cancel)`;
    toast.success("Booking cancelled");
    load();
  };

  if (loading) return <p>Loading...</p>;
  if (bookings.length === 0) return <p>No bookings yet.</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Guest Bookings</h1>
      <div className="overflow-auto rounded-2xl border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Guest</th><th className="p-3">Room</th><th className="p-3">Check-in</th><th className="p-3">Check-out</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.user.name} <br /><span className="text-xs text-gray-500">{b.user.email}</span></td>
                <td className="p-3">{b.unit.name}</td>
                <td className="p-3">{new Date(b.startDate).toDateString()}</td>
                <td className="p-3">{new Date(b.endDate).toDateString()}</td>
                <td className="p-3 text-blue-600 font-semibold">₹ {b.totalAmount}</td>
                <td className="p-3">{b.status === "CANCELLED" ? <span className="text-red-600 font-medium">Cancelled</span> : <span className="text-green-600 font-medium">Confirmed</span>}</td>
                <td className="p-3 text-right">
                  {b.status === "CONFIRMED" && <button onClick={() => cancel(b.id)} className="text-red-600 hover:underline">Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}