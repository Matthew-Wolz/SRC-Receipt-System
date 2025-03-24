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
});

// Add a pre-save hook to validate age
youthGuestPassSchema.pre("save", function (next) {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();

  if (age > 15) {
    const error = new Error("Guest must be 14 or under.");
    return next(error);
  }

  next();
});

module.exports = mongoose.model("YouthGuestPass", youthGuestPassSchema);