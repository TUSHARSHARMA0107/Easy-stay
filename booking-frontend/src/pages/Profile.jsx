import { useAuth } from "../context/AuthContext.jsx";
import api from "../config/axios";
import { useState } from "react";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);

  const uploadPhoto = async () => {
    const form = new FormData();
    form.append("photo", file);

    const res = await api.post("/user/photo", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setUser(res.data.user);
  };

  if (!user) return <p className="text-center mt-20">Login required</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      <img
        src={user.photo || "/images/default-avatar.png"}
        className="w-32 h-32 rounded-full border shadow mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadPhoto}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Upload New Photo
      </button>
    </div>
  );
}