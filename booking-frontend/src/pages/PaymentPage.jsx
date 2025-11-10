import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import api from "../config/axios";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const { businessId, unitId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const start = new Date(searchParams.get("start"));
  const end = new Date(searchParams.get("end"));
  const nights = Math.max(1, differenceInDays(end, start));

  const [unit, setUnit] = useState(null);

  useEffect(() => {
    async function loadRoom() {
      const res = await api.get(`/business/${businessId}`);
      const found = res.data.business.units.find((u) => u.id === unitId);
      setUnit(found);
    }
    loadRoom();
  }, [businessId, unitId]);

  if (!unit) return <div className="p-10">Loading...</div>;
  const totalPrice = Math.round(unit.pricePerNight * nights);

  const handlePaymentSuccess = async (paymentInfo) => {
    try {
      await api.post("/bookings/create", {
        businessId,
        unitId,
        startDate: start,
        endDate: end,
        totalAmount: totalPrice,
        paymentInfo,
      });
      navigate(`/confirmation`);
    } catch {
      toast.error("Booking failed to save.");
    }
  };

  const payWithStripe = async () => {
    toast.loading("Redirecting to Stripe Checkout...", { id: "stripe" });
    const res = await api.post("/payment/stripe/create-checkout-session", {
      businessId, unitId, start, end, totalPrice
    });
    window.location.href = res.data.url;
  };

  const payWithRazorpay = async () => {
    const res = await api.post("/payment/razorpay/order", { amount: totalPrice });
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: res.data.amount,
      currency: "INR",
      name: unit.name,
      description: "Stay Booking",
      order_id: res.data.id,
      handler: (response) => handlePaymentSuccess(response),
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow border text-center">
        <h2 className="text-2xl font-semibold">Complete Payment</h2>
        <p className="text-gray-600 mt-1">{unit.name} • {nights} night(s)</p>
        <p className="text-blue-600 text-3xl font-bold mt-4">₹ {totalPrice}</p>

        <div className="mt-8 flex flex-col gap-4">
          <button onClick={payWithRazorpay} className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">
            Pay with UPI / Razorpay
          </button>
          <button onClick={payWithStripe} className="px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition">
            Pay with Card (Stripe)
          </button>
        </div>
      </div>
    </div>
  );
}