import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import PlaceDetailsPage from "./pages/PlaceDetails.jsx";
import ComparePricesPage from "./pages/ComparePricePage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyBookings from "./pages/MyBooking.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ReviewsPage from "./pages/ReviewsPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OwnerRegisterPage from "./pages/OwnerRegisterPage.jsx";

import OwnerDashboardPage from "./pages/OwnerDashboard.jsx";
import OwnerAddHotelPage from "./pages/OwnerAddHotelPage.jsx";
import OwnerManageHotelPage from "./pages/OwnerManageHotelPage.jsx";

import RedirectPage from "./pages/RedirectPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Protected Routes
import ProtectedRoute from "./layout/ProtectedRoutes.jsx";
import OwnerRoute from "./layout/OwnerRoute.jsx";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/places/:placeId" element={<PlaceDetailsPage />} />
          <Route path="/compare" element={<ComparePricesPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/owner/register" element={<OwnerRegisterPage />} />

          {/* Protected User */}
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reviews/:businessId"
            element={<ReviewsPage />}
          />

          {/* Owner */}
          <Route
            path="/owner/dashboard"
            element={
              <OwnerRoute>
                <OwnerDashboardPage />
              </OwnerRoute>
            }
          />

          <Route
            path="/owner/hotels/new"
            element={
              <OwnerRoute>
                <OwnerAddHotelPage />
              </OwnerRoute>
            }
          />

          <Route
            path="/owner/hotels/:id/edit"
            element={
              <OwnerRoute>
                <OwnerManageHotelPage />
              </OwnerRoute>
            }
          />

          {/* Redirect */}
          <Route path="/redirect" element={<RedirectPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Layout>
    </Router>
  );
}