const mongoose = require("mongoose");

const lockerRentalSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  dateSold: { type: String, required: true },
  timestamp: { type: String, required: true },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("LockerRental", lockerRentalSchema);