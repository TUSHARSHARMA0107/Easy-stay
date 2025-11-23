// src/components/SearchResultCard.jsx
import { motion } from "framer-motion";
import HeartButton from "./HeartButton";

export default function SearchResultCard({ item, onClick }) {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow relative cursor-pointer"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
    >
      {item.thumbnail && (
        <img src={item.thumbnail} className="h-32 w-full object-cover" />
      )}

      <div className="absolute top-2 right-2">
        <HeartButton />
      </div>

      <div className="p-2">
        <h3 className="text-sm font-semibold line-clamp-1">{item.name}</h3>
        <p className="text-xs text-gray-500">
          {item.city} {`item.country && • ${item.country}`}
        </p>
        {item.price?.amount && (
          <p className="text-blue-600 font-bold text-sm mt-1">
            {item.price.amount} {item.price.currency}
          </p>
        )}
        {item.rating?.score && (
          <p className="text-xs text-yellow-500">
            ⭐ {item.rating.score}
          </p>
        )}
      </div>
    </motion.div>
  );
}