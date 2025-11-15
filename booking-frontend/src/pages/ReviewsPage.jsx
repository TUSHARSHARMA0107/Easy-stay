// src/pages/ReviewsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios.js";
import ReviewCard from "../components/ReviewCard.jsx";
import ReviewModal from "../model/ReviewModal.jsx";

export default function ReviewsPage() {
  const { businessId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);

  const loadReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/${businessId}`);
      setReviews(res.data.reviews || res.data);
    } catch (err) {
      console.error("Reviews load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line
  }, [businessId]);

  if (loading) {
    return (
      <div className="pb-24 text-center py-10 text-gray-500 dark:text-gray-400">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reviews
        </h1>
        <button
          onClick={() => setReviewOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          Write a review
        </button>
      </div>

      {reviews.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No reviews yet. Be the first one!
        </p>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        businessId={businessId}
        onSubmitted={loadReviews}
      />
    </div>
  );
}