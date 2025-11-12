import { NavLink } from "react-router-dom";
import { Home, Search, Heart, User, Moon, Sun } from "lucide-react";
import { useTheme } from "../state/theme";

export default function BottomNav() {
  const { dark, setDark } = useTheme();
  const item = (to, Icon, label, exact=false) => (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 ${isActive ? "text-blue-600" : "text-gray-500"}`
      }
    >
      <Icon size={22} />
      <span className="text-xs">{label}</span>
    </NavLink>
  );

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 rounded-t-2xl shadow z-50">
      <nav className="grid grid-cols-5 py-2">
        {item("/", Home, "Home", true)}
        {item("/", Search, "Search")}
        {item("/saved", Heart, "Saved")}
        {item("/profile", User, "Profile")}
        <button onClick={() => setDark(!dark)} className="flex flex-col items-center gap-1 text-gray-500">
          {dark ? <Sun size={22}/> : <Moon size={22}/>}
          <span className="text-xs">{dark ? "Light" : "Dark"}</span>
        </button>
      </nav>
    </div>
  );
}