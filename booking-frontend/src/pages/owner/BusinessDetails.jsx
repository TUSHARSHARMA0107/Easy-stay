import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import { motion as Motion } from "framer-motion";
import DateSelector from "../../components/booking/DateSelector";
import PriceComparison from "../../components/compare/PriceComparison";
import toast from "react-hot-toast";

export default function BusinessDetails() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [dates, setDates] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await api.get(`/business/${id}`);
        setBusiness(res.data.business);
        setMainImage(res.data.business.images?.[0]);
      } catch {
        toast.error("Business not found");
      } finally { setLoading(false); }
    }
    fetchBusiness();
  }, [id]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await api.get(`/reviews/${id}`);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    }
    loadReviews();
  }, [id]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const submitReview = async () => {
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!rating || !comment) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await api.post(`/reviews/${id}`, { rating: parseInt(rating), comment });
      toast.success("Review submitted!");
      setRating("");
      setComment("");
      // Reload reviews
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!business) return <div className="text-center py-10">Business Not Found</div>;
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold">{business.name}</h1>
      <p className="text-gray-600 mt-1">{business.location}</p>

      {/* GALLERY */}
      <div className="mt-6">
        {mainImage && (
          <Motion.img key={mainImage} src={mainImage} alt="main"
            className="w-full h-[350px] object-cover rounded-2xl shadow" initial={{ opacity:0 }} animate={{ opacity:1 }} />
        )}
        <div className="flex gap-3 mt-3 overflow-auto pb-1">
          {business.images?.map((img, idx) => (
            <img key={idx} src={img} onClick={() => setMainImage(img)}
              className={`h-20 w-28 object-cover rounded-xl cursor-pointer transition ${img===mainImage ? "ring-4 ring-blue-600" : "opacity-80 hover:opacity-100"}`} />
          ))}
        </div>
      </div>

      <div className="mt-6 text-gray-700 leading-relaxed">{business.description || "No description provided."}</div>
      {business.rating && <p className="mt-3 text-yellow-600 font-semibold">⭐ {business.rating.toFixed(1)} / 5</p>}

      <DateSelector onChange={(sel) => setDates(sel)} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Available Rooms</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {business.units?.map((u) => (
            <div key={u.id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-600">{u.description}</p>
              <p className="text-blue-600 font-semibold mt-2">₹ {Math.round(u.pricePerNight)} / night</p>
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                disabled={!dates}
                onClick={() => {
                  if (!dates) return toast.error("Select dates first");
                  const params = new URLSearchParams({
                    start: dates.startDate.toISOString(),
                    end: dates.endDate.toISOString()
                  }).toString();
                  window.location.href = `/book/${business.id}/${u.id}?${params}`;
                }}>
                {dates ? "Book Now" : "Select Dates First"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <PriceComparison businessName={business.name} location={business.location} />

      {/* REVIEWS SECTION */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Reviews</h2>

        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

        {reviews.map((r) => (
          <div key={r.id} className="border-b py-3">
            <div className="flex items-center gap-3">
              <img src={r.user.photo || "/images/default-avatar.png"} className="w-8 h-8 rounded-full" alt="user" />
              <span className="font-medium">{r.user.name}</span>
              <span className="text-yellow-500">★ {r.rating}</span>
            </div>
            <p className="text-sm mt-1">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* REVIEW FORM */}
      {user && (
        <div className="mt-6 p-4 border rounded-xl bg-gray-50">
          <h3 className="text-md font-medium mb-2">Leave a Review</h3>

          <input
            type="number"
            min="1"
            max="5"
            className="border p-2 rounded w-20"
            value={rating}
            onChange={e => setRating(e.target.value)}
            placeholder="Rating (1-5)"
          />

          <textarea
            className="border p-2 rounded w-full mt-2"
            placeholder="Write something.."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />

          <button
            onClick={submitReview}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}