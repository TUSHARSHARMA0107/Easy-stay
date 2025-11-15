// src/pages/RedirectPage.jsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const target = searchParams.get("url");

  useEffect(() => {
    if (target) {
      setTimeout(() => {
        window.location.href = target;
      }, 1000);
    }
  }, [target]);

  if (!target) {
    return (
      <div className="pb-24 text-center py-10 text-gray-500 dark:text-gray-400">
        No redirect URL provided.
      </div>
    );
  }

  return (
    <div className="pb-24 text-center py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Redirecting you
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Taking you to the official booking website...
      </p>
    </div>
  );
}