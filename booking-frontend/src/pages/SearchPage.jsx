import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../config/api";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function HotelListCard({ hotel }) {
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
    "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1200";

  const badgeText =
    hotel.accommodation_type_name ||
    hotel.accommodationType ||
    hotel.unit_configuration_label ||
    "Stay";

  return (
    <div className="flex flex-col md:flex-row gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-3 hover:shadow-md transition-shadow">
      <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm md:text-base font-semibold text-slate-900 line-clamp-1">
              {name}
            </h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <i className="ri-map-pin-line text-emerald-500 text-sm" />
              {location}
            </p>
          </div>

          {rating && (
            <div className="text-right">
              <div className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1">
                <i className="ri-star-fill text-[13px] mr-1" />
                {typeof rating === "number" ? rating.toFixed(1) : rating}
              </div>
              {hotel.review_nr && (
                <p className="text-[10px] text-slate-500 mt-1">
                  {hotel.review_nr} reviews
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
            {badgeText}
          </span>
          {hotel.distance && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
              {hotel.distance} km from centre
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {price ? (
              <p className="text-sm font-semibold text-slate-900">
                {currency}{" "}
                {typeof price === "number"
                  ? price.toFixed(0)
                  : String(price).split(".")[0]}{" "}
                <span className="text-[11px] text-slate-500 font-normal">
                  /night
                </span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">Price not available</p>
            )}
            {hotel.composite_price_breakdown?.benefits?.length > 0 && (
              <p className="text-[10px] text-emerald-600 mt-0.5">
                {hotel.composite_price_breakdown.benefits[0].text}
              </p>
            )}
          </div>

          <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-semibold transition">
            View rooms
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const q = useQuery();
  const initialQuery = q.get("query") || "Goa";

  const [query, setQuery] = useState(initialQuery);
  const [dateIn, setDateIn] = useState("");
  const [dateOut, setDateOut] = useState("");
  const [guests, setGuests] = useState(2);

  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const runSearch = async (destination) => {
    if (!destination.trim()) return;
    setErrorMsg("");
    setLoading(true);
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
        setLoading(false);
        setErrorMsg("No search results for this destination.");
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

      setHotels(list);
    } catch (err) {
      console.log("Search hotels error:", err);
      setErrorMsg("Something went wrong while searching. Try again.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  useEffect(() => {
    runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen w-full 
      bg-gradient-to-br from-slate-100 to-slate-200 
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
        {/* HEADER + FILTERS */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Search stays
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live hotel list powered by Booking.com API. You can refine later
            using filters & dates.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-200"
          >
            {/* Destination */}
            <div className="md:col-span-2">
              <p className="text-[11px] text-slate-500 mb-1">Destination</p>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-2.5">
                <i className="ri-search-line text-slate-400 text-lg" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-sm py-2"
                  placeholder="City, area or landmark"
                />
              </div>
            </div>

            {/* Check-in / out */}
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Check-in</p>
              <input
                type="date"
                value={dateIn}
                onChange={(e) => setDateIn(e.target.value)}
                className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Check-out</p>
              <input
                type="date"
                value={dateOut}
                onChange={(e) => setDateOut(e.target.value)}
                className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* Guests + Button */}
            <div className="md:col-span-4 flex flex-col md:flex-row items-stretch md:items-end gap-3 mt-1">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Guests</p>
                  <input
                    type="number"
                    min={1}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value) || 1)}
                    className="w-24 bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="md:ml-auto flex gap-2">
                <button
                  type="submit"
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition"
                >
                  Search stays
                </button>
              </div>
            </div>
          </form>
        </div>

        {errorMsg && (
          <div className="mb-3 text-xs text-red-500">{errorMsg}</div>
        )}

        {/* RESULTS */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-slate-100 animate-pulse"
                />
              ))}
            </>
          ) : hotels.length ? (
            hotels.map((h, idx) => <HotelListCard key={idx} hotel={h} />)
          ) : (
            <p className="text-sm text-slate-500">
              No results yet. Try another destination or adjust your query.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}