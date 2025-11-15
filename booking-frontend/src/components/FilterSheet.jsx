import { X } from "lucide-react";

export default function FilterSheet({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white dark:bg-[#0D1117] w-full rounded-t-2xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Filters</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}