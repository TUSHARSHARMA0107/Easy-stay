import { useState } from "react";

export default function ImageCarousel({ images = [] }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  if (!images.length) return null;

  return (
    <div className="relative w-full h-56 sm:h-72 overflow-hidden rounded-xl">
      <img
        src={images[index]}
        className="w-full h-full object-cover"
      />

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ›
      </button>
    </div>
  );
}