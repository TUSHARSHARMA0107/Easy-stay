import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Signup from "./pages/auth/Signuppage";
import Login from "./pages/auth/Loginpage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}