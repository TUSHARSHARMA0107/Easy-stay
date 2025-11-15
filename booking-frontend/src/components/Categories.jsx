import { useNavigate } from "react-router-dom";

export default function Categories() {
  const nav = useNavigate();

  const categories = [
    { label: "Hotels", type: "lodging", color: "bg-blue-100 text-blue-700" },
    { label: "Hostels", type: "hostel", color: "bg-purple-100 text-purple-700" },
    { label: "Restaurants", type: "restaurant", color: "bg-red-100 text-red-700" },
    { label: "Cafes", type: "cafe", color: "bg-yellow-100 text-yellow-700" },
    { label: "Attractions", type: "tourist_attraction", color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {categories.map((c, index) => (
        <button
          key={index}
          onClick={() => nav(`/explore?type=${c.type}`)}
          className={`p-4 rounded-xl text-center font-medium shadow ${c.color}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}