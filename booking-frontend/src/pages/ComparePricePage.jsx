// src/pages/ComparePricesPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../config/axios.js";

export default function ComparePricesPage() {
  const [searchParams] = useSearchParams();
  const hotelName = searchParams.get("hotelName") || "";
  const location = searchParams.get("location") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPrices = async () => {
    if (!hotelName && !location) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/api/compare-prices", {
        params: { hotelName, location },
      });
      setData(res.data);
    } catch (err) {
      console.error("Compare prices error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
    // eslint-disable-next-line
  }, [hotelName, location]);

  if (!hotelName && !location) {
    return (
      <div className="pb-24 text-center text-gray-500 dark:text-gray-400 py-10">
        No hotel or location provided.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pb-24 text-center text-gray-500 dark:text-gray-400 py-10">
        Comparing prices for <b>{hotelName}</b>...
      </div>
    );
  }

  if (!data || !data.results || !data.results.length) {
    return (
      <div className="pb-24 text-center text-gray-500 dark:text-gray-400 py-10">
        No price data available.
      </div>
    );
  }

  const { cheapest, results } = data;

  return (
    <div className="pb-24 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Prices for {hotelName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Location: {location}
        </p>
      </div>

      {cheapest && (
        <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 shadow">
          <p className="text-xs uppercase font-semibold text-green-700 dark:text-green-300 mb-1">
            Cheapest option
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {cheapest.source}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ₹ {cheapest.price}
              </p>
            </div>
            <a
              href={cheapest.safeRedirect}
              target="_blank"
              className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              Book on {cheapest.source}
            </a>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {results.map((r, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-[#0D1117] border dark:border-gray-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {r.source}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ₹ {r.price || "-"}
              </p>
            </div>
            <a
              href={r.safeRedirect}
              target="_blank"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Go to site
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}