// components/user/RoomCard.jsx
import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow hover:shadow-md">
      <h3 className="text-xl font-semibold">{room.title}</h3>
      <p className="text-gray-600 text-sm">{room.description}</p>

      <p className="font-bold text-lg mt-2">₹{room.price} / night</p>

      <Link
        to={`/room/${room.id}`}
        className="block mt-3 bg-black text-white py-2 rounded-lg text-center"
      >
        Book Now
      </Link>
    </div>
  );
}