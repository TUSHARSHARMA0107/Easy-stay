export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#0D1117] rounded-xl p-4 shadow animate-pulse">
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-xl" />

      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
}