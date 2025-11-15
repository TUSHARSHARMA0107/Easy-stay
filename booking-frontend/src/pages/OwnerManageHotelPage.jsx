// src/pages/OwnerManageHotelPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/axios.js";
import AlertModal from "../model/AlertModal.jsx";

export default function OwnerManageHotelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadHotel = async () => {
    try {
      const res = await api.get(`/api/owner/hotels/${id}`);
      const h = res.data.hotel || res.data;
      setForm({
        name: h.name || "",
        location: h.location || "",
        description: h.description || "",
        price: h.price || "",
      });
    } catch (err) {
      console.error("Load hotel error:", err);
      alert("Failed to load hotel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotel();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/owner/hotels/${id}`, {
        ...form,
        price: Number(form.price) || 0,
      });
      alert("Hotel updated");
      navigate("/owner/dashboard");
    } catch (err) {
      console.error("Update hotel error:", err);
      alert("Failed to update hotel");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/owner/hotels/${id}`);
      alert("Hotel deleted");
      navigate("/owner/dashboard");
    } catch (err) {
      console.error("Delete hotel error:", err);
      alert("Failed to delete hotel");
    }
  };

  if (loading) {
    return (
      <div className="pb-24 text-center py-10 text-gray-500 dark:text-gray-400">
        Loading hotel...
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Manage Hotel
      </h1>

      <form onSubmit={handleSave} className="space-y-4 bg-white dark:bg-[#0D1117] rounded-2xl shadow p-5">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Hotel Name</label>
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
          <label className="text-sm text-gray-600 dark:text-gray-300">Location</label>
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
          <label className="text-sm text-gray-600 dark:text-gray-300">Description</label>
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

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 rounded-xl border border-red-500 text-red-500 text-sm hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete Hotel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>

      <AlertModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        message="Are you sure you want to delete this hotel? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}