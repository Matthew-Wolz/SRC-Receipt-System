const mongoose = require("mongoose");

const athleticTapeSchema = new mongoose.Schema({
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "Athletic Tape" },
  amount: { type: Number, required: true, default: 1 }, // Fixed amount for Athletic Tape
});

module.exports = mongoose.model("AthleticTape", athleticTapeSchema);