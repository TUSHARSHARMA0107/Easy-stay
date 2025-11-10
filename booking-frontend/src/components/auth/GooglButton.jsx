import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../../config/axios";

export default function GoogleButton() {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome ${user.name}`);
      window.location.href = "/";
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="relative">
      <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-in cancelled")} useOneTap />
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:brightness-110 transition shadow-md"
        onClick={() => {
          const realBtn = document.querySelector("div[role=button]");
          realBtn?.click();
        }}
      >
        <img src="../../assets/google-logo.png" alt="google" className="w-5 h-5" />
        Continue with Google
      </button>
    </div>
  );
}