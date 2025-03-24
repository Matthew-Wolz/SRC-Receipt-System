const mongoose = require("mongoose");

const tenVisitPunchCardSchema = new mongoose.Schema({
  sponsorName: { type: String, required: true },
  guestName: { type: String, required: true },
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "10 Visit Punch Card" },
  amount: { type: Number, required: true, default: 25 }, // Fixed amount for 10 Visit Punch Card
});

module.exports = mongoose.model("TenVisitPunchCard", tenVisitPunchCardSchema);