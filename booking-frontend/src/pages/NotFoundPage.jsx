// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
        404
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        The page you&apos;re looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
}