import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          EasyStay
        </motion.h1>
      </header>

      <main className="app-main">
        {children}
      </main>

      <nav className="bottom-nav">
        <NavLink to="/home" className="nav-item">
          <span>🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/explore?query=Goa" className="nav-item">
          <span>🧭</span>
          <span>Explore</span>
        </NavLink>
        <NavLink to="/search" className="nav-item">
          <span>🔍</span>
          <span>Search</span>
        </NavLink>
      </nav>
    </div>
  );
}