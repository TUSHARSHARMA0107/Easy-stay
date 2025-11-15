export default function RecentSearches({ onSelect }) {
  const searches = JSON.parse(localStorage.getItem("recent_searches") || "[]");

  if (!searches.length) return null;

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Recent Searches</h3>
      <div className="flex gap-3 overflow-x-auto">
        {searches.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}