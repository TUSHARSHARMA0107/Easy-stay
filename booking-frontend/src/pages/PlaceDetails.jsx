import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios.js";
import ComparePricesModal from "../model/CpmparPricesModal.jsx.jsx";
import SkeletonPlaceCard from "../components/SkleteonPlaceCard.jsx";
import AmenitiesGrid from "../components/AmenitiesGrid.jsx";
import ReviewModal from "../model/ReviewModal.jsx";

export default function PlaceDetailsPage() {
  const { placeId } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compareOpen, setCompareOpen] = useState(false);
  const [pricesData, setPricesData] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const loadPlace = async () => {
    try {
      const res = await api.get(`/api/google/places/${placeId}`);
      setPlace(res.data.place || res.data);
    } catch (err) {
      console.error("Place details error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPrices = async () => {
    if (!place) return;
    setCompareOpen(true);
    try {
      const res = await api.get("/api/compare-prices", {
        params: {
          hotelName: place.displayName?.text || place.name,
          location: place.formattedAddress,
        },
      });
      setPricesData(res.data);
    } catch (err) {
      console.error("Compare prices error:", err);
    }
  };

  useEffect(() => {
    loadPlace();
    // eslint-disable-next-line
  }, [placeId]);

  if (loading) {
    return (
      <div className="pb-24">
        <SkeletonPlaceCard />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="pb-24 text-center text-gray-500 dark:text-gray-400">
        Place not found.
      </div>
    );
  }

  const mainImage =
    place.photoUrl ||
    place.photo ||
    "https://via.placeholder.com/800x400?text=EasyStay";

  return (
    <div className="pb-24 space-y-5">
      <div className="rounded-2xl overflow-hidden shadow">
        <img src={mainImage} alt={place.name} className="w-full h-56 sm:h-72 object-cover" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {place.displayName?.text || place.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {place.formattedAddress}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ⭐ {place.rating || "-"}{" "}
          {place.userRatingsTotal ? (`${place.userRatingsTotal} reviews`) : ""}
        </p>
      </div>

      <AmenitiesGrid
        list={["wifi", "parking", "food", "ac", "gym"].filter(Boolean)}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={loadPrices}
          className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
        >
          Compare Prices
        </button>
        <button
          onClick={() => setReviewOpen(true)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Write a Review
        </button>
      </div>

      {/* Compare price modal */}
      <ComparePricesModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        data={pricesData?.results || []}
      />

      {/* Review modal (businessId is not from Google, so pass null or integrate when using your own businesses) */}
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        businessId={null}
        onSubmitted={() => {}}
      />
    </div>
  );
}