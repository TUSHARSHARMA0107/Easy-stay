export default function ReviewBreakdown({ breakdown }) {
  return (
    <div className="space-y-3">
      {Object.keys(breakdown).map((key, i) => (
        <div key={i} className="flex items-center justify-between">
          <p className="capitalize text-gray-600 dark:text-gray-300">{key}</p>

          <div className="flex-1 mx-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              style={`{ width: ${breakdown[key] * 20}% }`}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>

          <span className="text-gray-700 dark:text-gray-200">
            {breakdown[key].toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}