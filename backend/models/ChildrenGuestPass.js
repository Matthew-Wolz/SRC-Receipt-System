const mongoose = require("mongoose");

const childrenGuestPassSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  photoId: { type: Boolean, required: true, default: false },
  dateSold: { type: String, required: true, default: new Date().toLocaleDateString() },
  staffInitials: { type: String, required: true },
  guestPassNumber: { type: Number, required: true, unique: true },
  email: { type: String, default: null },
  product: { type: String, required: true, default: "10 Visit Children Guest Pass" },
});

module.exports = mongoose.model("ChildrenGuestPass", childrenGuestPassSchema);