import { useEffect, useState } from "react";
import { searchPlaces } from "../config/api/places";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TrendingPlaces() {
  const [places, setPlaces] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await searchPlaces({ query: "top hotels in India" });
        setPlaces(res.slice(0, 5));
      } catch (err) {
        console.log("Trending failed:", err);
      }
    }
    loadTrending();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">Trending Now</h2>
      <div className="space-y-3">
        {places.length === 0 && (
          <p className="text-gray-500 text-sm">Loading trending places...</p>
        )}

        {places.map((p, i) => {
          const img = p.photos?.[0]?.name
            ? "https://google-map-places-new-v2.p.rapidapi.com/v1/${p.photos[0].name}/media?maxWidthPx=500&maxHeightPx=400&skipHttpRedirect=true"
            : "https://via.placeholder.com/100x100?text=Stay";

          const name = p.displayName?.text || p.name;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 p-3 bg-white dark:bg-[#0D1117] rounded-xl shadow"
            >
              <img src={img} className="w-20 h-20 object-cover rounded-xl" />

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {name}
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  ⭐ {p.rating || "-"} • {p.formattedAddress}
                </p>

                <button
                  onClick={() =>
                    nav(`/explore?query=${encodeURIComponent(name)}`)
                  }
                  className="text-blue-600 text-sm hover:underline"
                >
                  Explore →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}