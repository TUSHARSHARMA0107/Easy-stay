// components/user/HotelCard.jsx
import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
  return (
    <Link to={`/hotel/${hotel.id}`}>
      <div className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition cursor-pointer">

        <img
          src={hotel.images?.[0] || "/placeholder.jpg"}
          className="h-48 w-full object-cover"
        />

        <div className="p-4">
          <h2 className="text-xl font-semibold">{hotel.name}</h2>
          <p className="text-gray-600">{hotel.address}</p>
          <p className="text-gray-900 mt-1 text-sm">
            Rooms: {hotel.rooms?.length}
          </p>
        </div>

      </div>
    </Link>
  );
}