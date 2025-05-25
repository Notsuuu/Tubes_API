const express = require("express");
const router = express.Router();
const { geocodePlace } = require("../utils/mapbox");

// Endpoint test Mapbox manual
router.get("/geocode", async (req, res) => {
  const { place } = req.query;

  if (!place) {
    return res.status(400).json({ message: "Parameter 'place' diperlukan." });
  }

  try {
    const result = await geocodePlace(place);
    if (!result) return res.status(404).json({ message: "Lokasi tidak ditemukan." });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
