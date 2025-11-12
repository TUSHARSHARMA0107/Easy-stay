import { useEffect, useMemo, useState } from "react";
import { searchPlaces } from "../api/places";
import PlaceCard from "../components/PlaceCard";
import PlacesMap from "../components/PlacesMap";
import LoadingAnimation from "../components/LoadingAnimation";
import { AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState("rating-desc");
  const [topRated, setTopRated] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [category, setCategory] = useState("hotels");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const la = pos.coords.latitude, lo = pos.coords.longitude;
        setLat(la); setLng(lo);
        const list = await searchPlaces({ query: "hotels", lat: la, lng: lo, radius: 8000 });
        setResults(list); setLoading(false);
      },
      async () => {
        const list = await searchPlaces({ query: "hotels in Goa" });
        setResults(list); setLoading(false);
      }
    );
  }, []);

  const doSearch = async () => {
    setLoading(true);
    const list = await searchPlaces({
      query: query || (type || "popular places"),
      type: type || undefined,
      openNow: openNow || undefined,
      lat: lat || undefined, lng: lng || undefined, radius: 10000
    });
    setResults(list);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return (results || [])
      .filter(p => !topRated || (p.rating && p.rating >= 4.3))
      .filter(p => !openNow || p.openingHours?.openNow === true)
      .filter(p => {
        const price = p.price || p.priceLevel || null;
        if (price == null) return true;
        return price >= minPrice && price <= maxPrice;
      });
  }, [results, topRated, openNow, minPrice, maxPrice]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const nameOf = (x) => (x.displayName?.text || x.name || "").toLowerCase();
    if (sortBy === "rating-desc") arr.sort((a,b) => (b.rating||0)-(a.rating||0));
    if (sortBy === "rating-asc") arr.sort((a,b) => (a.rating||0)-(b.rating||0));
    if (sortBy === "name-asc") arr.sort((a,b) => nameOf(a).localeCompare(nameOf(b)));
    if (sortBy === "name-desc") arr.sort((a,b) => nameOf(b).localeCompare(nameOf(a)));
    if (sortBy === "distance-asc" && lat && lng) {
      const d = (x) => {
        const la = x.location?.latitude || x.geometry?.location?.lat;
        const lo = x.location?.longitude || x.geometry?.location?.lng;
        if (!la || !lo) return Number.MAX_VALUE;
        return Math.hypot(la - lat, lo - lng);
      };
      arr.sort((a,b) => d(a) - d(b));
    }
    return arr;
  }, [filtered, sortBy, lat, lng]);

  const categories = [
    { key: "hotels", label: "Hotels", t: "lodging" },
    { key: "hostels", label: "Hostels", t: "hostel" },
    { key: "restaurants", label: "Restaurants", t: "restaurant" },
    { key: "cafes", label: "Cafes", t: "cafe" },
    { key: "attractions", label: "Attractions", t: "tourist_attraction" }
  ];

  return (
    <div className="p-4 pb-24">
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {categories.map(c => (
          <button key={c.key}
            onClick={() => { setCategory(c.key); setType(c.t); }}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              category===c.key ? "bg-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0D1117] rounded-xl shadow p-3 mb-3">
        <input className="w-full border rounded-md px-3 py-2 mb-2" value={query}
               onChange={(e)=>setQuery(e.target.value)}
               placeholder="Search by name or location (e.g., Taj Hotel Mumbai)"/>
        <div className="grid grid-cols-2 gap-2">
          <select className="border rounded-md px-3 py-2" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="rating-desc">⭐ Rating (High→Low)</option>
            <option value="rating-asc">⭐ Rating (Low→High)</option>
            <option value="name-asc">A→Z</option>
            <option value="name-desc">Z→A</option>
            <option value="distance-asc">📍 Distance (near first)</option>
          </select>
          <button className="border rounded-md px-3 py-2" onClick={()=>setShowMap(v=>!v)}>
            {showMap ? "List View" : "Map View"}
          </button>

          <button className={`px-3 py-2 rounded-md ${topRated ? "bg-green-600 text-white" : "bg-gray-100"}`}
                  onClick={()=>setTopRated(v=>!v)}>⭐ Top Rated</button>
          <button className={`px-3 py-2 rounded-md ${openNow ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                  onClick={()=>setOpenNow(v=>!v)}>⏱ Open Now</button>

          <div className="col-span-2">
            <label className="text-xs">Price Range (₹)</label>
            <input type="range" min="0" max="20000" value={minPrice} onChange={e=>setMinPrice(+e.target.value)} className="w-full"/>
            <p className="text-xs text-gray-500">Min: ₹{minPrice}</p>
            <input type="range" min="500" max="50000" value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} className="w-full"/>
            <p className="text-xs text-gray-500">Max: ₹{maxPrice}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-blue-600 text-white rounded-md py-2" onClick={doSearch}>Search</button>
          <button className="flex-1 bg-gray-100 rounded-md py-2" onClick={()=>{ setQuery(""); doSearch(); }}>Clear</button>
        </div>
      </div>

      {loading && <LoadingAnimation text="Loading nearby places..." />}

      {!loading && showMap && <PlacesMap places={sorted} />}

      {!loading && !showMap && (
        <AnimatePresence>
          {sorted.map((p, idx) => (
            <div key={p.id || p.placeId || idx}>
              <PlaceCard place={p}/>
            </div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}