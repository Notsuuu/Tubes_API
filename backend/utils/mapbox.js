const axios = require("axios");  // Pastikan axios diimport
const dotenv = require("dotenv");
dotenv.config(); // Memuat variabel lingkungan dari file .env

const MAPBOX_TOKEN = process.env.MAPBOX_API_KEY;
const MAPBOX_TILE_URL = process.env.MAPBOX_TILE_URL;
const STYLE_ID = process.env.MAPBOX_STYLE_ID;

/**
 * Fungsi untuk mencari lokasi berdasarkan nama tempat menggunakan Mapbox Geocoding API
 */
const geocodePlace = async (place) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json`,
      {
        params: {
          access_token: MAPBOX_TOKEN,
          limit: 1, // Membatasi hasil menjadi 1
        },
      }
    );

    const features = response.data.features;
    if (!features.length) return null;

    const { place_name, geometry } = features[0];
    return {
      place_name, // Nama tempat
      coordinates: geometry.coordinates, // Koordinat [lon, lat]
    };
  } catch (error) {
    console.error("Mapbox Error:", error.response?.data || error.message);
    throw new Error("Gagal mengambil data lokasi dari Mapbox.");
  }
};

/**
 * Menghasilkan URL untuk tile Mapbox tertentu (z, x, y)
 */
const getTileURL = (z, x, y) => {
  return `${MAPBOX_TILE_URL}/${STYLE_ID}/tiles/${z}/${x}/${y}?access_token=${MAPBOX_TOKEN}`;
};

/**
 * Menghasilkan URL untuk static map Mapbox
 */
const getStaticMapURL = (lon, lat, zoom = 14, width = 600, height = 400) => {
  return `https://api.mapbox.com/styles/v1/${STYLE_ID}/static/${lon},${lat},${zoom}/${width}x${height}?access_token=${MAPBOX_TOKEN}`;
};

// Mengekspor fungsi-fungsi yang sudah dibuat
module.exports = {
  geocodePlace,
  getTileURL,
  getStaticMapURL,
};
