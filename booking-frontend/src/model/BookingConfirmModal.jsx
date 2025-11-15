import ModalWrapper from "./ModalWrapper.jsx";

export default function BookingConfirmModal({ open, onClose, booking }) {
  if (!booking) return null;

  return (
    <ModalWrapper open={open} onClose={onClose} title="Booking Confirmed">
      <div className="text-center space-y-4">

        <img
          src="/images/success.gif"
          className="w-28 mx-auto"
          alt="Success"
        />

        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Your booking for <span className="font-semibold">{booking.placeName}</span> is confirmed!
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Booking ID: {booking.id}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
}