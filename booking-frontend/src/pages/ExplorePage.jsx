import { useEffect, useState } from "react";
import api from "../config/api";

function PillButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs text-slate-700 hover:text-emerald-600 transition-colors"
    >
      {label}
    </button>
  );
}

function AttractionGrid({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-xs text-slate-500">No attractions yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((img, idx) => (
        <div
          key={idx}
          className="relative rounded-2xl overflow-hidden h-32 shadow-sm group"
        >
          <img
            src={img.url || img.imageUrl || img.thumbnail}
            alt={img.title || "Place"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
          <p className="absolute bottom-2 left-3 text-[11px] text-white font-medium drop-shadow">
            {img.title || img.source || "Attraction"}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExternalHotelRow({ hotel }) {
  const name =
    hotel.hotel_name || hotel.name || hotel.title || "Hotel / Stay";
  const location =
    hotel.city_trans ||
    hotel.city_name ||
    hotel.district ||
    hotel.region ||
    "Location not available";
  const rating =
    hotel.review_score ||
    hotel.rating ||
    hotel.reviewScore ||
    hotel.reviewScoreWord;
  const price =
    hotel.min_total_price ||
    hotel.price ||
    hotel.price_from ||
    hotel.priceBreakdown?.gross_price ||
    null;
  const currency =
    hotel.currencycode ||
    hotel.currency_code ||
    hotel.priceBreakdown?.currency ||
    "₹";
  const image =
    hotel.main_photo_url ||
    hotel.photoMainUrl ||
    (hotel.images && hotel.images[0]) ||
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200";

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-3 hover:shadow-md transition-shadow">
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
          {name}
        </h3>
        <p className="text-[11px] text-slate-500 flex items-center gap-1">
          <i className="ri-map-pin-line text-emerald-500 text-sm" />
          {location}
        </p>
        {rating && (
          <p className="text-[11px] text-slate-600 flex items-center gap-1">
            <span className="inline-flex items-center justify-center text-[11px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              <i className="ri-star-fill mr-1 text-[11px]" />
              {typeof rating === "number" ? rating.toFixed(1) : rating}
            </span>
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          {price ? (
            <p className="text-xs font-semibold text-slate-900">
              {currency}{" "}
              {typeof price === "number"
                ? price.toFixed(0)
                : String(price).split(".")[0]}{" "}
              <span className="text-[10px] text-slate-500 font-normal">
                /night
              </span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-500">Price not available</p>
          )}
          <button className="text-[11px] px-3 py-1 rounded-full border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [query, setQuery] = useState("Shimla");
  const [attractions, setAttractions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loadingAttr, setLoadingAttr] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const runExplore = async (destination) => {
    if (!destination.trim()) return;
    setErrorMsg("");

    // Attractions
    setLoadingAttr(true);
    setAttractions([]);
    try {
      const res = await api.get("/booking/images", {
        params: { q:` ${destination} tourist places India`, limit: 12 },
      });
      setAttractions(res.data?.images || res.data?.results || []);
    } catch (err) {
      console.log("Explore attractions error:", err);
      setErrorMsg("Some parts of the explore data could not load.");
      setAttractions([]);
    } finally {
      setLoadingAttr(false);
    }

    // Hotels
    setLoadingHotels(true);
    setHotels([]);
    try {
      const ac = await api.get("/booking/hotels/auto-complete", {
        params: { query: destination },
      });

      let first;
      if (Array.isArray(ac.data)) first = ac.data[0];
      else if (Array.isArray(ac.data?.data)) first = ac.data.data[0];
      else if (Array.isArray(ac.data?.results)) first = ac.data.results[0];

      const locationId =
        first?.locationId || first?.location_id || first?.dest_id;

      if (!locationId) {
        setHotels([]);
        setLoadingHotels(false);
        return;
      }

      const searchRes = await api.get("/booking/hotels/search", {
        params: { locationId },
      });

      const list =
        searchRes.data?.hotels ||
        searchRes.data?.results ||
        searchRes.data?.data ||
        [];

      setHotels(list.slice(0, 10));
    } catch (err) {
      console.log("Explore hotels error:", err);
      setErrorMsg("Some parts of the explore data could not load.");
      setHotels([]);
    } finally {
      setLoadingHotels(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runExplore(query);
  };

  useEffect(() => {
    runExplore(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen w-full 
      bg-gradient-to-br from-slate-200 to-slate-300 
      dark:from-black dark:to-slate-900
      flex justify-center py-10 px-4"
    >
      <div
        className="
        w-full max-w-6xl 
        bg-white
        rounded-3xl
        shadow-2xl shadow-[0_0_40px_rgba(0,0,0,0.12)]
        border border-slate-200
        px-6 md:px-10 py-8
      "
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Explore destinations
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              Type any city or choose a preset spot to see{" "}
              <span className="font-medium">attractions</span> and{" "}
              <span className="font-medium">live hotel prices</span> in one
              view.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full md:w-[320px] bg-slate-50 rounded-2xl p-3.5 border border-slate-200"
          >
            <p className="text-xs text-slate-500 mb-1">Destination</p>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try Manali, Jaipur, Kochi..."
              className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500"
            />
            <button
              type="submit"
              className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors"
            >
              Explore
            </button>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Shimla", "Goa", "Assam", "Manali"].map((c) => (
                <PillButton
                  key={c}
                  label={c}
                  onClick={() => {
                    setQuery(c);
                    runExplore(c);
                  }}
                />
              ))}
            </div>
          </form>
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs text-red-500">{errorMsg}</div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Attractions */}
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <i className="ri-image-2-line text-emerald-500 text-lg" />
              Visual attractions
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Sights, views & vibes fetched via Google Image Search API.
            </p>

            <AttractionGrid items={attractions} loading={loadingAttr} />
          </div>

          {/* RIGHT: Hotels */}
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <i className="ri-hotel-bed-line text-emerald-500 text-lg" />
              Stays & live prices
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Top properties from Booking.com RapidAPI for this destination.
            </p>

            {loadingHotels ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-2xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : hotels.length ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {hotels.map((h, idx) => (
                  <ExternalHotelRow key={idx} hotel={h} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No hotel data available for this search yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}