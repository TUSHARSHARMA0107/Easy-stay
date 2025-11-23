import { useEffect, useState } from "react";
import api from "../../config/api";

export default function OwnerDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [newBiz, setNewBiz] = useState({
    name: "",
    address: "",
    description: "",
    images: [],
  });

  const [newRoom, setNewRoom] = useState({
    title: "",
    price: "",
    beds: "",
    maxGuests: "",
    description: "",
  });

  // ---------------- LOAD OWNER BUSINESSES ----------------
  const loadBusinesses = async () => {
    const res = await api.get("/business/mine");
    setBusinesses(res.data.businesses);
  };

  // ---------------- LOAD BUSINESS BOOKINGS ----------------
  const loadBookings = async (businessId) => {
    const res = await api.get(`/business/${businessId}/bookings`);
    setBookings(res.data.bookings);
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    if (selected) loadBookings(selected.id);
  }, [selected]);

  // ---------------- REGISTER NEW BUSINESS ----------------
  const createBusiness = async () => {
    const fd = new FormData();
    fd.append("name", newBiz.name);
    fd.append("address", newBiz.address);
    fd.append("description", newBiz.description);
    [...newBiz.images].forEach((img) => fd.append("images", img));

    await api.post("/business/create", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Business added");
    loadBusinesses();
  };

  // ---------------- ADD ROOM ----------------
  const addRoom = async () => {
    if (!selected) return alert("Select a property");

    await api.post(`/business/${selected.id}`/rooms, newRoom);
    alert("Room added");
    loadBusinesses();
  };

  // ---------------- DELETE ROOM ----------------
  const delRoom = async (roomId) => {
    await api.delete(`/business/room/${roomId}`);
    alert("Room Deleted");
    loadBusinesses();
  };

  // ---------------- DELETE BUSINESS ----------------
  const delBusiness = async (id) => {
    await api.delete(`/business/${id}`);
    alert("Business Deleted");
    loadBusinesses();
    setSelected(null);
  };

  // ---------------- ADD PROPERTY IMAGE ----------------
  const addBizImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !selected) return;

    const fd = new FormData();
    fd.append("image", file);

    const res = await api.post(
     ` /business/${selected.id}/images`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Image Added");
    loadBusinesses();
  };

  // ---------------- DELETE PROPERTY IMAGE ----------------
  const removeBizImage = async (imgUrl) => {
    await api.delete(`/business/${selected.id}/images`, {
      data: { imageUrl: imgUrl },
    });

    alert("Image Removed");
    loadBusinesses();
  };

  // ---------------- BOOKING CONFIRM / CANCEL ----------------
  const confirmBooking = async (id) => {
    await api.post(`/business/booking/${id}/confirm`);
    alert("Booking Confirmed");
    loadBookings(selected.id);
  };

  const cancelBooking = async (id) => {
    await api.post(`/business/booking/${id}/cancel`);
    alert("Booking Cancelled");
    loadBookings(selected.id);
  };

  // -------------------------------------------------------------
  //                        UI STARTS HERE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Owner Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ---------------- LEFT SIDEBAR ---------------- */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Your Properties</h2>

          {businesses.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelected(b)}
              className={`p-4 border rounded-xl mb-3 cursor-pointer ${
                selected?.id === b.id ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <h3 className="font-semibold text-lg">{b.name}</h3>
              <p className="text-sm text-gray-600">{b.address}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  delBusiness(b.id);
                }}
                className="text-red-500 text-sm mt-2"
              >
                Delete Property
              </button>
            </div>
          ))}

          {/* ADD NEW PROPERTY BUTTON */}
          <button
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
            onClick={() => document.getElementById("newBizModal").showModal()}
          >
            + Add Property
          </button>
        </div>

        {/* ---------------- MIDDLE PANEL (Rooms + Images) ---------------- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          {!selected ? (
            <p className="text-gray-500 text-center">
              Select a property to view details
            </p>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-3">{selected.name}</h2>
              <p className="text-gray-600 mb-3">{selected.address}</p>

              {/* ---------- IMAGES ---------- */}
              <h3 className="font-semibold mb-2">Images</h3>

              <div className="flex gap-4 overflow-x-auto">
                {selected.images?.map((img) => (
                  <div key={img} className="relative">
                    <img
                      src={img}
                      className="w-32 h-24 rounded-lg object-cover"
                    />

                    <button
                      onClick={() => removeBizImage(img)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
                    >
                      X
                    </button>
                  </div>
                ))}

                {/* ADD IMAGE */}
                <label className="w-32 h-24 border rounded-lg flex items-center justify-center cursor-pointer">
                  +
                  <input
                    type="file"
                    className="hidden"
                    onChange={addBizImage}
                  />
                </label>
              </div>

              {/* ---------- ROOMS ---------- */}
              <h3 className="font-semibold mt-6 mb-2 text-lg">Rooms</h3>

              {selected.rooms?.map((r) => (
                <div key={r.id} className="border p-4 rounded-xl mb-3">
                  <h4 className="font-bold">{r.title}</h4>
                  <p>₹{r.price}/night</p>

                  <button
                    onClick={() => delRoom(r.id)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Delete Room
                  </button>
                </div>
              ))}

              {/* ADD ROOM */}
              <div className="mt-4 border p-4 rounded-xl">
                <h4 className="font-bold mb-2">Add Room</h4>

                <input
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Title"
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, title: e.target.value })
                  }
                />

                <input
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Price"
                  type="number"
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, price: e.target.value })
                  }
                />

                <textarea
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Description"
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, description: e.target.value })
                  }
                />

                <button
                  onClick={addRoom}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                  Add Room
                </button>
              </div>
            </>
          )}
        </div>

        {/* ---------------- RIGHT PANEL — BOOKINGS ---------------- */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Bookings</h2>

          {!selected ? (
            <p className="text-gray-500">Select a property</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            bookings.map((bk) => (
              <div key={bk.id} className="border p-3 rounded-xl mb-3">
                <p className="font-bold">{bk.user.name}</p>
                <p className="text-sm">Room: {bk.room.title}</p>
                <p>Status: {bk.status}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => confirmBooking(bk.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => cancelBooking(bk.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---------------- ADD BUSINESS MODAL ---------------- */}
      <dialog id="newBizModal" className="modal">
        <form method="dialog" className="modal-box bg-white w-full max-w-lg">
          <h3 className="font-bold text-xl mb-4">Add New Property</h3>

          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Property Name"
            onChange={(e) =>
              setNewBiz({ ...newBiz, name: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Address"
            onChange={(e) =>
              setNewBiz({ ...newBiz, address: e.target.value })
            }
          />

          <textarea
            className="w-full border p-2 rounded mb-3"
            placeholder="Description"
            onChange={(e) =>
              setNewBiz({ ...newBiz, description: e.target.value })
            }
          />

          <input
            type="file"
            multiple
            className="w-full border p-2 rounded mb-3"
            onChange={(e) =>
              setNewBiz({ ...newBiz, images: e.target.files })
            }
          />

          <button
            type="button"
            onClick={createBusiness}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Add Property
          </button>

          <p className="text-center mt-3 cursor-pointer" onClick={() => document.getElementById("newBizModal").close()}>
            Close
          </p>
        </form>
      </dialog>
    </div>
  );
}