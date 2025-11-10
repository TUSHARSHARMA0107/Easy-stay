import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../config/axios";
import { differenceInDays } from "date-fns";
import toast from "react-hot-toast";

export default function BookingReview() {
  const { businessId, unitId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const start = new Date(searchParams.get("start"));
  const end = new Date(searchParams.get("end"));
  const nights = Math.max(1, differenceInDays(end, start));

  const [business, setBusiness] = useState(null);
  const [unit, setUnit] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/business/${businessId}`);
        setBusiness(res.data.business);
        const room = res.data.business.units.find((u) => u.id === unitId);
        setUnit(room);
      } catch {
        toast.error("Business or room not found");
      }
    }
    fetchData();
  }, [businessId, unitId]);

  if (!business || !unit) return <div className="p-10">Loading...</div>;

  const totalPrice = Math.round(unit.pricePerNight * nights);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        <h1 className="text-2xl font-semibold">{business.name}</h1>
        <p className="text-gray-600">{business.location}</p>

        <hr className="my-5" />

        <h2 className="text-lg font-medium">{unit.name}</h2>
        <p className="text-gray-700">{unit.description}</p>

        <div className="mt-4 text-sm text-gray-600">
          <p>Check-in: {start.toDateString()}</p>
          <p>Check-out: {end.toDateString()}</p>
          <p className="mt-1">⏱ {nights} night(s)</p>
        </div>

        <hr className="my-5" />
        <p className="text-lg font-semibold text-blue-600">Total: ₹ {totalPrice}</p>

        <button className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={() => navigate(`/pay/${businessId}/${unitId}?start=${start.toISOString()}&end=${end.toISOString()}`)}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}