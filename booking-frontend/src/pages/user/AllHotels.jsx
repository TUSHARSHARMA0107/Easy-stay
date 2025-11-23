// src/pages/user/AllHotels.jsx
import { useEffect, useState } from "react";
import api from "../../config/api";
import PageHeader from "../../components/user/PageHeader";
import HotelCard from "../../components/user/HotelCard";
import HotelSkeleton from "../../components/skeletons/HotelSkeletons";

export default function AllHotels() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/business/all"); // backend: GET /api/business/all
      setList(res.data.businesses || []);
    } catch (err) {
      console.log("Load hotels error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <PageHeader
        title="Find your next stay"
        subtitle="Explore verified hotels and stays listed by our partners."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <HotelSkeleton key={n} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}