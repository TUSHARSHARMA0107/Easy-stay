import { useState } from "react";
import api from "../config/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Logged in");
      navigate("/");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={submit} className="glass p-8 rounded-3xl w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome Back</h2>
        <input className="input mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="input mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full">Login</button>
        <p className="text-center my-4 text-gray-500">or</p>
        <GoogleButton />
        <p className="text-sm mt-4 text-center">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </form>
    </div>
  );
}