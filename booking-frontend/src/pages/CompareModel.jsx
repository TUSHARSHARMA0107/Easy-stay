import React, { useEffect, useState } from "react";
import { comparePrices } from "../api/compare";
import PriceOption from "../components/PriceOption";

export default function CompareModal({ name, location, type, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    comparePrices(name, location, type).then((res) => setData(res));
  }, [name, location, type]);

  if (!data) return <div className="modal">Loading...</div>;

  return (
    <div className="modal">
      <div className="modal-content">

        <h2>Best Deal for: {name}</h2>

        <h3>🔥 Cheapest Option</h3>
        <PriceOption option={data.cheapest} highlight />

        <hr />

        <h3>Other Prices</h3>
        {data.results.slice(1).map((item, idx) => (
          <PriceOption key={idx} option={item} />
        ))}

        <button onClick={onClose}>Close</button>

      </div>
    </div>
  );
}