export default function PriceOption({ options, selected, onChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-full border font-medium whitespace-nowrap
            ${
              selected === opt
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-[#0D1117] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}