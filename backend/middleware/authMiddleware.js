// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Akses ditolak, token tidak valid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid" });
    }
};

// ✅ Hanya admin yang bisa akses
const checkAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Akses hanya untuk admin" });
    }
    next();
};

module.exports = { checkAuth, checkAdmin };
