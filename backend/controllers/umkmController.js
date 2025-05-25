const UMKM = require("../models/Umkm");

// Tambah UMKM
const addUMKM = async (req, res) => {
    try {
        const { name, type, location, description } = req.body;
        const newUmkm = new UMKM({ name, type, location, description });
        await newUmkm.save();
        res.status(201).json({ message: "UMKM berhasil ditambahkan!", newUmkm });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan UMKM.", error });
    }
};

// Edit UMKM
const updateUMKM = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, location, description } = req.body;

        const updatedUmkm = await UMKM.findByIdAndUpdate(
            id,
            { name, type, location, description },
            { new: true } // untuk return data baru setelah update
        );

        if (!updatedUmkm) {
            return res.status(404).json({ message: "UMKM tidak ditemukan" });
        }

        res.status(200).json({ message: "UMKM berhasil diperbarui", updatedUmkm });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui UMKM", error });
    }
};

// Hapus UMKM
const deleteUMKM = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await UMKM.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "UMKM tidak ditemukan" });
        res.status(200).json({ message: "UMKM berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error });
    }
};

module.exports = { addUMKM, deleteUMKM, updateUMKM };

