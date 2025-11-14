import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Components
import Navbar from "./components/Navbar";   // <- your navbar file
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Layout
import AuthLayout from "./layout/AuthLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPages";
import SearchResults from "./pages/SearchResults";
import PaymentPage from "./pages/PaymentPage";
import MyBooking from "./pages/MyBooking";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerAnalytics from "./pages/owner/OwnerAnalytics";
import OwnerBookings from "./pages/owner/OwnerBookings";
import BusinessInfo from "./pages/owner/BusinessInfo";
import UnitsManager from "./pages/owner/UnitsManager";
import BusinessDetails from "./pages/owner/BusinessDetails";
import BookingPage from "./pages/owner/BookingPage";
import BookingReview from "./pages/BookingReview";
import BookingConfirmation from "./pages/BookingConfirmation";


function AppContent() {
  const location = useLocation();

  // Pages where navbar should be hidden
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/owner/dashboard",
    "/owner/analytics",
    "/owner/bookings",
    "/owner/business-info",
    "/owner/units",
    "/owner/business-details",
    "/owner/review",
    "/owner/confirmation"
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}   {/* SHOW NAVBAR ONLY WHEN ALLOWED */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        <Route path="/search" element={<SearchPage />} />
        <Route path="/results" element={<SearchResults />} />

        {/* Protected User Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBooking /></ProtectedRoute>} />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/analytics" element={<ProtectedRoute><OwnerAnalytics /></ProtectedRoute>} />
        <Route path="/owner/bookings" element={<ProtectedRoute><OwnerBookings /></ProtectedRoute>} />
        <Route path="/owner/business-info" element={<ProtectedRoute><BusinessInfo /></ProtectedRoute>} />
        <Route path="/owner/units" element={<ProtectedRoute><UnitsManager /></ProtectedRoute>} />
        <Route path="/owner/business-details" element={<ProtectedRoute><BusinessDetails /></ProtectedRoute>} />
        <Route path="/owner/booking-page/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/owner/review" element={<ProtectedRoute><BookingReview /></ProtectedRoute>} />
        <Route path="/owner/confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );

}