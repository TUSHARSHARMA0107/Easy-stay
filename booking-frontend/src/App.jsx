import { Routes,Route } from "react-router-dom";
import Layout from "./layout/Layout";


import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PlaceDetailsPage from "./pages/PlaceDetails";
import ComparePricesPage from "./pages/ComparePricePage";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBooking";
import UserProfilePage from "./pages/UserProfilePage";
import ReviewsPage from "./pages/ReviewsPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OwnerRegisterPage from "./pages/OwnerRegisterPage";
import OwnerDashboardPage from "./pages/OwnerDashboard";
import OwnerAddHotelPage from "./pages/OwnerAddHotelPage";
import OwnerManageHotelPage from "./pages/OwnerManageHotelPage";

import RedirectPage from "./pages/RedirectPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProtectedRoute from "./layout/ProtectedRoutes";
import OwnerRoute from "./components/OwnerRoute";



export default function App() {
  return (
    <Routes>

      {/* ALL ROUTES INSIDE LAYOUT */}
      <Route element={<Layout />}>

        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/places/:placeId" element={<PlaceDetailsPage />} />
        <Route path="/compare" element={<ComparePricesPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/owner/register" element={<OwnerRegisterPage />} />

        {/* Protected */}
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

        {/* Public Reviews */}
        <Route path="/reviews/:businessId" element={<ReviewsPage />} />

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

      </Route>

      {/* 404 OUTSIDE LAYOUT */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

    
    
  
}