// src/pages/user/PaymentPage.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../config/api";
import PageHeader from "../../components/user/PageHeader";

export default function PaymentPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const state = location.state;
    if (state?.room) {
      setRoom(state.room);
      setCheckIn(state.checkIn);
      setCheckOut(state.checkOut);
    } else {
      // fallback: minimal fetch
      api.get("/business/all").then((res) => {
        for (const b of res.data.businesses || []) {
          const r = b.rooms.find((x) => x.id === roomId);
          if (r) setRoom({ ...r, business: b });
        }
      });
    }
  }, [roomId, location.state]);

  const handlePay = async () => {
    if (!room || !checkIn || !checkOut) {
      return alert("Missing booking details");
    }

    try {
      setProcessing(true);

      const res = await api.post("/payment/create-order", {
        roomId,
        checkIn,
        checkOut,
      });

      const { order, amountDisplay } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "EasyStay",
        description: "Room booking payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post("/payment/verify", {
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert("Payment successful!");
            navigate("/my-bookings");
          } catch (err) {
            console.log(err);
            alert("Payment verification failed");
          }
        },
        theme: {
          color: "#0f172a",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.log("Payment error:", err);
      alert("Failed to start payment");
    } finally {
      setProcessing(false);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <PageHeader title="Preparing payment..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <PageHeader
        title="Payment"
        subtitle={`Confirm your booking for ${room.title}`}
      />

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6">
        <p className="text-sm text-slate-600 mb-1">
          {room.business?.name} • {room.business?.address}
        </p>
        <p className="text-lg font-semibold mb-3">
          ₹{room.price} <span className="text-sm text-slate-500">/ night</span>
        </p>
        <p className="text-sm text-slate-700">
          Check-in: <b>{checkIn}</b>
        </p>
        <p className="text-sm text-slate-700 mb-4">
          Check-out: <b>{checkOut}</b>
        </p>

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold mt-4 disabled:opacity-60"
        >
          {processing ? "Processing..." : "Pay & Confirm Booking"}
        </button>

        <p className="text-xs text-slate-500 mt-3 text-center">
          Secure payments powered by Razorpay.
        </p>
      </div>
    </div>
  );
}