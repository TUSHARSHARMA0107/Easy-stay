import ModalWrapper from "./ModalWrapper.jsx";

export default function AlertModal({ open, onClose, message, onConfirm }) {
  return (
    <ModalWrapper open={open} onClose={onClose} title="Are you sure?">
      <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border dark:border-gray-700"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-600 text-white"
        >
          Confirm
        </button>
      </div>
    </ModalWrapper>
  );
}