const express = require("express");
const { askOpenAI } = require("../utils/openai"); // helper OpenAI
const Umkm = require("../models/Umkm"); // model UMKM
const router = express.Router();

router.get("/search", async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({ message: "Tipe UMKM harus disertakan" });
        }

        // Cari UMKM berdasarkan tipe
        const umkmList = await Umkm.find({ type: new RegExp(type, "i") });

        if (umkmList.length === 0) {
            return res.status(404).json({ message: "Tidak ada UMKM ditemukan dengan tipe tersebut." });
        }

        // Siapkan prompt untuk GPT
        const prompt = `Berikut adalah daftar UMKM dengan tipe ${type} di Kota Palu:\n` +
            umkmList.map((u, i) =>
                `${i + 1}. ${u.name} - ${u.description || 'Deskripsi belum tersedia'}`
            ).join("\n") +
            `\nTolong tampilkan daftar tersebut dalam format yang rapi dan mudah dipahami.`;

        const reply = await askOpenAI(prompt);

        res.json({
            result: reply,   // teks jawaban GPT
            raw: umkmList    // data asli (untuk marker)
        });

    } catch (err) {
        console.error("GPT error:", err.response?.data || err.message);
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data dari GPT",
            error: err.response?.data?.error?.message || err.message
        });
    }
});

module.exports = router;
