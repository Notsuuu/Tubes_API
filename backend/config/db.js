require('dotenv').config();
const mongoose = require('mongoose');

console.log("Memulai koneksi ke database...");

async function connectDB() {
    try {
        console.log("Mencoba menghubungkan ke MongoDB...");
        console.log("URI MongoDB:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Database MongoDB Terhubung");
    } catch (err) {
        console.error("❌ Koneksi MongoDB Gagal:", err);
        process.exit(1);
    }
}

connectDB();
