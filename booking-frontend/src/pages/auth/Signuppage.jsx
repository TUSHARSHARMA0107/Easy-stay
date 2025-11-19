import { useState } from "react";
import api from "../../config/api";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      alert("Account Created Successfully!");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  const handleGoogle = async (cred) => {
    try {
      const res = await api.post("/auth/google", { token: cred.credential });
      alert("Google Signup Successful!");
      navigate("/profile");
    } catch  {
      alert("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg animate-fadeIn">
        <h1 className="text-3xl font-semibold text-blue-700 text-center mb-4">
          Create Account
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            name="name"
            onChange={change}
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            onChange={change}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="phone"
            onChange={change}
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            onChange={change}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogle} onError={() => alert("Error")} />
        </div>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}