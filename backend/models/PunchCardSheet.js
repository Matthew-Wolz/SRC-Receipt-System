const mongoose = require("mongoose");

const punchCardSheetSchema = new mongoose.Schema({
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "Punch Card Sheet" },
});

module.exports = mongoose.model("PunchCardSheet", punchCardSheetSchema);