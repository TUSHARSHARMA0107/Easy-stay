import { Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import ProtectedRoute from "../src/components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import BusinessDetails from "./pages/BusinessDetails";
import BookingReview from "./pages/BookingReview";
import PaymentPage from "./pages/PaymentPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBooking";

import OwnerDashboard from "./pages/owner/OwnerDashboard";

import ChatBubble from "./components/chat/ChatBubble";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/business/:id" element={<BusinessDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* booking flow */}
        <Route path="/book/:businessId/:unitId" element={<BookingReview />} />
        <Route path="/pay/:businessId/:unitId" element={<PaymentPage />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />

        {/* auth-protected */}
        <Route element={<ProtectedRoute roles={["USER","OWNER"]} />}>
          <Route path="/bookings" element={<MyBookings />} />
        </Route>

        {/* owner-only */}
        <Route element={<ProtectedRoute roles={["OWNER"]} />}>
          <Route path="/owner" element={<OwnerDashboard />} />
        </Route>
      </Routes>

   
      <ChatBubble />
    </>
  );
}


