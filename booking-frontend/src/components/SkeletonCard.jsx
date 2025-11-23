// src/components/SkeletonHotelCard.jsx
export default function SkeletonHotelCard() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden shadow bg-white">
      <div className="h-32 bg-gray-300" />
      <div className="p-2 space-y-2">
        <div className="h-4 w-3/4 bg-gray-300 rounded" />
        <div className="h-3 w-1/2 bg-gray-300 rounded" />
        <div className="h-3 w-1/3 bg-gray-300 rounded" />
      </div>
    </div>
  );
}