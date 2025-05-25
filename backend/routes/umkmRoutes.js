const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UMKM = require("../models/Umkm");
const { checkAuth, checkAdmin } = require("../middleware/authMiddleware");
const { addUMKM, deleteUMKM, updateUMKM } = require("../controllers/umkmController");

// ✅ Ambil semua UMKM (hanya untuk user login)
router.get("/", checkAuth, async (req, res) => {
  try {
    const umkms = await UMKM.find();
    res.json(umkms);
  } catch (err) {
    console.error("Error fetching UMKM:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ✅ Pencarian berdasarkan nama/type/deskripsi (opsional: login)
router.get("/search", checkAuth, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Query kosong." });

  try {
    const umkms = await UMKM.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { type: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ]
    });

    if (umkms.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    res.json(umkms);
  } catch (err) {
    console.error("Error searching UMKM:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ✅ Tambah UMKM (admin only)
router.post("/add", checkAuth, checkAdmin, addUMKM);

// ✅ Edit UMKM (admin only + ID validasi)
router.put("/:id", checkAuth, checkAdmin, async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }
  next();
}, updateUMKM);

// ✅ Hapus UMKM (admin only + ID validasi)
router.delete("/:id", checkAuth, checkAdmin, async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }
  next();
}, deleteUMKM);

module.exports = router;
