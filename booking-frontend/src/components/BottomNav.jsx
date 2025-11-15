import { Home, Search, Heart, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const navItems = [
    { label: "Home", icon: <Home />, to: "/" },
    { label: "Explore", icon: <Search />, to: "/explore" },
    { label: "Saved", icon: <Heart />, to: "/saved" },
    { label: "Profile", icon: <User />, to: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#0D1117] border-t dark:border-gray-800 py-2 px-6 flex justify-between z-50">
      {navItems.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive
                ? "text-blue-600"
                : "text-gray-500 dark:text-gray-300"
            }`
          }
        >
          <div className="w-6 h-6">{item.icon}</div>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}