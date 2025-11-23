import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../config/api.js";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⭐ NORMAL LOGIN FIXED
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      // ⭐ Role Based Navigation
      if (res.data.user.role === "owner") navigate("/owner/dashboard");
      else navigate("/home");

    } catch (err) {
      setMsg(err.response?.data?.message || "Login Failed");
    }
  };

  // ⭐ GOOGLE LOGIN FIXED
  const handleGoogle = async (cred) => {
    try {
      const token = cred.credential;
      const res = await api.post("/auth/google", { token });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "owner") navigate("/owner/dashboard");
      else navigate("/home");

    } catch {
      setMsg("Google Auth Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-4">

      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md animate-popIn">
        
        <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
          Login to EasyStay
        </h2>

        {msg && <div className="bg-red-100 text-red-700 p-2 rounded">{msg}</div>}

        <form onSubmit={submit} className="space-y-4">

          <input name="email" type="email" placeholder="Email"
            onChange={change} className="w-full border rounded-lg px-4 py-2" />

          <input name="password" type="password" placeholder="Password"
            onChange={change} className="w-full border rounded-lg px-4 py-2" />

          <button className="w-full bg-green-600 text-white py-2 rounded-lg">
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <GoogleLogin onSuccess={handleGoogle} />

        <p className="text-center mt-4 text-sm">
          New here?{" "}
          <Link to="/" className="text-green-600 font-semibold">Create Account</Link>
        </p>

      </div>
    </div>
  );
}