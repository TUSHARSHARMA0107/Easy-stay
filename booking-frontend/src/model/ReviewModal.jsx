import { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import api from "../config/axios";
import { FaStar } from "react-icons/fa";

export default function ReviewModal({ open, onClose, businessId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (rating === 0) return alert("Please select a rating");

    try {
      setLoading(true);

      await api.post(
        "/reviews/add",
        { businessId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLoading(false);
      onSubmitted(); // Reload reviews outside modal
      onClose(); // Close modal
    } catch {
      console.error("Review submit error:", );
      alert("Failed to submit review.");
      setLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-lg w-full max-w-md">

        <h2 className="text-xl font-semibold mb-3 dark:text-white">
          Write a Review
        </h2>

        {/* ⭐ Rating Stars */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={28}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`cursor-pointer transition
                ${star <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-400"
                }`}
            />
          ))}
        </div>

        {/* 📝 Comment */}
        <textarea
          placeholder="Write your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border dark:border-neutral-700 dark:bg-neutral-800 
                     rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                     text-sm dark:text-white"
          rows={4}
        ></textarea>

        {/* Submit */}
        <button
          disabled={loading}
          onClick={submitReview}
          className="w-full mt-4 py-2 rounded-lg text-white
                     bg-gradient-to-r from-blue-500 to-blue-700
                     hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

      </div>
    </ModalWrapper>
  );
}