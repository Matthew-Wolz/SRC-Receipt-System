const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const xlsx = require("xlsx");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Import Mongoose models
const GuestPass = require("./models/GuestPass");
const TenVisitPunchCard = require("./models/TenVisitPunchCard");
const AthleticTape = require("./models/AthleticTape");
const HairTie = require("./models/HairTie");
const ChildrenGuestPass = require("./models/ChildrenGuestPass");
const YouthGuestPass = require("./models/YouthGuestPass");

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

// Initialize Excel file
const excelFilePath = path.join(__dirname, "receipts.xlsx");
const headers = ["Sponsor Name", "Guest Name", "Date", "Initials", "Receipt Number", "Email", "Item", "Price"];

// Create or load Excel file
const initializeExcelFile = () => {
  if (fs.existsSync(excelFilePath)) {
    const workbook = xlsx.readFile(excelFilePath);
    // Remove Sheet1 if it exists
    if (workbook.SheetNames.includes("Sheet1")) {
      delete workbook.Sheets["Sheet1"];
      const sheetIndex = workbook.SheetNames.indexOf("Sheet1");
      workbook.SheetNames.splice(sheetIndex, 1);
      xlsx.writeFile(workbook, excelFilePath);
    }
  } else {
    // Create new empty workbook
    const workbook = xlsx.utils.book_new();
    xlsx.writeFile(workbook, excelFilePath);
  }
};

initializeExcelFile();

// Function to get the next guest pass number
const getNextGuestPassNumber = async () => {
  const lastGuestPass = await GuestPass.findOne().sort({ guestPassNumber: -1 });
  const lastTenVisitPunchCard = await TenVisitPunchCard.findOne().sort({ guestPassNumber: -1 });
  const lastChildrenGuestPass = await ChildrenGuestPass.findOne().sort({ guestPassNumber: -1 });
  const lastYouthGuestPass = await YouthGuestPass.findOne().sort({ guestPassNumber: -1 });

  const highestGuestPassNumber = lastGuestPass ? lastGuestPass.guestPassNumber : 0;
  const highestTenVisitPunchCardNumber = lastTenVisitPunchCard ? lastTenVisitPunchCard.guestPassNumber : 0;
  const highestChildrenGuestPassNumber = lastChildrenGuestPass ? lastChildrenGuestPass.guestPassNumber : 0;
  const highestYouthGuestPassNumber = lastYouthGuestPass ? lastYouthGuestPass.guestPassNumber : 0;

  return Math.max(
    highestGuestPassNumber,
    highestTenVisitPunchCardNumber,
    highestChildrenGuestPassNumber,
    highestYouthGuestPassNumber
  ) + 1;
};

// Function to add data to Excel sheet with daily tabs
const addToExcel = async (data) => {
  try {
    // Format date as YYYY-MM-DD for sheet name
    const today = new Date();
    const sheetName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let workbook;
    if (fs.existsSync(excelFilePath)) {
      workbook = xlsx.readFile(excelFilePath);
    } else {
      workbook = xlsx.utils.book_new();
    }

    // Check if sheet for today exists
    if (!workbook.SheetNames.includes(sheetName)) {
      const newWorksheet = xlsx.utils.aoa_to_sheet([headers]);
      xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName);
    }
    
    // Add data to today's sheet
    const worksheet = workbook.Sheets[sheetName];
    xlsx.utils.sheet_add_aoa(worksheet, [data], { origin: -1 });
    xlsx.writeFile(workbook, excelFilePath);
  } catch (error) {
    console.error("Error adding to Excel:", error);
    throw error;
  }
};

// Clear Excel data (keeps headers)
app.post("/api/clear-excel", (req, res) => {
  try {
    const workbook = xlsx.utils.book_new(); // Creates empty workbook
    xlsx.writeFile(workbook, excelFilePath); // Saves without any sheets
    res.status(200).send("Excel data cleared successfully");
  } catch (error) {
    console.error("Error clearing Excel:", error);
    res.status(500).send("Failed to clear Excel data");
  }
});

