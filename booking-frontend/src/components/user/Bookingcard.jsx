// components/user/BookingCard.jsx
export default function BookingCard({ booking }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h2 className="font-semibold text-lg">{booking.business.name}</h2>
      <p>{booking.room.title}</p>

      <p className="text-gray-600">
        {booking.checkIn.slice(0, 10)} → {booking.checkOut.slice(0, 10)}
      </p>

      <p
        className={`font-bold mt-2 ${
          booking.status === "confirmed"
            ? "text-green-600"
            : booking.status === "cancelled"
            ? "text-red-600"
            : "text-orange-600"
        }`}
      >
        {booking.status.toUpperCase()}
      </p>
    </div>
  );
}