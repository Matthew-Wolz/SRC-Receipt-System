const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import Mongoose models
const GuestPass = require("./models/GuestPass");
const TenVisitPunchCard = require("./models/TenVisitPunchCard");
const AthleticTape = require("./models/AthleticTape");
const HairTie = require("./models/HairTie");

// Initialize Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to get the next guest pass number
const getNextGuestPassNumber = async () => {
  // Find the highest guestPassNumber in both collections
  const lastGuestPass = await GuestPass.findOne().sort({ guestPassNumber: -1 });
  const lastTenVisitPunchCard = await TenVisitPunchCard.findOne().sort({ guestPassNumber: -1 });

  // Get the highest number from both collections
  const highestGuestPassNumber = lastGuestPass ? lastGuestPass.guestPassNumber : 0;
  const highestTenVisitPunchCardNumber = lastTenVisitPunchCard ? lastTenVisitPunchCard.guestPassNumber : 0;

  // Return the next available number
  return Math.max(highestGuestPassNumber, highestTenVisitPunchCardNumber) + 1;
};

// Submit Guest Pass Endpoint
app.post("/api/submit-guest-pass", async (req, res) => {
  const { sponsorName, guestName, staffInitials, email, product } = req.body;
  const dateSold = new Date().toLocaleDateString();

  console.log("Received submission:", { sponsorName, guestName, staffInitials, email, product }); // Log the request data

  try {
    // Get the next guest pass number
    const guestPassNumber = await getNextGuestPassNumber();
    console.log("Next guest pass number:", guestPassNumber); // Log the generated number

    let newPass;
    let amount;

    // Determine which schema to use based on the product
    switch (product) {
      case "Daily Guest Pass":
        amount = 3; // Fixed amount for Daily Guest Pass
        newPass = new GuestPass({
          sponsorName,
          guestName,
          dateSold,
          staffInitials,
          guestPassNumber,
          email: email || null,
          product,
          amount,
        });
        break;
      case "10 Visit Guest Pass": // Ensure this matches the frontend value
        amount = 25; // Fixed amount for 10 Visit Punch Card
        newPass = new TenVisitPunchCard({
          sponsorName,
          guestName,
          dateSold,
          staffInitials,
          guestPassNumber,
          email: email || null,
          product,
          amount,
        });
        break;
      case "Athletic Tape":
        amount = 1; // Fixed amount for Athletic Tape
        newPass = new AthleticTape({
          dateSold,
          staffInitials,
          guestPassNumber,
          email: email || null,
          product,
          amount,
        });
        break;
      case "Hair Tie":
        amount = 0.25; // Fixed amount for Hair Tie
        newPass = new HairTie({
          dateSold,
          staffInitials,
          guestPassNumber,
          email: email || null,
          product,
          amount,
        });
        break;
      default:
        return res.status(400).send("Invalid product type.");
    }

    // Save the new pass to the database
    await newPass.save();
    console.log("Saved to database:", newPass); // Log the saved document

    // Update Excel sheet
    const newRow = [sponsorName, guestName, dateSold, staffInitials, guestPassNumber, email || "N/A", product, amount];
    const workbook = xlsx.readFile("receipts.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    xlsx.utils.sheet_add_aoa(sheet, [newRow], { origin: -1 });
    xlsx.writeFile(workbook, "receipts.xlsx");

    // Send email receipt if requested
    if (email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Guest Pass Receipt",
        text: `Sponsor Name: ${sponsorName}\nGuest Name: ${guestName}\nDate Sold: ${dateSold}\nSold By: ${staffInitials}\nGuest Pass Number: ${guestPassNumber}\nProduct: ${product}\nAmount: $${amount}`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).send("Guest pass submitted successfully!");
  } catch (error) {
    console.error("Error submitting guest pass:", error);
    res.status(500).send("Failed to submit guest pass.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});