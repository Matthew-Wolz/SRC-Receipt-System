const mongoose = require("mongoose");

const hairTieSchema = new mongoose.Schema({
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "Hair Tie" },
  amount: { type: Number, required: true, default: 0.25 }, // Fixed amount for Hair Tie
});

module.exports = mongoose.model("HairTie", hairTieSchema);