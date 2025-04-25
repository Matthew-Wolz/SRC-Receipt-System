const mongoose = require("mongoose");

const childrenGuestPassSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  photoId: { type: Boolean, required: true, default: false },
  dateSold: { type: String, required: true },
  timestamp: { type: String, required: true },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "Child 14-17 Years Old Punch Card ($25)" },
  amount: { type: Number, required: true, default: 25 },
});

module.exports = mongoose.model("ChildrenGuestPass", childrenGuestPassSchema);