import ModalWrapper from "./ModalWrapper";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function ConfirmRedirectModal({
  open,
  onClose,
  externalUrl,
  providerName = "External Website",
  providerLogo,
}) {
  const redirectNow = () => {
    if (!externalUrl) return;

    // safe backend redirect wrapper
    window.location.href =` /api/redirect?url=${encodeURIComponent(externalUrl)}`;
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6 w-full max-w-md animate-fade">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {providerLogo && (
            <img
              src={providerLogo}
              className="w-10 h-10 rounded-md object-contain"
              alt="provider"
            />
          )}
          <h2 className="text-xl font-semibold dark:text-white">
            Leaving EasyStay
          </h2>
        </div>

        {/* Message */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          You are about to visit 
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {" "}{providerName}
          </span>.
          <br />For secure booking, you will be redirected to their official website.
        </p>

        {/* Highlight Box */}
        <div className="border-l-4 border-blue-500 bg-blue-50 
                        dark:bg-neutral-800 dark:border-blue-400
                        p-3 rounded text-sm mb-6">
          <span className="font-medium">Note:</span>  
          Prices and availability may differ from EasyStay.
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border dark:border-neutral-700
                       text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                       dark:hover:bg-neutral-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={redirectNow}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       text-white rounded-lg flex items-center gap-2 transition"
          >
            Continue
            <FaExternalLinkAlt size={14} />
          </button>
        </div>

      </div>
    </ModalWrapper>
  );
}