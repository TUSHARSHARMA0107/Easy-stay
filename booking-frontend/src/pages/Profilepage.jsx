import { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch User Profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    api
      .get("/auth/me", {
        headers: { Authorization:` Bearer ${token} `},
      })
      .then((res) => setUser(res.data.user))
      .catch(() => navigate("/login"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/40">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Profile
        </h2>

        {/* AVATAR */}
        <div className="flex justify-center mb-6">
          <img
            src={user.avatar || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="w-28 h-28 rounded-full shadow-md border-4 border-white"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="text-sm font-semibold text-gray-500">Full Name</p>
            <p className="text-lg">{user.name}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">Phone</p>
            <p className="text-lg">{user.phone || "Not provided"}</p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="mt-8 w-full py-3 bg-red-500 text-white rounded-xl text-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}