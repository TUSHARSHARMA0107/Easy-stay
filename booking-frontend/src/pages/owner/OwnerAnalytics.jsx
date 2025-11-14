import { useEffect, useState } from "react";
import api from "../../config/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function OwnerAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/owner").then(res => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p className="text-center py-20">Loading Analytics...</p>;

  const months = data.bookingsPerMonth.map(b => b.month.substring(0, 10));
  const counts = data.bookingsPerMonth.map(b => b.count);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Business Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Bookings" value={data.totalBookings} />
        <StatCard title="Total Revenue" value="{₹${data.totalRevenue}} "/>
        <StatCard title="Active Months" value={data.bookingsPerMonth.length} />
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h2 className="text-lg mb-4">Bookings Over Time</h2>
        <Line
          data={{
            labels: months,
            datasets: [
              {
                label: "Bookings",
                data: counts,
                borderColor: "#FF6B6B",
                borderWidth: 3,
                tension: 0.3
              }
            ],
          }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center">
      <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}