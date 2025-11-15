import { Wifi, Car, Utensils, Dumbbell, Snowflake, Coffee } from "lucide-react";

const icons = {
  wifi: <Wifi />,
  parking: <Car />,
  food: <Utensils />,
  gym: <Dumbbell />,
  ac: <Snowflake />,
  cafe: <Coffee />,
};

export default function AmenitiesGrid({ list = [] }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {list.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-800 dark:text-white"
        >
          <div className="w-6 h-6">{icons[item]}</div>
          <p className="text-sm mt-2 capitalize">{item}</p>
        </div>
      ))}
    </div>
  );
}