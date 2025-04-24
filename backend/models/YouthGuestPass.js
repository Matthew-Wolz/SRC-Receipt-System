const mongoose = require("mongoose");

const youthGuestPassSchema = new mongoose.Schema({
  sponsorName: { type: String, required: true },
  guestName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "Youth Guest Pass" },
  amount: { type: Number, required: true, default: 3 },
});

module.exports = mongoose.model("YouthGuestPass", youthGuestPassSchema);