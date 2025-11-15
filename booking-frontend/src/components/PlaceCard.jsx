import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import CompareModal from "../modals/CompareModal";

export default function PlaceCard({ place }) {
  const [open, setOpen] = useState(false);

  const name = place.displayName?.text || place.name;
  const address = place.formattedAddress || place.address || "";
  const rating = place.rating || "-";
  const photos =
    (place.photos || [])
      .map((p) =>
        p.name
          ?` https://google-map-places-new-v2.p.rapidapi.com/v1/${p.name}/media?maxWidthPx=800&maxHeightPx=600&skipHttpRedirect=true`
          : null
      )
      .filter(Boolean) || [];
  const cover =
    photos[0] ||
    "https://via.placeholder.com/800x600?text=Easy+Stay";

  return (
    <>
      <div className="bg-white dark:bg-[#0D1117] rounded-2xl shadow hover:shadow-lg transition p-3 mb-4">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={8}
          slidesPerView={1}
          className="rounded-xl h-56"
        >
          {(photos.length ? photos : [cover]).map((src, i) => (
            <SwiperSlide key={i}>
              <img src={src} className="w-full h-56 object-cover rounded-xl" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {address}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-yellow-500">★ {rating}</span>
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-sm"
            >
              Compare Prices
            </button>
          </div>
        </div>
      </div>

      {open && (
        <CompareModal
          name={name}
          location={address}
          type={
            (place.types || []).includes("restaurant") ? "restaurant" : "hotel"
          }
          cover={cover}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}