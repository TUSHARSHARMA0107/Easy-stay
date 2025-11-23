import { useEffect, useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState("profile");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
  });

  // ---------------------- LOAD PROFILE -----------------------
  const loadProfile = async () => {
    try {
      const res = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const u = res.data.user;

      setForm({
        name: u.name || "",
        phone: u.phone || "",
        email: u.email || "",
        avatar: u.avatar || "",
      });

      setLoading(false);
    } catch (err) {
      console.log("Profile load error:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    loadProfile();
  }, []);

  // ---------------------- AVATAR UPLOAD -----------------------
  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      setUploading(true);

      const res = await api.post("/profile/upload-avatar", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // FIXED
        },
      });

      setForm({ ...form, avatar: res.data.avatar });
      setUploading(false);
    } catch {
      alert("Avatar upload failed");
      setUploading(false);
    }
  };

  // ---------------------- SAVE PROFILE -----------------------
  const saveProfile = async () => {
    try {
      await api.post(
        "/profile/update",
        {
          name: form.name,
          phone: form.phone,
        },
        {
          headers: { Authorization:` Bearer ${token}` }, // FIXED
        }
      );

      setStep("role");
    } catch {
      alert("Profile update failed");
    }
  };

  // ---------------------- CHOOSE ROLE -----------------------
  const chooseRole = async (role) => {
    try {
      await api.post(
        "/profile/set-role",
        { role },
        { headers: { Authorization: `Bearer ${token}` } } // FIXED
      );

      localStorage.setItem("role", role);

      if (role === "owner") navigate("/home");
      else navigate("/home");
    } catch {
      alert("Error selecting role");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl tracking-wide font-semibold text-blue-700">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

      <div className="relative w-full max-w-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-10 text-white">

        <h1 className="text-4xl font-bold text-center">Complete Your Profile</h1>
        <p className="text-center text-white/70 mb-6">Finish your setup</p>

        {/* STEP 1 */}
        {step === "profile" && (
          <div>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={
                    form.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />

                <label
                  htmlFor="avatarUpload"
                  className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg"
                >
                  <i className="ri-camera-fill text-lg text-white"></i>
                </label>

                <input
                  id="avatarUpload"
                  type="file"
                  className="hidden"
                  onChange={handleAvatar}
                />
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/30 text-white"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/30 text-white"
              />

              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full p-3 rounded-xl bg-white/20 text-gray-300 cursor-not-allowed"
              />

              <button
                onClick={saveProfile}
                className="w-full bg-blue-600 py-3 rounded-xl font-bold"
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === "role" && (
          <div className="text-center space-y-6 mt-6">

            <h2 className="text-xl font-semibold">Choose Your Role</h2>

            <div
              onClick={() => chooseRole("user")}
              className="p-6 bg-white/20 cursor-pointer rounded-xl border hover:scale-105 transition"
            >
              I am a User
            </div>

            <div
              onClick={() => chooseRole("owner")}
              className="p-6 bg-white/20 cursor-pointer rounded-xl border hover:scale-105 transition"
            >
              I am a Business Owner
            </div>

          </div>
        )}
      </div>
    </div>
  );
}