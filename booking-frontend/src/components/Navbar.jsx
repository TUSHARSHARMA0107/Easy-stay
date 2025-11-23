import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../config/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState("light");
  const [drop, setDrop] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");

  // Hide Navbar on login/signup
  if (["/", "/login"].includes(location.pathname)) return null;

  // LOAD PROFILE
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data.user);
      } catch {}
    })();
  }, []);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // THEME SWITCH
  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  return (
    <>
      {/* ======================= NAVBAR ========================= */}
      <nav
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl z-50
          px-6 py-3 rounded-3xl shadow-2xl backdrop-blur-xl border
          flex items-center justify-between gap-4
          ${
            theme === "dark"
              ? "bg-gray-900/80 border-gray-700 text-white"
              : "bg-white/80 border-gray-200 text-gray-800"
          }
        `}
      >
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src="/assets/app logo.png" className="w-10 h-10 rounded-xl" />
         <h1 class="text-4xl font-extrabold bg-gradient-to-r 
    from-blue-500 via-green-400 to-blue-500 
    bg-clip-text text-transparent animate-gradient-x">
  EasyStay
</h1>
        </div>

        {/* CENTER MENU + SEARCH (Desktop Only) */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/home" className="hover:text-green-500 font-semibold">
            Home
          </Link>

          <Link to="/explore" className="hover:text-green-500 font-semibold">
            Explore
          </Link>

          <Link to="/hotels" className="hover:text-green-500 font-semibold">
            Hotels
          </Link>

          {/* SEARCH BOX */}
          <div
            className={`
            flex items-center px-3 py-1 rounded-xl shadow-inner
            ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-gray-100 border border-gray-300"
            }
          `}
          >
            <i className="ri-search-line mr-2 opacity-60"></i>
            <input
              type="text"
              placeholder="Search hotels..."
              className={`
                bg-transparent outline-none w-48 text-sm
                ${theme === "dark" ? "text-white" : "text-gray-900"}
              `}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/search?q=${search}`)}
            />
          </div>

          {/* USER ITEMS */}
          {profile?.role === "user" && (
            <Link to="/my-bookings" className="hover:text-green-500 font-semibold">
              My Bookings
            </Link>
          )}

          {/* OWNER ITEMS */}
          {profile?.role === "owner" && (
            <>
              <Link to="/owner/dashboard" className="hover:text-green-500 font-semibold">
                Dashboard
              </Link>

              <Link to="/owner/properties" className="hover:text-green-500 font-semibold">
                Properties
              </Link>

              <Link to="/owner/bookings" className="hover:text-green-500 font-semibold">
                Booking Management
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* THEME SWITCH */}
          <button
            onClick={toggleTheme}
            className="
              px-3 py-1 rounded-xl border text-sm
              hover:scale-105 transition
            "
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>

          {/* AVATAR */}
          <div className="relative">
            <img
              src={
                profile?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-green-500"
              onClick={() => setDrop(!drop)}
            />

            {/* DROPDOWN */}
            {drop && (
              <div
                className={`
                absolute right-0 mt-3 w-64 rounded-2xl p-4 border shadow-xl
                animate-slideDown
                ${
                  theme === "dark"
                    ? "bg-gray-800/95 border-gray-700 text-white"
                    : "bg-white/95 border-gray-300 text-gray-800"
                }
              `}
              >
                <p className="font-semibold">{profile?.name}</p>
                <p className="text-xs opacity-60">{profile?.email}</p>
                <hr className="my-2 opacity-40" />

                <Link
                  to="/profile"
                  className="block py-2 hover:text-green-500"
                  onClick={() => setDrop(false)}
                >
                  Profile
                </Link>

                {profile?.role === "user" && (
                  <Link
                    to="/my-bookings"
                    className="block py-2 hover:text-green-500"
                    onClick={() => setDrop(false)}
                  >
                    My Bookings
                  </Link>
                )}

                {profile?.role === "owner" && (
                  <>
                    <Link
                      to="/owner/dashboard"
                      className="block py-2 hover:text-green-500"
                      onClick={() => setDrop(false)}
                    >
                      Owner Dashboard
                    </Link>
                    <Link
                      to="/owner/properties"
                      className="block py-2 hover:text-green-500"
                      onClick={() => setDrop(false)}
                    >
                      Properties
                    </Link>
                    <Link
                      to="/owner/bookings"
                      className="block py-2 hover:text-green-500"
                      onClick={() => setDrop(false)}
                    >
                      Booking Management
                    </Link>
                  </>
                )}

                <button
                  onClick={logout}
                  className="w-full mt-3 py-2 text-left text-red-500 font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <i
            className="ri-menu-3-line text-3xl md:hidden cursor-pointer"
            onClick={() => setMobile(true)}
          ></i>
        </div>
      </nav>

      {/* ======================= MOBILE MENU ======================= */}
      {mobile && (
        <div
          className={`
            fixed top-0 right-0 h-full w-72 p-6 z-[999]
            animate-slideRight border-l
            ${
              theme === "dark"
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-300"
            }
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <i
              className="ri-close-line text-3xl cursor-pointer"
              onClick={() => setMobile(false)}
            ></i>
          </div>

          {/* SEARCH BOX MOBILE */}
          <div
            className={`
            flex items-center px-3 py-2 mb-4 rounded-xl border
            ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-300"
            }
          `}
          >
            <i className="ri-search-line mr-2"></i>
            <input
              className="bg-transparent outline-none flex-1"
              placeholder="Search hotels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?q=${search}`);
                  setMobile(false);
                }
              }}
            />
          </div>

          {/* MENU ITEMS */}
          <Link to="/home" className="block py-3" onClick={() => setMobile(false)}>
            Home
          </Link>
          <Link to="/explore" className="block py-3" onClick={() => setMobile(false)}>
            Explore
          </Link>
          <Link to="/hotels" className="block py-3" onClick={() => setMobile(false)}>
            Hotels
          </Link>

          {/* USER */}
          {profile?.role === "user" && (
            <Link
              to="/my-bookings"
              className="block py-3"
              onClick={() => setMobile(false)}
            >
              My Bookings
            </Link>
          )}

          {/* OWNER */}
          {profile?.role === "owner" && (
            <>
              <Link
                to="/owner/dashboard"
                className="block py-3"
                onClick={() => setMobile(false)}
              >
                Owner Dashboard
              </Link>

              <Link
                to="/owner/properties"
                className="block py-3"
                onClick={() => setMobile(false)}
              >
                Properties
              </Link>

              <Link
                to="/owner/bookings"
                className="block py-3"
                onClick={() => setMobile(false)}
              >
                Booking Management
              </Link>
            </>
          )}

          <button
            onClick={logout}
            className="text-red-500 font-semibold mt-6"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}