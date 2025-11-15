// src/pages/OwnerAddHotelPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios.js";

export default function OwnerAddHotelPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/owner/hotels", {
        ...form,
        price: Number(form.price) || 0,
      });
      alert("Hotel added");
      navigate("/owner/dashboard");
    } catch (err) {
      console.error("Add hotel error:", err);
      alert("Failed to add hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add a New Hotel
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-[#0D1117] rounded-2xl shadow p-5">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Hotel Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full p-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Base Price (per night)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Hotel"}
        </button>
      </form>
    </div>
  );
}