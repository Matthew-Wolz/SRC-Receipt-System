const mongoose = require("mongoose");

const atsuPunchCardSchema = new mongoose.Schema({
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "ATSU Punch Card" },
});

module.exports = mongoose.model("ATSUPunchCard", atsuPunchCardSchema);