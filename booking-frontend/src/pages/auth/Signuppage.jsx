import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../config/api.js";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⭐ SIGNUP SUBMIT FIXED
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);

      // ⭐ Token store
      localStorage.setItem("token", res.data.token);

      // ⭐ user store
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ⭐ role store (default user)
      localStorage.setItem("role", res.data.user.role);

      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Signup Failed");
    }
  };

  // ⭐ GOOGLE LOGIN FIXED
  const handleGoogle = async (cred) => {
    try {
      const token = cred.credential;

      const res = await api.post("/auth/google", { token });

      // Save all user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      navigate("/profile");
    } catch {
      alert("Google Auth Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">

      <div className="hidden lg:flex flex-col text-left mr-10 animate-fadeIn">
        <h1 className="text-5xl font-extrabold text-blue-600 drop-shadow-md">
          Welcome to EasyStay
        </h1>
        <p className="text-lg mt-3 text-gray-700">Experience comfort everyday.</p>
      </div>

      {/* SIGNUP CARD */}
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md animate-popIn">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <input name="name" type="text" placeholder="Full Name"
            onChange={change} className="w-full border rounded-lg px-4 py-2" />

          <input name="email" type="email" placeholder="Email"
            onChange={change} className="w-full border rounded-lg px-4 py-2" />

          <input name="phone" type="text" placeholder="Phone"
            onChange={change} className="w-full border rounded-lg px-4 py-2" />

          <input name="password" type="password" placeholder="Password"
            onChange={change} className="w-full border rounded-lg px-4 py-2" />

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
            Sign Up
          </button>

        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <GoogleLogin onSuccess={handleGoogle} />

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}