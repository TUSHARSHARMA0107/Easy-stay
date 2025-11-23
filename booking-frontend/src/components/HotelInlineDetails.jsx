import { useState } from "react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      >
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs">{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="mt-2 text-sm text-gray-700">{children}</div>}
    </div>
  );
}