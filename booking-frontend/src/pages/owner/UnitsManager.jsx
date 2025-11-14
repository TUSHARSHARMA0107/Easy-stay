import { useEffect, useState } from "react";
import api from "../../config/axios";
import toast from "react-hot-toast";

export default function UnitsManager() {
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState({ name: "", description: "", pricePerNight: "" });
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => { loadUnits(); }, []);

  const loadUnits = async () => {
    try {
      const res = await api.get("/business/my");
      setBusinessId(res.data.business.id);
      setUnits(res.data.business.units || []);
    } catch { toast.error("Failed to load units"); }
  };

  const addUnit = async () => {
    try {
      await api.post('/units/create', { businessId, ...newUnit });
      toast.success("Room added ✅");
      setNewUnit({ name: "", description: "", pricePerNight: "" });
      loadUnits();
    } catch { toast.error("Failed to add room"); }
  };

  const updateUnit = async (id, field, value) => {
    try {
      await api.put(`/units/${id}`, { [field]: value });
      toast.success("Updated ✅");
    } catch { toast.error("Update failed"); }
  };

  const deleteUnit = async (id) => {
    if (!confirm("Delete this room?")) return;
    try {
      await api.delete(`/units/${id}`);
      toast.success("Deleted ✅");
      loadUnits();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5">Room / Unit Manager</h1>
      <div className="border rounded-2xl p-4 shadow bg-white mb-6">
        <h2 className="text-lg font-medium mb-3">Add New Room</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input" placeholder="Room Name" value={newUnit.name} onChange={e=>setNewUnit({ ...newUnit, name: e.target.value })} />
          <input className="input" placeholder="Description" value={newUnit.description} onChange={e=>setNewUnit({ ...newUnit, description: e.target.value })} />
          <input className="input" placeholder="Price per Night" type="number" value={newUnit.pricePerNight} onChange={e=>setNewUnit({ ...newUnit, pricePerNight: e.target.value })} />
        </div>
        <button onClick={addUnit} className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">Add Room</button>
      </div>

      <div className="overflow-auto rounded-2xl border bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Room Name</th><th className="p-3">Description</th><th className="p-3">Price / Night</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3"><input className="input" defaultValue={u.name} onBlur={e=>updateUnit(u.id,"name", e.target.value)} /></td>
                <td className="p-3"><input className="input" defaultValue={u.description} onBlur={e=>updateUnit(u.id,"description", e.target.value)} /></td>
                <td className="p-3"><input type="number" className="input w-28" defaultValue={u.pricePerNight} onBlur={e=>updateUnit(u.id,"pricePerNight", Number(e.target.value))} /></td>
                <td className="p-3 text-right"><button onClick={() => deleteUnit(u.id)} className="text-red-600 hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}