import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
export default function Trending() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        let loaded = false;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const res = await api.get("/google/nearby", { params: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
            setPlaces(res.data.results || []);
            loaded = true; setLoading(false);
          });
        }
        setTimeout(async () => {
          if (!loaded) {
            const res = await api.get("/google/search", { params: { query: "hotels in Manali" } });
            setPlaces(res.data.results || []);
            setLoading(false);
          }
        }, 1200);
      } catch {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  if (loading) return <div className="text-center py-10">Loading trending stays...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Trending Stays Near You</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((p, i) => (
          <Link key={i} to={`/search?name=${encodeURIComponent(p.name)}`}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={p.photo || p.image || "/images/default-hotel.jpg"} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.address || p.vicinity}</p>
              {p.rating && <p className="mt-1 text-yellow-600 font-medium">★ {p.rating}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}