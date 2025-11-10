import { Link } from "react-router-dom";

const categories = [
  { name: "Hotels", type: "HOTEL", img: "https://i.ibb.co/9wW258H/hotel.jpg" },
  { name: "Hostels", type: "HOSTEL", img: "https://i.ibb.co/4NgkPkx/hostel.jpg" },
  { name: "Airbnb Homes", type: "AIRBNB", img: "https://i.ibb.co/bsWgD7Z/airbnb.jpg" },
  { name: "Guest Houses", type: "GUESTHOUSE", img: "https://i.ibb.co/YPQJDTG/guest.jpg" },
];

export default function Categories() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {categories.map(c => (
          <Link key={c.type} to={`/search?type=${c.type}`}
            className="relative rounded-2xl overflow-hidden group shadow hover:shadow-lg transition">
            <img src={c.img} alt={c.name} className="h-40 w-full object-cover group-hover:scale-105 transition" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition flex items-end p-3">
              <p className="text-white font-medium drop-shadow">{c.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}