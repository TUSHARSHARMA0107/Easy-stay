export default function HeroSection({ title, subtitle, image, onClick }) {
  return (
    <div
      className="w-full h-[260px] sm:h-[340px] rounded-3xl overflow-hidden relative shadow-xl mb-8"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-6 left-6 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-xl">
          {title}
        </h2>
        <p className="text-sm sm:text-lg mt-1 opacity-90">{subtitle}</p>

        <button
          onClick={onClick}
          className="mt-4 px-6 py-2.5 bg-white text-black rounded-xl text-sm sm:text-base font-semibold shadow hover:bg-gray-200 transition"
        >
          Explore Stays
        </button>
      </div>
    </div>
  );
}