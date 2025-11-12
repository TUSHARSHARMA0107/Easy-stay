import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../config/axios";

// Skeleton loading card component
function SkeletonCard() {
  return (
    <div className="animate-pulse flex gap-5 bg-white shadow-sm border rounded-2xl p-4">
      <div className="w-44 h-36 bg-gray-300 rounded-xl"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [params] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = params.get("location") || "";
  const type = params.get("type") || "";
  const min = params.get("min") || 0;
  const max = params.get("max") || 20000;
  const name = params.get("name") || "";


  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/search", { params: { location, type, min, max, name }});
        setResults(res.data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [location, type, min, max, name]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
        {Array(6).fill().map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  if (results.length === 0) return <p className="text-center py-20">No results found 😢 Try a different filter?</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {results.map((item) => (
        <div key={item.id} className="flex gap-5 bg-white shadow-sm hover:shadow-lg border rounded-2xl p-4 transition">
          <img src={item.images?.[0] || "/images/default-hotel.jpg"} alt={item.name} className="w-44 h-36 rounded-xl object-cover" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.location || "Unknown location"}</p>
            {item.rating && <p className="text-yellow-600 text-sm mt-1">★ {item.rating}</p>}
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="font-semibold text-blue-600 text-lg">₹ {item.minPrice || "—"}</span>
              <span className="text-gray-400">per night</span>
            </div>
            <div className="mt-2 flex gap-2 text-xs text-gray-600">
              {item.compare?.booking && <span className="px-2 py-1 bg-gray-100 rounded-full">Booking: ₹ {item.compare.booking}</span>}
              {item.compare?.mmt && <span className="px-2 py-1 bg-gray-100 rounded-full">MMT: ₹ {item.compare.mmt}</span>}
              {item.compare?.owner && <span className="px-2 py-1 bg-gray-100 rounded-full">Owner: ₹ {item.compare.owner}</span>}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Link to={`/business/${item.id}`} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] via-[#FF9154] to-[#2979FF] text-white shadow text-sm hover:brightness-110 transition">
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}