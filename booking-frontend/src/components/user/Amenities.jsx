// components/user/Amenities.jsx
export default function Amenities({ list }) {
  const icons = {
    wifi: "ri-wifi-line",
    ac: "ri-snowflake-line",
    tv: "ri-tv-line",
    parking: "ri-parking-box-line",
    kitchen: "ri-restaurant-line",
    pool: "ri-swimming-line",
    breakfast: "ri-cup-fill",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow mt-6">
      <h2 className="text-xl font-semibold mb-3">Amenities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {list.map((a) => (
                        <div key={a} className="flex items-center gap-2">
                              <i className={`${icons[a]} text-xl text-gray-700`}></i>
                              <p className="text-gray-800 capitalize">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}