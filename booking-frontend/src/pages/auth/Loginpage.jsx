import { useState } from "react";
import api from "../../config/api";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", form);
      alert("Login Successful!");
      navigate("/profile");
    } catch (err) {
      alert(err?.response?.data?.message || "Login Error");
    }
  };

  const handleGoogle = async (cred) => {
    try {
      await api.post("/auth/google", { token: cred.credential });
      navigate("/profile");
    } catch {
      alert("Google Login Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 via-green-200 to-green-400 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg animate-fadeIn">
        <h1 className="text-3xl font-semibold text-green-700 text-center mb-4">
          Welcome Back
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            name="email"
            onChange={change}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            name="password"
            type="password"
            onChange={change}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogle} onError={() => alert("Error")} />
        </div>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup
          " className="text-green-700 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}