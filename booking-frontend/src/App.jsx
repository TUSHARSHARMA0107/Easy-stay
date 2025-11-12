// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Layout
import Navbar from "../src/components/Navbar";
import ChatBubble from "./components/chat/ChatBubble";

// Auth
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages (user-facing)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import BusinessDetails from "./pages/BusinessDetails";

// Booking flow
import BookingReview from "./pages/BookingReview";
import PaymentPage from "./pages/PaymentPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBooking";

// Owner area
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerAnalytics from "./pages/OwnerAnalytics"; // we created this at /src/pages/OwnerAnalytics.jsx

// ---------- Helpers ----------
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-gray-500 mb-6">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          Go Home
        </a>
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/business/:id" element={<BusinessDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Booking flow (user can open review/payment even if not logged in; 
            but final booking creation requires auth on the backend) */}
        <Route path="/book/:businessId/:unitId" element={<BookingReview />} />
        <Route path="/pay/:businessId/:unitId" element={<PaymentPage />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />

        {/* Auth-protected (both USER and OWNER) */}
        <Route element={<ProtectedRoute roles={["USER", "OWNER"]} />}>
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Owner-only */}
        <Route element={<ProtectedRoute roles={["OWNER"]} />}>
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/analytics" element={<OwnerAnalytics />} />
        </Route>

        {/* Legacy/redirects (optional) */}
        <Route path="/dashboard" element={<Navigate to="/owner" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global floating support chat (bottom-right, S3 style) */}
      <ChatBubble />
    </>
  );
}


