// src/pages/OwnerRegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/axios.js";

export default function OwnerRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "OWNER",
        // optional: send business name if your backend supports it
      });
      alert("Owner registered! Please verify your email.");
      navigate("/login");
    } catch (err) {
      console.error("Owner register error:", err);
      alert("Owner registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-[#0D1117] rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Register as Owner
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          List your hotel, hostel or property on EasyStay.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Your Name
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
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              className="mt-1 w-full p-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2.5 rounded-xl border dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
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
            {loading ? "Creating owner account..." : "Register as Owner"}
          </button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Already an owner?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}