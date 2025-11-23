// src/components/SearchSuggestionItem.jsx
export default function SearchSuggestionItem({ text, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-3 hover:bg-gray-100 cursor-pointer border-b text-gray-700 text-sm"
    >
      {text}
    </div>
  );
}