// Submit Guest Pass Endpoint
app.post("/api/submit-guest-pass", async (req, res) => {
  const { sponsorName, guestName, staffInitials, email, product, dateOfBirth, photoId } = req.body;
  const today = new Date();
  const dateSold = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  if (!guestName || !staffInitials || /[0-9]/.test(guestName) || /[0-9]/.test(staffInitials)) {
    return res.status(400).send("Invalid input data");
  }

  try {
    const guestPassNumber = await getNextGuestPassNumber();
    let newPass;
    let amount;

    switch (product) {
      case "Daily Guest Pass":
        amount = 3;
        newPass = new GuestPass({ sponsorName, guestName, dateSold, staffInitials, guestPassNumber, email, product, amount });
        break;
      case "10 Visit Guest Pass":
        amount = 25;
        newPass = new TenVisitPunchCard({ sponsorName, guestName, dateSold, staffInitials, guestPassNumber, email, product, amount });
        break;
      case "10 Visit Children Guest Pass":
        amount = 25;
        newPass = new ChildrenGuestPass({ guestName, photoId, dateSold, staffInitials, guestPassNumber, email, product, amount });
        break;
      case "Youth Guest Pass":
        const birthDate = new Date(dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age > 14) {
          return res.status(400).send("Youth Guest Pass is only available for guests under 14 years old");
        }
        amount = 3;
        newPass = new YouthGuestPass({ sponsorName, guestName, dateOfBirth, dateSold, staffInitials, guestPassNumber, email, product, amount });
        break;
      default:
        return res.status(400).send("Invalid product type");
    }

    await newPass.save();

    const excelData = [
      sponsorName || "N/A",
      guestName,
      dateSold,
      staffInitials,
      guestPassNumber,
      email || "N/A",
      product,
      amount
    ];
    await addToExcel(excelData);

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

// Get all available dates with receipts
app.get("/api/receipt-dates", async (req, res) => {
  try {
    const workbook = xlsx.readFile(excelFilePath);
    res.json(workbook.SheetNames.filter(name => name !== "Sheet1"));
  } catch (error) {
    console.error("Error getting receipt dates:", error);
    res.status(500).send("Error getting receipt dates");
  }
});

// Search receipt by number and date in Excel
app.get("/api/receipt/:date/:receiptNumber", async (req, res) => {
  try {
    const { date, receiptNumber } = req.params;
    const numReceipt = parseInt(receiptNumber);
    
    // Search the specific date sheet
    const workbook = xlsx.readFile(excelFilePath);
    if (!workbook.SheetNames.includes(date)) {
      return res.status(404).send("Date not found");
    }
    
    const worksheet = workbook.Sheets[date];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    const receipt = jsonData.find(row => row["Receipt Number"] === numReceipt);
    if (!receipt) {
      return res.status(404).send("Receipt not found for this date");
    }
    
    res.json(receipt);
  } catch (error) {
    console.error("Error fetching receipt:", error);
    res.status(500).send("Error fetching receipt data");
  }
});

// Fetch receipt from database by receipt number
app.get("/api/receipt/:receiptNumber", async (req, res) => {
  try {
    const receiptNumber = parseInt(req.params.receiptNumber);
    
    const guestPass = await GuestPass.findOne({ guestPassNumber: receiptNumber });
    if (guestPass) return res.json(guestPass);

    const tenVisitPass = await TenVisitPunchCard.findOne({ guestPassNumber: receiptNumber });
    if (tenVisitPass) return res.json(tenVisitPass);

    const childrenPass = await ChildrenGuestPass.findOne({ guestPassNumber: receiptNumber });
    if (childrenPass) return res.json(childrenPass);

    const youthPass = await YouthGuestPass.findOne({ guestPassNumber: receiptNumber });
    if (youthPass) return res.json(youthPass);

    res.status(404).send("Receipt not found");
  } catch (error) {
    console.error("Error fetching receipt:", error);
    res.status(500).send("Error fetching receipt data");
  }
});

// Serve Excel file (with overwrite)
app.get("/api/receipts", (req, res) => {
  // Delete existing file if it exists to prevent (1) duplicates
  if (fs.existsSync(excelFilePath)) {
    fs.unlinkSync(excelFilePath);
  }
  // Create fresh file
  initializeExcelFile();
  res.download(excelFilePath, "receipts.xlsx");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});