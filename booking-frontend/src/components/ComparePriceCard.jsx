export default function ComparePriceCard({ data }) {
  return (
    <div
      className={`p-4 rounded-xl border shadow bg-white dark:bg-[#0D1117] ${
        data.isCheapest ? "border-green-600 shadow-md" : "border-gray-300 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={data.image || "/images/provider-default.png"}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-white text-lg">
            {data.source}
          </p>

          {data.rating && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              ⭐ {data.rating}
            </p>
          )}

          <p className="text-xl font-bold text-blue-600 mt-1">
            ₹ {data.price}
          </p>

          {data.isCheapest && (
            <span className="text-sm text-green-600 font-semibold">
              Cheapest Option
            </span>
          )}
        </div>
      </div>

      {/* Button */}
      <a
        href={data.safeRedirect}
        target="_blank"
        rel="noreferrer"
        className="block mt-3 text-center bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Book on {data.source} →
      </a>
    </div>
  );
}