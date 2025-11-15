import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      setUserAndToken(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.log("Login failed:", err.response?.data);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto pt-8 pb-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl border dark:bg-gray-800"
          onChange={onChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl border dark:bg-gray-800"
          onChange={onChange}
        />

        <button
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl hover:opacity-90"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-4 text-center text-gray-400">or continue with</div>

      {/* GOOGLE LOGIN */}
      <GoogleLoginButton />

      <p className="mt-6 text-center text-sm">
        Don't have an account?{" "}
        <Link className="text-primary font-semibold" to="/register">
          Sign up
        </Link>
      </p>
    </div>
  );
}