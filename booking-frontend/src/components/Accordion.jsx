import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeartButton from "./HeartButton";

export default function ModernHotelCard({ hotel, onClick }) {
  const photos = hotel.photos?.length ? hotel.photos : ["/placeholder.png"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % photos.length);
    }, 2000);
    return () => clearInterval(t);
  }, [photos]);

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer relative"
    >
      <motion.img
        key={index}
        src={photos[index]}
        className="h-40 w-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      <div className="absolute top-3 right-3">
        <HeartButton />
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1">{hotel.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-1">
          {hotel.city}
          {`hotel.country ? , ${hotel.country} : ""`}
        </p>
        {hotel.price && (
          <p className="text-blue-600 text-sm font-bold mt-1">
            {hotel.currency || "INR"} {hotel.price}
          </p>
        )}
        {hotel.rating && (
          <p className="text-xs text-yellow-500">
            ⭐ {hotel.rating}{" "}
            {`hotel.reviewCount ? (${hotel.reviewCount}) : ""`}
          </p>
        )}
      </div>
    </motion.div>
  );
}