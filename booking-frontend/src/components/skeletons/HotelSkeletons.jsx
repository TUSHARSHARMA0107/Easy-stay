// components/user/skeletons/HotelSkeleton.jsx
export default function HotelSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-pulse">
      <div className="h-40 bg-gray-200 rounded-xl"></div>
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}