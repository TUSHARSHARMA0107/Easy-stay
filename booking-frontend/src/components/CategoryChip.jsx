export default function CategoryChips({ categories, selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {categories.map((c, i) => (
        <button
          key={i}
          onClick={() => onSelect(c)}
          className={`px-4 py-2 rounded-full whitespace-nowrap border
            ${
              selected === c
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-[#0D1117] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
            }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}