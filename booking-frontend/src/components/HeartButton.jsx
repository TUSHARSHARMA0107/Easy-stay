import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function HeartButton() {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        setLiked((p) => !p);
      }}
      whileTap={{ scale: 0.7 }}
      className="inline-block"
    >
      <AnimatePresence mode="wait">
        {liked ? (
          <motion.span
            key="full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-red-500 text-xl"
          >
            ❤
          </motion.span>
        ) : (
          <motion.span
            key="empty"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-gray-300 text-xl"
          >
            🤍
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}