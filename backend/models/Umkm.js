const mongoose = require("mongoose");

const umkmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
}, {
  timestamps: true
});

umkmSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Umkm", umkmSchema);
