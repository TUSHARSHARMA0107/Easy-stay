export default function Toast({ message, show }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fadeIn z-50">
      {message}
    </div>
  );
}