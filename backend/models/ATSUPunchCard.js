const mongoose = require("mongoose");

const atsuPunchCardSchema = new mongoose.Schema({
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  guestName: { type: String, required: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "ATSU Punch Card" },
  amount: { type: Number, required: true, default: 100 },
});

module.exports = mongoose.model("ATSUPunchCard", atsuPunchCardSchema);