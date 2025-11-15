import ModalWrapper from "./ModalWrapper.jsx";

export default function ComparePricesModal({ open, onClose, data }) {
  if (!data) return null;

  return (
    <ModalWrapper open={open} onClose={onClose} title="Compare Prices">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">

        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border
            dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{item.source}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">₹{item.price}</p>
            </div>

            <a
              href={item.safeRedirect}
              target="_blank"
              className={`px-3 py-1.5 rounded-lg
                ${item.isCheapest ? "bg-green-600 text-white" : "bg-blue-600 text-white"}
              `}
            >
              Book Now
            </a>
          </div>
        ))}

      </div>
    </ModalWrapper>
  );
}