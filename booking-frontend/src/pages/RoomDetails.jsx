import { useState } from "react";
import { api } from "../config/api";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

export default function BookingPage() {
  const { id } = useParams();
  const [dates, setDates] = useState({ checkin: "", checkout: "" });

  const bookNow = async () => {
    const res = await api.post("/booking/create", { ...dates, roomId: id });
    window.location.href = res.data.payment_url;  // Razorpay redirect
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-md mx-auto bg-white p-6 shadow rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Select Dates</h1>

        <input
          type="date"
          name="checkin"
          onChange={(e) => setDates({ ...dates, checkin: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg mb-3"
        />

        <input
          type="date"
          name="checkout"
          onChange={(e) => setDates({ ...dates, checkout: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg mb-3"
        />

        <button
          onClick={bookNow}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Proceed to Pay
        </button>
      </div>
    </>
  );
}