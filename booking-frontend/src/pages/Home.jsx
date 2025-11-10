import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Categories from "../components/auth/home/Categories";
import Trending from "../components/auth/home/Trending";

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage:` url('/images/hero.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-32">
        <motion.img src="/images/logo.png" className="h-20 w-auto drop-shadow-xl" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} />
        <motion.h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg mt-6" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}>
          Find Your Perfect Stay
        </motion.h1>
        <motion.p className="text-white/90 text-lg mt-4" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}>
          Hotels • Hostels • Airbnb • Guest Houses • Restaurants
        </motion.p>

        <motion.div className="mt-10 backdrop-blur-xl bg-white/25 border border-white/40 rounded-2xl p-5 w-full max-w-3xl shadow-2xl"
          initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input className="flex-1 bg-white/60 backdrop-blur p-3 rounded-xl focus:outline-none text-gray-900"
              placeholder="Where to stay?" value={location} onChange={e=>setLocation(e.target.value)} />
            <button onClick={() => navigate(`/search?location=${encodeURIComponent(location)}`)}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B6B] via-[#FF9154] to-[#2979FF] text-white rounded-xl shadow-lg hover:brightness-110 transition">
              Search
            </button>
          </div>
        </motion.div>
      </div>

      <Categories />
      <Trending />
    </div>
  );
}