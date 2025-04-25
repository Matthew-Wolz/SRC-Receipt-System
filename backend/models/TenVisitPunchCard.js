const mongoose = require("mongoose");

const tenVisitPunchCardSchema = new mongoose.Schema({
  sponsorName: { type: String, required: true },
  guestName: { type: String, required: true },
  dateSold: { type: String, required: true },
  timestamp: { type: String, required: true },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "Alumni, Spouse, Child 18+ Punch Card ($25)" },
  amount: { type: Number, required: true, default: 25 },
});

module.exports = mongoose.model("TenVisitPunchCard", tenVisitPunchCardSchema);