import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from "../config/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton() {
  const { setUserAndToken } = useAuth();

  const handleSuccess = async (cred) => {
    try {
      const res = await api.post("/auth/google", {
        googleToken: cred.credential,
      });

      setUserAndToken(res.data.user, res.data.token);
    } catch (err) {
      console.error("Google auth failed:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="mt-3">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Google login failed")}
        />
      </div>
    </GoogleOAuthProvider>
  );
}