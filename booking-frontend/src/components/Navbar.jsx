import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import api from "../config/axios.js";
import { Moon, Sun, Menu } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [openMenu, setOpenMenu] = useState(false);
  const [mobile, setMobile] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b dark:border-gray-700 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="font-semibold text-xl text-blue-700 dark:text-blue-300 flex items-center gap-2"
        >
          <img src="../assets/app logo.png" className="h-8" alt="EasyStay" />
          EasyStay
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">

          <Link to="../pages/HomePage.jsx" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
          <Link to="../pages/SearchPage.jsx" className="hover:text-blue-600 dark:hover:text-blue-400">Search</Link>
          <Link to="../pages/BookingPage.jsx" className="hover:text-blue-600 dark:hover:text-blue-400">Explore</Link>

          {user?.role === "OWNER" && (
            <Link
              to="../pages/OwnerDashboard.jsx"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Owner
            </Link>
          )}

          {user && (
            <Link
              to="../pages/MyBooking.jsx"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              My Bookings
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* User Menu */}
          {!user ? (
            <div className="flex gap-3">
              <Link
                to="../pages/LoginPage.jsx"
                className="px-4 py-1.5 rounded-lg border border-blue-600 dark:border-blue-400
                text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              >
                Login
              </Link>

              <Link
                to="../pages/RegisterPage.jsx"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r
                from-[#FF6B6B] via-[#FF9154] to-[#2979FF]
                text-white shadow hover:brightness-110 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative">
              <img
                src={user.photo || "/images/default-avatar.png"}
                alt="profile"
                onClick={() => setOpenMenu(!openMenu)}
                className="w-9 h-9 rounded-full object-cover cursor-pointer border-2 border-gray-300 dark:border-gray-600"
              />

              {openMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-2 border dark:border-gray-700 animate-fade-in">
                  <p className="px-4 py-2 text-gray-900 dark:text-gray-100 text-sm font-medium">
                    {user.name}
                  </p>
                  <hr className="border-gray-200 dark:border-gray-700" />

                  {user.role === "OWNER" && (
                    <Link
                      to="../pages/OwnerDashboard.jsx"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Owner Dashboard
                    </Link>
                  )}

                  <Link
                    to="../pages/OwnerManageHotelPage.jsx"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Bookings
                  </Link>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobile(!mobile)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobile && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-4 flex flex-col gap-4 text-base">
          <Link to="../pages/HomePage.jsx" onClick={() => setMobile(false)}>Home</Link>
          <Link to="../pages/SearchPage.jsx" onClick={() => setMobile(false)}>Search</Link>
          <Link to="../pages/SearchPage.jsx" onClick={() => setMobile(false)}>Explore</Link>

          {user?.role === "OWNER" && (
            <Link to="../pages/OwnerDashboard.jsx" onClick={() => setMobile(false)}>Owner</Link>
          )}

          {user && (
            <Link to="../pages/OwnerManageHotelPage.jsx" onClick={() => setMobile(false)}>My Bookings</Link>
          )}

          {!user ? (
            <>
              <Link
                to="../pages/LoginPage.jsx"
                className="px-4 py-2 rounded border border-blue-600 dark:border-blue-400"
                onClick={() => setMobile(false)}
              >
                Login
              </Link>
              <Link
                to="../pages/RegisterPage.jsx"
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => setMobile(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMobile(false);
              }}
              className="text-left px-4 py-2 text-red-500"
            >
              Logout
            </button>
          )}

          {/* Dark Mode Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className="mt-2 flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </header>
  );
}