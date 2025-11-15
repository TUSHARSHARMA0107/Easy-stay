import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdvancedSearchBar from "../components/AdvancedSearchBar.jsx";
import Categories from "../components/Categories.jsx";
import FilterModal from "../model/FilterModal.jsx";
import SkeletonPlaceCard from "../components/SkleteonPlaceCard.jsx";
import api from "../config/axios.js";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialQuery = searchParams.get("query") || "";
  const initialType = searchParams.get("type") || "";

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [radius, setRadius] = useState(10000);
  const [minRating, setMinRating] = useState(0);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const searchPlaces = async (opts = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/api/google/places/search", {
        params: {
          query: opts.query ?? query,
          type: opts.type ?? type,
          radius,
          minRating,
        },
      });
      setPlaces(res.data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchPlaces({});
    // eslint-disable-next-line
  }, [type]);

  const handleSearch = (text) => {
    const trimmed = text.trim();
    setQuery(trimmed);
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    searchPlaces({ query: trimmed });
  };

  const handleCardClick = (place) => {
    const id = place.id || place.placeId || place.googlePlaceId;
    if (!id) return;
    navigate(`/places/${encodeURIComponent(id)}`);
  };

  const renderPlaceCard = (place, i) => {
    const image =
      place.photoUrl ||
      place.photo ||
      "https://via.placeholder.com/400x250?text=EasyStay";

    return (
      <div
        key={i}
        className="bg-white dark:bg-[#0D1117] rounded-2xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col"
        onClick={() => handleCardClick(place)}
      >
        <img src={image} alt={place.name} className="h-40 w-full object-cover" />

        <div className="p-4 space-y-1 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {place.name || place.displayName?.text}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {place.address || place.formattedAddress}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            ⭐ {place.rating || "-"} {`place.userRatingsTotal ? (${place.userRatingsTotal}) : ""`}
          </p>
          <div className="mt-2 text-xs uppercase text-blue-600 dark:text-blue-400">
            Tap to view details & compare prices
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 space-y-5">
      <AdvancedSearchBar
        initialValue={query}
        onSearch={handleSearch}
        onFilter={() => setFilterOpen(true)}
      />

      <Categories
        onSelect={(cat) => {
          const t = cat.type;
          setType(t);
          navigate(`/search?type=${encodeURIComponent(t)}`);
        }}
      />

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <>
            <SkeletonPlaceCard />
            <SkeletonPlaceCard />
            <SkeletonPlaceCard />
          </>
        ) : places.length > 0 ? (
          places.map(renderPlaceCard)
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            No places found. Try a different search.
          </p>
        )}
      </div>

      <FilterModal
        open={filterOpen}
        onClose={() => {
          setFilterOpen(false);
          searchPlaces({});
        }}
        filters={{ radius, rating: minRating }}
        setFilters={(vals) => {
          if (vals.radius) setRadius(vals.radius);
          if (vals.rating !== undefined) setMinRating(vals.rating);
        }}
      />
    </div>
  );
}