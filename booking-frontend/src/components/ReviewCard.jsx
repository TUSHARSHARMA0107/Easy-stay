export default function ReviewCard({ review }) {
  return (
    <div className="p-4 bg-white dark:bg-[#0D1117] rounded-xl shadow border dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={review.user?.photo || "/images/default-avatar.png"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
        </div>
      </div>

      <p className="text-yellow-500 mb-2">⭐ {review.rating}</p>

      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
    </div>
  );
}