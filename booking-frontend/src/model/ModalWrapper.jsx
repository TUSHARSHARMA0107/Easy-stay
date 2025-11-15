import { X } from "lucide-react";

export default function ModalWrapper({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-[90%] max-w-lg p-5 relative animate-fade-in">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}