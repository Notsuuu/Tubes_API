const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const path = require("path");

// Load environment variables
dotenv.config();

// Inisialisasi Express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Konfigurasi Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "rahasia123",
    resave: false,
    saveUninitialized: false,
  })
);

// ========================
// ROUTING API
// ========================
const authRoutes = require("./backend/routes/authRoutes");
const umkmRoutes = require("./backend/routes/umkmRoutes");
const chatbotRoutes = require("./backend/routes/chatbotRoutes");
const mapboxRoutes = require("./backend/routes/mapboxRoutes");

// Gunakan prefix /api untuk semua endpoint
app.use("/api/auth", authRoutes);
app.use("/api/umkm", umkmRoutes);
app.use("/api/chat", chatbotRoutes); // ✅ pastikan sesuai dengan axios.get('/api/chat/search')
app.use("/api/mapbox", mapboxRoutes);

// ========================
// SERVE FRONTEND
// ========================
// ========================
// CONNECT DATABASE & START SERVER
// ========================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
