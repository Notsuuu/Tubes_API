const express = require("express");
const { askOpenAI } = require("../utils/openai");
const Umkm = require("../models/Umkm");
const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Pertanyaan tidak boleh kosong." });
    }

    const umkmList = await Umkm.find({});
    const queryLower = query.toLowerCase();

    // Pencocokan nama UMKM secara ketat (case-insensitive)
    const normalize = (text) =>
        text.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
    const queryNorm = normalize(query);

    const nameMatch = umkmList.filter((u) =>
        u.name && normalize(u.name) === queryNorm
    );

    let filtered = [];

    if (nameMatch.length > 0) {
      // Jika cocok berdasarkan nama, gunakan hanya hasil nama
      filtered = nameMatch;
    } else {
      // Kalau tidak cocok nama, lanjut pencarian longgar berdasarkan konten
    const kategoriUMKM = [
        "rumah makan", "rm",
        "kafe", "cafe", "kedai kopi",
        "elektronik", "elektronika",
        "pakaian", "baju", "butik",
        "barbershop", "pangkas rambut",
        "percetakan", "print",
        "bengkel", "servis motor",
        "minuman", "drink", "beverage",
        "restoran", "restaurant",
        "warung", "warkop"
    ];


      const kategoriTerdeteksi = kategoriUMKM.find(k => queryLower.includes(k));
      const queryTokens = queryLower.split(" ");

      // Pencarian longgar
      let looseFiltered = umkmList.filter((u) => {
        const combinedText = `${u.name} ${u.description || ""} ${u.type || ""}`.toLowerCase();
        return queryTokens.some(token => combinedText.includes(token));
      });

      // Filter lebih dalam jika ada kategori spesifik
      if (kategoriTerdeteksi) {
        looseFiltered = looseFiltered.filter(u =>
          (u.type || "").toLowerCase().includes(kategoriTerdeteksi)
        );
      }

      filtered = looseFiltered;
    }

    const selectedUMKM = filtered.length > 0 ? filtered : [];

    const formattedData = selectedUMKM.length > 0
      ? selectedUMKM.map((u, i) =>
          `${i + 1}. ${u.name} - ${u.type || 'Tipe tidak diketahui'} - ${u.description || 'Deskripsi tidak tersedia'}`
        ).join("\n")
      : "Tidak ada UMKM yang ditemukan berdasarkan pencarian Anda.";

    const prompt = `
Pertanyaan pengguna: "${query}"
Berikut adalah daftar UMKM di Kota Palu yang mungkin sesuai dengan pertanyaan pengguna:
${formattedData}

Tolong bantu jawab pertanyaan di atas berdasarkan data UMKM ini dengan format yang jelas dan ringkas. Jangan sebutkan UMKM lain di luar daftar ini.
    `.trim();

    const gptReply = await askOpenAI(prompt);

    res.json({
      result: gptReply,
      raw: selectedUMKM,
    });

  } catch (err) {
    console.error("GPT error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat memproses permintaan.",
      error: err.response?.data?.error?.message || err.message,
    });
  }
});

module.exports = router;
