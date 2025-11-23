// components/user/skeletons/RoomSkeleton.jsx
export default function RoomSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow animate-pulse">
      <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
      <div className="h-4 bg-gray-200 mt-2 w-3/4 rounded"></div>
      <div className="h-4 bg-gray-200 mt-2 w-full rounded"></div>
    </div>
  );
}