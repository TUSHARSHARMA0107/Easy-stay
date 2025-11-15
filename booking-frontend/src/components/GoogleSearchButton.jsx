export default function GoogleSearchButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 shadow hover:shadow-md transition"
    >
      <img
        src="https://www.gstatic.com/images/branding/product/1x/maps_2020q4_48dp.png"
        className="w-7 h-7"
      />
      <span className="text-gray-800 dark:text-gray-200 font-medium">
        Search With Google
      </span>
    </button>
  );
}