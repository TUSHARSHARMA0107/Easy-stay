import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function AdvancedSearchBar({ onSearch, onFilter }) {
  const [query, setQuery] = useState("");

  const submit = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-[#0D1117] border dark:border-gray-700 p-3 rounded-xl shadow">
      <Search className="text-gray-500 dark:text-gray-300" />

      <input
        type="text"
        placeholder="Search by name, location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent outline-none dark:text-white"
      />

      <button
        onClick={onFilter}
        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <SlidersHorizontal className="text-gray-700 dark:text-gray-300" />
      </button>

      <button
        onClick={submit}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
      >
        Go
      </button>
    </div>
  );
}