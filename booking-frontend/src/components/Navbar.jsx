import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../config/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white/70 backdrop-blur border-b sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-blue-700 flex items-center gap-2">
          <img src="/images/logo.png" className="h-7" alt="logo" />
          EasyStay
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-700 transition">Home</Link>
          <Link to="/search" className="hover:text-blue-700 transition">Search</Link>

          {user?.role === "OWNER" && (
            <Link to="/owner/dashboard" className="hover:text-blue-700 transition">
              Owner
            </Link>
          )}

          {user && (
            <Link to="/my-bookings" className="hover:text-blue-700 transition">
              My Bookings
            </Link>
          )}

          {!user ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF6B6B] via-[#FF9154] to-[#2979FF] text-white hover:brightness-110 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative flex items-center gap-3">
              <img
                src={user.photo || "/images/default-avatar.png"}
                alt="profile"
                onClick={() => setOpen(!open)}
                className="w-8 h-8 rounded-full object-cover cursor-pointer border-2 border-gray-300"
              />

              {open && (
                <div className="absolute right-0 mt-2 top-full bg-white shadow-lg rounded-lg py-2 w-48 border border-gray-200">
                  <p className="px-4 py-2 text-gray-800 font-medium text-sm">{user.name}</p>
                  <hr className="border-gray-200" />

                  {user.role === "OWNER" && (
                    <Link
                      to="/owner/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      Owner Dashboard
                    </Link>
                  )}

                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    My Bookings
                  </Link>

                  <hr className="border-gray-200 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}