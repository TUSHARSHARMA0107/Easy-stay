import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Accordion from "../components/Accordion";
import { motion } from "framer-motion";

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`);
        const json = await res.json();
        setDetail(json);
      } catch (e) {
        console.error("Detail error:", e);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!detail?.photos?.length) return;
    const t = setInterval(
      () => setIndex((p) => (p + 1) % detail.photos.length),
      2500
    );
    return () => clearInterval(t);
  }, [detail]);

  if (!detail) return <p className="p-4">Loading...</p>;

  return (
    <PageTransition>
      <div className="pb-24">
        <div className="px-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-gray-600"
          >
            ← Back
          </button>
        </div>

        {detail.photos?.length > 0 && (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-60 rounded-2xl overflow-hidden mx-4 mt-2"
          >
            <img
              src={detail.photos[index]}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div className="p-4">
          <h1 className="text-xl font-bold">{detail.name}</h1>
          <p className="text-sm text-gray-600">
            {detail.city}
            {detail.country ? `, ${detail.country}` : ""}
          </p>

          {detail.rating && (
            <p className="mt-1 text-yellow-500 text-sm">
              ⭐ {detail.rating}{" "}
              {detail.reviewCount ? `(${detail.reviewCount})` : ""}
            </p>
          )}

          {detail.price && (
            <p className="text-blue-600 text-lg font-bold mt-2">
              {detail.currency || "INR"} {detail.price} / night
            </p>
          )}
        </div>

        <div className="px-4 space-y-3">
          <Accordion title="Description">
            <p className="text-sm text-gray-700">
              {detail.description || "No description available"}
            </p>
          </Accordion>

          <Accordion title="Facilities">
            {detail.facilities?.length ? (
              <ul className="list-disc pl-4 text-sm text-gray-700">
                {detail.facilities.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Not available</p>
            )}
          </Accordion>

          <Accordion title="Location">
            <p className="text-sm text-gray-700">
              {detail.location?.address}
            </p>
            {detail.location?.lat && detail.location?.lng && (
              <a
                href={`https://maps.google.com/?q=${detail.location.lat},${detail.location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-xs underline block mt-1"
              >
                Open in Google Maps →
              </a>
            )}
          </Accordion>

          <Accordion title="Policies">
            <p className="text-sm text-gray-700">
              {detail.policies || "Not available"}
            </p>
          </Accordion>

          <Accordion title={Reviews (`${detail.reviews?.length || 0}`)}>
            {detail.reviews?.length ? (
              detail.reviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 py-2">
                  <p className="text-xs font-semibold">{r.author}</p>
                  <p className="text-xs text-yellow-500">
                    ⭐ {r.rating}
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    {r.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No reviews available</p>
            )}
          </Accordion>
        </div>
      </div>
    </PageTransition>
  );
}