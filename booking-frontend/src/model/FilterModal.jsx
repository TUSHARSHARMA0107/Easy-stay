import BottomSheet from "./BottomSheet";

export default function FilterModal({ open, onClose, filters, setFilters }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Filters">
      <div className="space-y-4">

        {/* Rating Filter */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-medium">Minimum Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={filters.rating}
            onChange={(e) => setFilters((f) => ({ ...f, rating: e.target.value }))}
            className="w-full p-2 mt-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {/* Radius */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-medium">Search Radius (meters)</label>
          <input
            type="range"
            min="1000"
            max="30000"
            value={filters.radius}
            onChange={(e) => setFilters((f) => ({ ...f, radius: e.target.value }))}
            className="w-full"
          />
          <p className="text-right text-sm text-gray-600 dark:text-gray-400">{filters.radius}m</p>
        </div>

        {/* Apply Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
        >
          Apply Filters
        </button>
      </div>
    </BottomSheet>
  );
}