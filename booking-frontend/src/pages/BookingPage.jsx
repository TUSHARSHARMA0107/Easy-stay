import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios.js";
import DateSelector from "../components/DateSelector.jsx";
import BookingFooter from "../components/BookingFooter.jsx";
import BookingConfirmModal from "../model/BookingConfirmModal.jsx";

export default function BookingPage() {
  const { id } = useParams(); // hotel id from our DB
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInOut, setCheckInOut] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const loadHotel = async () => {
    try {
      const res = await api.get(`/api/hotels/${id}`);
      setHotel(res.data.hotel || res.data);
    } catch (err) {
      console.error("Hotel load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    if (!checkInOut.checkIn || !checkInOut.checkOut) {
      alert("Please select dates");
      return;
    }
    try {
      const res = await api.post(
        "/api/bookings",
        {
          hotelId: id,
          checkIn: checkInOut.checkIn,
          checkOut: checkInOut.checkOut,
          guests,
        }
      );
      setBookingData(res.data.booking || res.data);
      setConfirmOpen(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to create booking");
    }
  };

  useEffect(() => {
    loadHotel();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading hotel...</p>;
  }

  if (!hotel) {
    return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Hotel not found.</p>;
  }

  const image =
    hotel.images?.[0] || "https://via.placeholder.com/800x400?text=EasyStay";

  return (
    <div className="pb-24 space-y-5">
      <div className="rounded-2xl overflow-hidden shadow">
        <img src={image} alt={hotel.name} className="w-full h-56 sm:h-72 object-cover" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {hotel.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{hotel.location}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ⭐ {hotel.rating || "-"}
        </p>
      </div>

      <DateSelector onChange={setCheckInOut} />

      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Guests
        </label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-1 w-24 p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <BookingFooter price={hotel.price || 0} onBook={createBooking} />

      <BookingConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        booking={bookingData}
      />
    </div>
  );
}