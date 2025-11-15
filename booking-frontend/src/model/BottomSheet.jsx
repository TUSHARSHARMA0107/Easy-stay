import { X } from "lucide-react";

export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-5 shadow-lg animate-slide-up">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">{title}</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}