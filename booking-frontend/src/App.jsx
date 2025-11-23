// App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// AUTH
import Signup from "./pages/auth/Signuppage";
import Login from "./pages/auth/Loginpage";
import ProfilePage from "./pages/auth/ProfilePage";

// USER PAGES
import HomePage from "./pages/HomePage";
import AllHotels from "./pages/user/AllHotels";
import HotelDetails from "./pages/user/HotelDetails";
import RoomBooking from "./pages/user/RoomBooking";
import PaymentPage from "./pages/user/PaymentPage";
import MyBookings from "./pages/user/MyBookings";

// EXPLORE / SEARCH
import HotelDetailPage from "./pages/HotelDetailPage";
import SearchPage from "./pages/SearchPage";
import ExplorePage from "./pages/ExplorePage";

// OWNER
import OwnerDashboard from "./pages/owner/OwnerDashboard";

// LAYOUT + EFFECTS
import PageTransition from "./components/PageTransition";
import Navbar from "./components/Navbar"; 
import MainLayout from "./layouts/MainLayout";


// ===========================
//   WRAPPER (NAVBAR CONTROL)
// ===========================
function AppWrapper() {
  const location = useLocation();

  // Pages jaha navbar HIDE karna hai
  const hideNavbarRoutes = ["/", "/login"];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* SHOW NAVBAR only when needed */}
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ========== AUTH ROUTES ========== */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />

        {/* ========== USER ROUTES ========== */}
        <Route
          path="/home"
          element={<MainLayout><PageTransition><HomePage /></PageTransition></MainLayout>}
        />

        <Route
          path="/hotels"
          element={<MainLayout><PageTransition><AllHotels /></PageTransition></MainLayout>}
        />

        <Route
          path="/hotel/:id"
          element={<MainLayout><PageTransition><HotelDetails /></PageTransition></MainLayout>}
        />

        <Route
          path="/room/:id"
          element={<MainLayout><PageTransition><RoomBooking /></PageTransition></MainLayout>}
        />

        <Route
          path="/pay/:roomId"
          element={<MainLayout><PageTransition><PaymentPage /></PageTransition></MainLayout>}
        />

        <Route
          path="/my-bookings"
          element={<MainLayout><PageTransition><MyBookings /></PageTransition></MainLayout>}
        />

        {/* ========== EXPLORE / SEARCH ========== */}
        <Route
          path="/search"
          element={<MainLayout><PageTransition><SearchPage /></PageTransition></MainLayout>}
        />

        <Route
          path="/explore"
          element={<MainLayout><PageTransition><ExplorePage /></PageTransition></MainLayout>}
        />

        {/* duplicates removed, only one hotel detail page used */}
        <Route
          path="/hotel-details/:id"
          element={<MainLayout><PageTransition><HotelDetailPage /></PageTransition></MainLayout>}
        />

        {/* ========== OWNER ROUTES ========== */}
        <Route
          path="/owner/dashboard"
          element={<MainLayout><PageTransition><OwnerDashboard /></PageTransition></MainLayout>}
        />

      </Routes>
    </>
  );
}


// ===========================
//   FINAL APP
// ===========================
export default function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AppWrapper />
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}