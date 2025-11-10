import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios";
import { motion as Motion } from "framer-motion";
import DateSelector from "../components/booking/DateSelector";
import PriceComparison from "../components/compare/PriceComparison";
import toast from "react-hot-toast";

export default function BusinessDetails() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [dates, setDates] = useState(null);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await api.get(`/business/${id}`);
        setBusiness(res.data.business);
        setMainImage(res.data.business.images?.[0]);
      } catch {
        toast.error("Business not found");
      } finally { setLoading(false); }
    }
    fetchBusiness();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!business) return <div className="text-center py-10">Business Not Found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold">{business.name}</h1>
      <p className="text-gray-600 mt-1">{business.location}</p>

      {/* GALLERY */}
      <div className="mt-6">
        {mainImage && (
          <motion.img key={mainImage} src={mainImage} alt="main"
            className="w-full h-[350px] object-cover rounded-2xl shadow" initial={{ opacity:0 }} animate={{ opacity:1 }} />
        )}
        <div className="flex gap-3 mt-3 overflow-auto pb-1">
          {business.images?.map((img, idx) => (
            <img key={idx} src={img} onClick={() => setMainImage(img)}
              className={`h-20 w-28 object-cover rounded-xl cursor-pointer transition ${img===mainImage ? "ring-4 ring-blue-600" : "opacity-80 hover:opacity-100"}`} />
          ))}
        </div>
      </div>

      <div className="mt-6 text-gray-700 leading-relaxed">{business.description || "No description provided."}</div>
      {business.rating && <p className="mt-3 text-yellow-600 font-semibold">⭐ {business.rating.toFixed(1)} / 5</p>}

      <DateSelector onChange={(sel) => setDates(sel)} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Available Rooms</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {business.units?.map((u) => (
            <div key={u.id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-600">{u.description}</p>
              <p className="text-blue-600 font-semibold mt-2">₹ {Math.round(u.pricePerNight)} / night</p>
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                disabled={!dates}
                onClick={() => {
                  if (!dates) return toast.error("Select dates first");
                  const params = new URLSearchParams({
                    start: dates.startDate.toISOString(),
                    end: dates.endDate.toISOString()
                  }).toString();
                  window.location.href = `/book/${business.id}/${u.id}?${params}`;
                }}>
                {dates ? "Book Now" : "Select Dates First"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <PriceComparison businessName={business.name} location={business.location} />
    </div>
  );
}