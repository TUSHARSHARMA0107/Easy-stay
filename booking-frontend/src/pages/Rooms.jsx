import { useEffect, useState } from "react";
import { api } from "../config/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await api.get("/rooms");
    setRooms(res.data.rooms);
  };

  return (
    <>
      <Navbar />

      <div className="pt-20 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <Link
            key={room.id}
            to={`/room/${room.id}`}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={room.images[0]}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-bold">{room.title}</h2>
              <p className="text-gray-600 mt-2">{room.location}</p>
              <p className="mt-2 font-semibold text-blue-600">
                ₹{room.price}/night
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}