import React, { useState } from "react";
import CompareModal from "../pages/CompareModal";

export default function PlaceCard({ place }) {
  const [open, setOpen] = useState(false);

  const _photo = place.photos?.[0]?.authorAttributions?.[0]?.photoUri || null;
  const name = place.displayName?.text;
  const location = place.formattedAddress;

  return (
    <>
      <div style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "10px"
      }}>
        <h3>{name}</h3>
        <p>{location}</p>
        <p>⭐ {place.rating || "No rating"}</p>

        <button onClick={() => setOpen(true)}>Compare Prices</button>
      </div>

      {open && (
        <CompareModal
          name={name}
          location={location}
          type={place.types?.includes("restaurant") ? "restaurant" : "hotel"}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}