import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function FloatingSearchButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/search")}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 
                 bg-gradient-to-r from-blue-600 to-blue-500
                 text-white shadow-xl px-6 py-3 rounded-full
                 flex items-center gap-2 z-40 hover:scale-105 
                 transition-all"
    >
      <FiSearch size={20} />
      Search
    </button>
  );
}