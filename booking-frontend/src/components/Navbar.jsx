import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white/70 backdrop-blur border-b sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-blue-700 flex items-center gap-2">
          <img src="/images/logo.png" className="h-7" alt="logo" />
          StayWise
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <Link to="/search" className="hover:text-blue-700">Search</Link>
          {user?.role === "OWNER" && <Link to="/owner" className="hover:text-blue-700">Owner</Link>}
          {user && <Link to="/bookings" className="hover:text-blue-700">My Bookings</Link>}

          {!user ? (
            <Link to="/login" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Login</Link>
          ) : (
            <div className="flex items-center gap-3">
              <img src={user.profileImage || "/images/default-dp.png"} alt="dp" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm">{user.name}</span>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}