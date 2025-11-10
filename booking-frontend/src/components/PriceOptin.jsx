import React from "react";

export default function PriceOption({ option, highlight }) {
  return (
    <div style={{
      padding: "12px",
      marginBottom: "10px",
      background: highlight ? "#d1ffd6" : "#f1f1f1",
      borderRadius: "6px"
    }}>
      <b>{option.platform}</b>
      <p>₹ {option.price}</p>
      <a href={option.safeRedirect} target="_blank" rel="noreferrer">
        <button>Book Now</button>
      </a>
    </div>
  );
}