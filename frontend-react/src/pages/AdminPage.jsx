import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [umkms, setUmkms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    latitude: "",
    longitude: "",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchUmkm = async () => {
    try {
      const res = await axios.get("/umkm");
      if (Array.isArray(res.data)) {
        setUmkms(res.data);
      } else {
        console.error("Response bukan array:", res.data);
        setUmkms([]);
      }
    } catch (err) {
      console.error("Gagal ambil data UMKM:", err);
      setUmkms([]);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchUmkm();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      type: form.type,
      description: form.description,
      location: {
        type: "Point",
        coordinates: [parseFloat(form.longitude), parseFloat(form.latitude)],
      },
    };

    try {
      if (editingId) {
        await axios.put(`/umkm/${editingId}`, data);
      } else {
        await axios.post("/umkm/add", data);
      }
      setForm({ name: "", type: "", description: "", latitude: "", longitude: "" });
      setEditingId(null);
      fetchUmkm();
    } catch (err) {
      console.error("Gagal simpan UMKM:", err);
    }
  };

  const handleEdit = (umkm) => {
    const [lng, lat] = umkm.location.coordinates;
    setForm({
      name: umkm.name,
      type: umkm.type,
      description: umkm.description || "",
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
    setEditingId(umkm._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`/umkm/${id}`);
      fetchUmkm();
    } catch (err) {
      console.error("Gagal hapus UMKM:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin - Kelola Data UMKM</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Form Tambah/Edit */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Nama UMKM" className="border p-2 rounded" />
          <input name="type" value={form.type} onChange={handleChange} required placeholder="Jenis UMKM" className="border p-2 rounded" />
          <input name="latitude" value={form.latitude} onChange={handleChange} required placeholder="Latitude" type="number" step="any" className="border p-2 rounded" />
          <input name="longitude" value={form.longitude} onChange={handleChange} required placeholder="Longitude" type="number" step="any" className="border p-2 rounded" />
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" rows={3} className="border p-2 rounded w-full" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update UMKM" : "Tambah UMKM"}
        </button>
      </form>

      {/* Daftar UMKM */}
      <table className="w-full bg-white shadow rounded overflow-hidden text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Nama</th>
            <th className="p-3">Jenis</th>
            <th className="p-3">Lokasi</th>
            <th className="p-3">Deskripsi</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(umkms) && umkms.length > 0 ? (
            umkms.map((u) => (
              <tr key={u._id}>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.type}</td>
                <td className="p-3">{u.location.coordinates[1].toFixed(5)}, {u.location.coordinates[0].toFixed(5)}</td>
                <td className="p-3">{u.description}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(u)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-3">Tidak ada data UMKM.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
