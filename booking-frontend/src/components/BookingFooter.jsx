export default function BookingFooter({ price, onBook }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#0D1117] border-t dark:border-gray-700 p-4 flex justify-between items-center z-40">
      <div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Starting from</p>
        <p className="text-xl font-bold text-blue-600">₹ {price}</p>
      </div>

      <button
        onClick={onBook}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700"
      >
        Reserve
      </button>
    </div>
  );
}