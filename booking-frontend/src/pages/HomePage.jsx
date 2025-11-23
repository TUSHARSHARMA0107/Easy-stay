import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const FEATURED_CITIES = [
  { id: "shimla", label: "Shimla", query: "Shimla hill station India" },
  { id: "goa", label: "Goa", query: "Goa beach India" },
  { id: "assam", label: "Assam", query: "Assam tea gardens India" },
];

function AttractionStrip({ items, loading }) {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-52 h-32 bg-slate-100 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-sm text-slate-500">No attractions found.</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      {items.map((img, idx) => (
        <div
          key={idx}
          className="min-w-[200px] h-36 rounded-2xl overflow-hidden relative group shadow-sm"
        >
          <img
            src={img.url || img.imageUrl || img.thumbnail}
            alt={img.title || img.source || "Attraction"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
          <p className="absolute bottom-2 left-3 text-xs font-medium text-white drop-shadow">
            {img.title || img.source || "Attraction"}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExternalHotelCard({ hotel }) {
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
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200";

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      <div className="h-40 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{name}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <i className="ri-map-pin-line text-[16px] text-emerald-500" />
          {location}
        </p>

        {rating && (
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1">
              <i className="ri-star-fill text-[13px] mr-1" />
              {typeof rating === "number" ? rating.toFixed(1) : rating}
            </span>
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
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
            <p className="text-xs text-slate-500">Price info not available</p>
          )}

          <button className="text-xs px-3 py-1 rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition">
            View details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const [activeCity, setActiveCity] = useState(FEATURED_CITIES[0]);
  const [attractions, setAttractions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loadingAttr, setLoadingAttr] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchAttractions = async (cityQuery) => {
    setLoadingAttr(true);
    setErrorMsg("");

    try {
      const res = await api.get("/booking/images", {
        params: {
          q: cityQuery,
          limit: 10,
        },
      });

      setAttractions(res.data?.images || res.data?.results || []);
    } catch (err) {
      console.log("Home attractions error:", err);
      setErrorMsg("Could not load attractions right now.");
      setAttractions([]);
    } finally {
      setLoadingAttr(false);
    }
  };

  const fetchHotelsForCity = async (cityQuery) => {
    setLoadingHotels(true);
    setErrorMsg("");

    try {
      // 1) Auto-complete to get locationId
      const ac = await api.get("/booking/hotels/auto-complete", {
        params: { query: cityQuery },
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

      // 2) Search hotels by locationId
      const searchRes = await api.get("/booking/hotels/search", {
        params: { locationId },
      });

      const list =
        searchRes.data?.hotels ||
        searchRes.data?.results ||
        searchRes.data?.data ||
        [];

      setHotels(list.slice(0, 6));
    } catch (err) {
      console.log("Home hotels error:", err);
      setErrorMsg("Could not load hotels right now.");
      setHotels([]);
    } finally {
      setLoadingHotels(false);
    }
  };

  const loadCityData = (city) => {
    const q = city.query;
    fetchAttractions(q);
    fetchHotelsForCity(q);
  };

  useEffect(() => {
    loadCityData(activeCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCity.id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
  };

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
        {/* TOP HERO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-semibold">
              Easystay curated
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">
              Stay. Work. Escape.{" "}
              <span className="text-emerald-500">Beautifully.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 mt-3 max-w-xl">
              Discover premium stays across India with live data powered by
              Booking.com & curated attraction visuals. One place for both{" "}
              <span className="font-semibold">owner</span> and{" "}
              <span className="font-semibold">guest</span>.
            </p>
          </div>

          {/* Quick Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:w-[320px] bg-slate-50 rounded-2xl p-3.5 shadow-inner border border-slate-200"
          >
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Quick search
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-2.5 py-2">
                <i className="ri-map-pin-line text-emerald-500 text-lg" />
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Try Shimla, Goa, Assam..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 transition-colors"
            >
              Search stays
            </button>
          </form>
        </div>

        {/* CITY TABS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {FEATURED_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-2 rounded-full text-sm border transition-all flex items-center gap-2 ${
                activeCity.id === city.id
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {city.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs text-red-500">{errorMsg}</div>
        )}

        {/* ATTRACTIONS SECTION */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Popular sights around {activeCity.label}
            </h2>
            <p className="text-xs text-slate-500">
              Live images via Google Search API
            </p>
          </div>

          <AttractionStrip items={attractions} loading={loadingAttr} />
        </section>

        {/* HOTELS SECTION */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Stays around {activeCity.label}
            </h2>
            <p className="text-xs text-slate-500">
              Live prices from Booking.com RapidAPI
            </p>
          </div>

          {loadingHotels ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-slate-50 animate-pulse h-56"
                />
              ))}
            </div>
          ) : hotels.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hotels.map((h, idx) => (
                <ExternalHotelCard key={idx} hotel={h} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No hotels found for this destination right now. Try searching
              directly or choose another city.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}