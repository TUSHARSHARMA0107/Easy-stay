import { useState } from "react";
 import axios from "axios"; 
 import { GoogleLogin } from "@react-oauth/google";
  import { useNavigate } from "react-router-dom";

export default function RegisterPage() { 
      const navigate = useNavigate(); 
      const [name, setName] = useState("");
       const [email, setEmail] = useState("");
        const [phone, setPhone] = useState("");
         const [password, setPassword] = useState("");
          const [message, setMessage] = useState("");
           const [loading, setLoading] = useState(false);

const handleRegister = async (e) => { e.preventDefault(); setMessage(""); setLoading(true);

try {
  const res = await axios.post("http://localhost:5000/api/auth/register", {
    name,
    email,
    phone,
    password,
  });

  localStorage.setItem("token", res.data.token);
  navigate("/home");
} catch (err) {
  setMessage(err.response?.data?.message || "Registration failed");
} finally {
  setLoading(false);
}

};

const handleGoogle = async (credentialResponse) => { try { const res = await axios.post("http://localhost:5000/api/auth/google", { token: credentialResponse.credential, });

localStorage.setItem("token", res.data.token);
  navigate("/home");
} catch  {
  setMessage("Google Login Failed");
}

};

return ( <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"> <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl"> <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

{message && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {message}
      </div>
    )}

    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          className="w-full p-3 border rounded-lg mt-1"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg mt-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-2 hover:bg-blue-700 transition"
      >
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>

    <div className="mt-6 flex items-center gap-3">
      <div className="flex-grow h-px bg-gray-300" />
      <span className="text-gray-500 text-sm">OR</span>
      <div className="flex-grow h-px bg-gray-300" />
    </div>

    <div className="mt-4 flex justify-center">
      <GoogleLogin onSuccess={handleGoogle} onError={() => setMessage("Google Login Failed")} />
    </div>
  </div>
</div>

); }

