// src/pages/UserProfilePage.jsx
import { useEffect, useState } from "react";
import api from "../config/axios.js";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="pb-24 text-center text-gray-500 dark:text-gray-400 py-10">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pb-24 text-center text-gray-500 dark:text-gray-400 py-10">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-5">
      <div className="flex items-center gap-4">
        <img
          src={user.photo || "/images/default-avatar.png"}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {user.email}
          </p>
          <p className="text-xs mt-1 text-blue-600 dark:text-blue-400 uppercase">
            {user.role}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1117] shadow border dark:border-gray-800">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Account
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1117] shadow border dark:border-gray-800">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Preferences
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Dark mode, notifications and more can be added here later.
          </p>
        </div>
      </div>
    </div>
  );
}