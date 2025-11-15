// src/pages/OwnerDashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios.js";

export default function OwnerDashboardPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHotels = async () => {
    try {
      const res = await api.get("/api/owner/hotels");
      setHotels(res.data.hotels || res.data);
    } catch (err) {
      console.error("Owner hotels load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  return (
    <div className="pb-24 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Owner Dashboard
        </h1>
        <Link
          to="/owner/hotels/new"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          Add New Hotel
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading your hotels...</p>
      ) : hotels.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven&apos;t added any hotels yet.
        </p>
      ) : (
        <div className="space-y-3">
          {hotels.map((h) => (
            <div
              key={h.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0D1117] shadow border dark:border-gray-800 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {h.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {h.location}
                </p>
              </div>
              <Link
                to={`/owner/hotels/${h.id}/edit`}
                className="text-blue-600 dark:text-blue-400 text-sm"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}