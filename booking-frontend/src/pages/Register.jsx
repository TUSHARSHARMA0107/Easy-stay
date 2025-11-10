import { useState } from "react";
import api from "../config/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";

export default function Register() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("USER");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Registered");
      navigate("/");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={submit} className="glass p-8 rounded-3xl w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
        <input className="input mb-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="input mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="input mb-3" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="USER">User</option>
          <option value="OWNER">Owner</option>
        </select>
        <button className="btn w-full">Register</button>
        <p className="text-center my-4 text-gray-500">or</p>
        <GoogleButton />
        <p className="text-sm mt-4 text-center">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}