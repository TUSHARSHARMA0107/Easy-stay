import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="pt-24 px-6 md:px-10">{children}</div>
    </div>
  );
}