import { useEffect, useState } from "react";
import api from "../../config/axios";

export default function PriceComparison({ businessName, location }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await api.get("/compare", { params: { name: businessName, location }});
        setPrices(res.data.prices || []);
      } finally { setLoading(false); }
    }
    if (businessName) fetchPrices();
  }, [businessName, location]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-3">Compare Prices</h2>
      {loading ? <p>Loading comparison...</p> :
       prices.length === 0 ? <p className="text-gray-500">No external prices found.</p> :
       <div className="flex gap-4 overflow-auto pb-2">
         {prices.map((site, i) => (
           <div key={i} className="min-w-[200px] p-4 rounded-2xl shadow bg-white border hover:shadow-lg transition text-center">
             {site.logo && <img src={site.logo} alt={site.name} className="h-6 mx-auto mb-3" />}
             <div className="text-gray-800 font-medium">{site.name}</div>
             <div className="text-blue-600 text-lg font-semibold mt-1">₹ {site.price}</div>
             <a href={site.link} target="_blank" rel="noreferrer noopener" className="block bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-xl mt-3 transition">
               View Deal
             </a>
           </div>
         ))}
       </div>}
    </div>
  );
}