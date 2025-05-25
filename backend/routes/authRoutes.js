const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// 👉 REGISTER USER (default role: "user")
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email sudah terdaftar" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Tidak boleh input role dari frontend
        user = new User({ name, email, password: hashedPassword }); // role default: "user"
        await user.save();

        return res.status(201).json({ message: "Registrasi berhasil" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Terjadi kesalahan server" });
    }
});

// 👉 LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Email atau password salah" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Email atau password salah" });
        }

        // ✅ Buat token JWT
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // atau sesuai kebutuhan
        );

        // ✅ Simpan user ke session (jika pakai session, tidak wajib jika hanya JWT)
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // ✅ Kirim token ke frontend
        return res.status(200).json({
            message: "Login berhasil",
            token, // <- KIRIM TOKEN DI SINI
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Terjadi kesalahan server" });
    }
});

module.exports = router;
