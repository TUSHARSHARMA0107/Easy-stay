import { useEffect, useState } from "react";
import api from "../../../config/axios";
import toast from "react-hot-toast";

export default function BusinessInfo() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/business/my");
        setBusiness(res.data.business);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const handleChange = (e) => setBusiness({ ...business, [e.target.name]: e.target.value });

  const saveChanges = async () => {
    setSaving(true);
    try {
      await api.put(`/business/${business.id}`, business);
      toast.success("Business updated ✅");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!business) return <p>No business created yet.</p>;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">My Business Details</h1>
      <div className="space-y-3">
        <label className="block text-sm text-gray-600">Business Name</label>
        <input type="text" name="name" value={business.name} onChange={handleChange} className="input w-full" />
        <label className="block text-sm text-gray-600">Type</label>
        <select name="type" value={business.type} onChange={handleChange} className="input w-full">
          <option>HOTEL</option><option>HOSTEL</option><option>AIRBNB</option><option>RESTAURANT</option><option>GUESTHOUSE</option>
        </select>
        <label className="block text-sm text-gray-600">Location</label>
        <input name="location" value={business.location || ""} onChange={handleChange} className="input w-full" />
        <label className="block text-sm text-gray-600">Address</label>
        <textarea name="address" value={business.address || ""} onChange={handleChange} className="input w-full" />
        <label className="block text-sm text-gray-600">Description</label>
        <textarea name="description" value={business.description || ""} onChange={handleChange} className="input w-full" />
      </div>
      <button onClick={saveChanges} disabled={saving} className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition">
        {saving ? "Saving..." : "Save Changes"}
      </button>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Images</h2>
        <div className="flex gap-4 overflow-x-auto">
          <label className="block mt-4 w-fit cursor-pointer text-blue-600 font-medium hover:underline">
            Upload New Image
            <input type="file" className="hidden" onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("image", file);
                try {
                  await api.post(`/business/${business.id}/image`, formData);
                  window.location.reload();
                } catch (err) {
                  console.error(err);
                  toast.error("Upload failed");
                }
              }} />
          </label>
        </div>
      </div>
    </div>
  );
}