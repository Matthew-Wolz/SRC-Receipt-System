const mongoose = require("mongoose");

const guestPassSchema = new mongoose.Schema({
  sponsorName: { type: String, required: true },
  guestName: { type: String, required: true },
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "Daily Guest Pass" },
  amount: { type: Number, required: true, default: 3 }, // Fixed amount for Daily Guest Pass
});

module.exports = mongoose.model("GuestPass", guestPassSchema);