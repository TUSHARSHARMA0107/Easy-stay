import { useEffect, useState } from "react";
import api from "../config/axios";
import HeroSection from "../components/HeroSection";
import useScrollReveal from "../hooks/UseScrollReveal";

export default function HomePage() {
  useScrollReveal();

  const [manali, setManali] = useState([]);
  const [shimla, setShimla] = useState([]);

  const fetchPlaces = async (city, setter) => {
    try {
      const res = await api.get(`/places/search/${city}`);
      setter(res.data?.results || []);
    } catch (error) {
      console.log("❌ Error loading:", city, error);
    }
  };

  useEffect(() => {
    fetchPlaces("manali", setManali);
    fetchPlaces("shimla", setShimla);
  }, []);

  return (
    <div className="p-4 space-y-16">

      {/* HERO MANALI */}
      <HeroSection
        title="Explore Beautiful Manali"
        subtitle="Snowy peaks, riverside cafes, peaceful stays — curated just for you."
        image="/images/manali-hero.jpg"
        onClick={() =>
          document.getElementById("about-section").scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* ABOUT */}
      <section id="about-section" className="reveal space-y-4">
        <h2 className="text-2xl font-bold">Why EasyStay?</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          EasyStay helps you discover the best places to stay across India's most
          beautiful hill stations, curated with real ratings, verified hosts and
          seamless booking.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {[
            { icon: "🏔", label: "Mountain Stays" },
            { icon: "💸", label: "Best Prices" },
            { icon: "🔒", label: "Secure Booking" },
            { icon: "⭐", label: "Trusted Reviews" },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#161B22] shadow card rounded-xl p-4 text-center reveal">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-medium mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MANALI HOTELS */}
      <section id="manali-section" className="reveal">
        <h2 className="text-2xl font-bold mb-4">Top Stays in Manali</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {manali.map((h, i) => (
            <div key={i} className="bg-white dark:bg-[#161B22] rounded-3xl shadow-md overflow-hidden card-hover reveal">
              <img
                src={h.photo || "/images/placeholder.jpg"}
                className="w-full h-48 object-cover"
                alt=""
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{h.name}</h3>
                <p className="text-sm text-gray-500">{h.address}</p>
                <p className="text-yellow-600 mt-1 font-medium">⭐ {h.rating || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HERO SHIMLA */}
      <HeroSection
        title="Chill in Shimla"
        subtitle="Mist-filled mornings, mall-road walks and cozy hillside rooms."
        image="/images/shimla-hero.jpg"
        onClick={() =>
          document.getElementById("shimla-section").scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* SHIMLA HOTELS */}
      <section id="shimla-section" className="reveal">
        <h2 className="text-2xl font-bold mb-4">Best Hotels in Shimla</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {shimla.map((h, i) => (
            <div key={i} className="bg-white dark:bg-[#161B22] rounded-3xl shadow-md overflow-hidden card-hover reveal">
              <img
                src={h.photo || "/images/placeholder.jpg"}
                className="w-full h-48 object-cover"
                alt=""
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{h.name}</h3>
                <p className="text-sm text-gray-500">{h.address}</p>
                <p className="text-yellow-600 mt-1 font-medium">⭐ {h.rating || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}