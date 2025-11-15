import { X } from "lucide-react";
import ComparePriceCard from "../components/ComparePriceCard";

export default function ComparePricesModal({ open, onClose, loading, data }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0D1117] rounded-2xl p-5 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Compare Prices
        </h2>

        {/* Loader */}
        {loading && (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-3">Fetching prices…</p>
          </div>
        )}

        {/* Results */}
        {!loading && data?.results?.length > 0 && (
          <div className="space-y-4">
            {data.results.map((item, index) => (
              <ComparePriceCard key={index} data={item} />
            ))}
          </div>
        )}

        {!loading && data?.results?.length === 0 && (
          <p className="text-center text-gray-500 py-6">No pricing available</p>
        )}
      </div>
    </div>
  );
}