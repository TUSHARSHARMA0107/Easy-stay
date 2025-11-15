import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        404 — Page Not Found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}