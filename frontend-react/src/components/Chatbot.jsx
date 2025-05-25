import { useState } from 'react';
import axios from 'axios';

export default function ChatbotBox({ onSelectResults }) {
  const [type, setType] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!type.trim()) return;

    setLoading(true);
    setResponseText("");

    try {
      const res = await axios.get(`/api/chat/search?type=${type}`);
      const gptResult = res.data.result;
      const rawData = res.data.raw;

      // Kirim data ke MapView untuk tampilkan marker
      if (Array.isArray(rawData)) {
        onSelectResults(rawData);
      }

      setResponseText(gptResult || "Data tidak ditemukan.");
    } catch (err) {
      console.error(err);
      setResponseText("Terjadi kesalahan atau data tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded shadow-md h-full flex flex-col">
      <h2 className="font-bold mb-2">Asisten UMKM</h2>

      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Contoh: makanan, fashion, dll"
          className="flex-1 border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Cari
        </button>
      </div>

      <div className="flex-1 overflow-auto border p-2 rounded bg-gray-50 whitespace-pre-wrap">
        {loading ? "Memuat..." : responseText}
      </div>
    </div>
  );
}
