import { useEffect, useState } from "react";
import { comparePrices } from "../config/services/compare";
import LoadingAnimation from "../components/LoadingAnimation";
import { providerLogos } from "../config/providerLogos";
import { useNavigate } from "react-router-dom";

export default function CompareModal({ name, location, type, cover, onClose }) {
  const [data, setData] = useState(null);
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(new Date().toISOString().split("T")[0]);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    const res = await comparePrices({ name, location, type, checkIn, checkOut, guests, rooms });
    setData(res);
    setLoading(false);
  };
  useEffect(() => { load(); /* initial */ }, []);

  const goBookInternal = (item) => {
    const image = encodeURIComponent(cover || "");
    const qs = new URLSearchParams({
      placeId: item.raw?.internalId || "",
      name, price: String(item.price || 0), img: image
    });
    nav(`/book?${qs.toString()}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white dark:bg-[#0D1117] w-full sm:w-[440px] max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{location}</p>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[65vh]">
          <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-md">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs">Check-in</label>
                <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} className="w-full border rounded-md px-2 py-1" />
              </div>
              <div>
                <label className="text-xs">Check-out</label>
                <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} className="w-full border rounded-md px-2 py-1" />
              </div>
              <div>
                <label className="text-xs">Guests</label>
                <input type="number" min="1" value={guests} onChange={e=>setGuests(Number(e.target.value))} className="w-full border rounded-md px-2 py-1" />
              </div>
              <div>
                <label className="text-xs">Rooms</label>
                <input type="number" min="1" value={rooms} onChange={e=>setRooms(Number(e.target.value))} className="w-full border rounded-md px-2 py-1" />
              </div>
            </div>
            <button onClick={load} className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg">Refresh Prices</button>
          </div>

          {loading && <LoadingAnimation text="Comparing best prices..." />}

          {!loading && data && (
            <>
              {data.results.map((p, i) => {
                const logo = providerLogos[p.platform?.toLowerCase()] || providerLogos["easystay"];
                const isInternal = p.platform === "easystay";
                return (
                  <div key={i}
                    className={`flex items-center justify-between p-3 border rounded-xl bg-white dark:bg-[#0D1117] shadow-sm ${
                      p.isCheapest ? "ring-2 ring-green-500" : "" }`}>
                    <div className="flex items-center gap-3">
                      <img src={logo} className="w-8 h-8 rounded-md object-contain" />
                      <div>
                        <p className="font-medium capitalize">{p.platform}</p>
                        <p className={`text-xs ${p.isCheapest ? "text-green-600" : "text-gray-500 dark:text-gray-400"}`}>
                          {p.isCheapest ? "BEST PRICE" : "Available"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">{p.currency || "INR"} {p.price ?? "—"}</p>
                      {isInternal ? (
                        <button className="text-sm text-blue-600 hover:text-blue-700 underline"
                          onClick={() => goBookInternal(p)}>Book →</button>
                      ) : p.safeRedirect ? (
                        <a href={p.safeRedirect} target="_blank" rel="noopener noreferrer"
                           className="text-sm text-blue-600 hover:text-blue-700 underline">Book →</a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="w-full bg-gray-900 dark:bg-gray-200 text-white dark:text-black py-2 rounded-xl">Close</button>
        </div>
      </div>
    </div>
  );
}