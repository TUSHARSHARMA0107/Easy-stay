import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdvancedSearchBar from "../components/AdvancedSearchBar.jsx";
import Categories from "../components/Categories.jsx";
import TrendingPlaces from "../components/TrendingPlaces.jsx";
import FloatingSearchButton from "../components/FloatingSearchButton.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const [ setSelectedCategory] = useState(null);

  const handleSearch = (q) => {
    if (!q?.trim()) return;
    navigate(`/search?query=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hero */}
      <section className="mt-4 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-4 hidden sm:block opacity-80">
          <img
            src="/assets/travel-hero.png"
            alt="Travel illustration"
            className="w-40 h-40 object-contain"
          />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-100 mb-1">
            Welcome to EasyStay
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Book your next stay with<br />smart price comparison.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100">
            Hotels, hostels, restaurants & Airbnb — all in one place, with real-time price comparison.
          </p>
        </div>

        <div className="relative z-10 mt-4 max-w-xl">
          <AdvancedSearchBar
            onSearch={handleSearch}
            onFilter={() => navigate("/search")}
          />
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          What are you looking for?
        </h2>
        <Categories
          onSelect={(cat) => {
            setSelectedCategory(cat);
            navigate(`/search?type=${encodeURIComponent(cat.type || "")}`);
          }}
        />
      </section>

      {/* Trending */}
      <section>
        <TrendingPlaces />
      </section>

      {/* Floating bottom search button */}
      <FloatingSearchButton />
    </div>
  );
}