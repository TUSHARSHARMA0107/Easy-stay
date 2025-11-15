import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      setUserAndToken(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.log("Register failed:", err.response?.data);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto pt-8 pb-20">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 rounded-xl border dark:bg-gray-800"
          onChange={onChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl border dark:bg-gray-800"
          onChange={onChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl border dark:bg-gray-800"
          onChange={onChange}
        />

        <button
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl hover:opacity-90"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <div className="my-4 text-center text-gray-400">or continue with</div>

      {/* GOOGLE LOGIN */}
      <GoogleLoginButton />

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link className="text-primary font-semibold" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}