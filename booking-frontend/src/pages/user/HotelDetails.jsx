// src/pages/user/HotelDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";

import PageHeader from "../../components/user/PageHeader";
import ImageCarousel from "../../components/user/ImageCarousel";
import Amenities from "../../components/user/Amenities";
import RoomCard from "../../components/user/RoomCard";
import RoomSkeleton from "../../components/skeletons/RoomSkeletion";

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/business/all");
      const found = (res.data.businesses || []).find((b) => b.id === id);
      setHotel(found || null);
    } catch (err) {
      console.log("Hotel load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHotels();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <PageHeader title="Loading hotel..." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {[1, 2, 3, 4].map((n) => (
            <RoomSkeleton key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <PageHeader title="Hotel not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <PageHeader title={hotel.name} subtitle={hotel.address} />

      <ImageCarousel images={hotel.images} />

      <Amenities list={hotel.amenities || []} />

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-slate-900">
        Available Rooms
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hotel.rooms?.length ? (
          hotel.rooms.map((room) => (
            <RoomCard key={room.id} room={room} businessId={hotel.id} />
          ))
        ) : (
          <p className="text-slate-500 text-sm">
            No rooms listed for this property yet.
          </p>
        )}
      </div>
    </div>
  );
}