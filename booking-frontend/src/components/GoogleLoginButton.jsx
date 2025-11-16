import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../config/axios";
import googleLogo from "../../public/assets/google-logo.png"; // we’ll add this next

export default function GoogleButton() {

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Welcome ${res.data.user.name}`);
      window.location.href = "/";
    } catch {
      toast.error("Google login failed, try again.");
    }
  };

  return (
    <div className="relative">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error("Google Sign-in was cancelled")}
        ux_mode="popup"
        useOneTap
      />
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:brightness-110 transition shadow-md"
        onClick={() => document.querySelector("div[role=button]").click()}
      >
        <img src={googleLogo} className="w-5 h-5" />
        Continue with Google
      </button>
    </div>
  );
}