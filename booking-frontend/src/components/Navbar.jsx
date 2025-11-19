import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold text-blue-600">
          EasyStay
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/rooms" className="text-gray-700 hover:text-blue-600">
            Rooms
          </Link>

          <Link to="/bookings" className="text-gray-700 hover:text-blue-600">
            My Bookings
          </Link>

          <Link to="/profile">
            <img
              src="https://i.pravatar.cc/40?img=5"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}