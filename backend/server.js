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
app.use(cors({ origin: "http://localhost:5173" }));
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
  try {
    let workbook;
    const today = new Date();
    const defaultSheetName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (fs.existsSync(excelFilePath)) {
      workbook = xlsx.readFile(excelFilePath);
      // Remove Sheet1 if it exists
      if (workbook.SheetNames.includes("Sheet1")) {
        delete workbook.Sheets["Sheet1"];
        const sheetIndex = workbook.SheetNames.indexOf("Sheet1");
        workbook.SheetNames.splice(sheetIndex, 1);
      }
    } else {
      workbook = xlsx.utils.book_new();
    }

    // Ensure the workbook has at least one sheet
    if (workbook.SheetNames.length === 0) {
      const defaultWorksheet = xlsx.utils.aoa_to_sheet([headers]);
      xlsx.utils.book_append_sheet(workbook, defaultWorksheet, defaultSheetName);
    }

    xlsx.writeFile(workbook, excelFilePath);
  } catch (error) {
    console.error("Error initializing Excel file:", error);
    throw new Error("Failed to initialize Excel file");
  }
};

initializeExcelFile();

// Function to get the next guest pass number
const getNextGuestPassNumber = async () => {
  try {
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
  } catch (error) {
    console.error("Error getting next guest pass number:", error);
    throw new Error("Failed to generate guest pass number");
  }
};

// Function to add data to Excel sheet with daily tabs
const addToExcel = async (data) => {
  try {
    const today = new Date();
    const sheetName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let workbook;
    if (fs.existsSync(excelFilePath)) {
      workbook = xlsx.readFile(excelFilePath);
    } else {
      workbook = xlsx.utils.book_new();
    }

    if (!workbook.SheetNames.includes(sheetName)) {
      const newWorksheet = xlsx.utils.aoa_to_sheet([headers]);
      xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName);
    }
    
    const worksheet = workbook.Sheets[sheetName];
    xlsx.utils.sheet_add_aoa(worksheet, [data], { origin: -1 });
    xlsx.writeFile(workbook, excelFilePath);
  } catch (error) {
    console.error("Error adding to Excel:", error);
    throw new Error("Failed to write to Excel file");
  }
};

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).send("Server is running");
});

// Clear Excel data
app.post("/api/clear-excel", (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();
    const today = new Date();
    const sheetName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const newWorksheet = xlsx.utils.aoa_to_sheet([headers]);
    xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName);
    xlsx.writeFile(workbook, excelFilePath);
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

  // Input validation
  if (!guestName || !staffInitials) {
    return res.status(400).send("Guest Name and Staff Initials are required");
  }

  if (/[0-9]/.test(guestName) || /[0-9]/.test(staffInitials)) {
    return res.status(400).send("Guest Name and Staff Initials cannot contain numbers");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send("Invalid email address");
  }

  try {
    // Generate guest pass number
    const guestPassNumber = await getNextGuestPassNumber();

    let newPass;
    let amount;

    // Create new pass based on product type
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

    // Save to MongoDB
    try {
      await newPass.save();
    } catch (error) {
      console.error("MongoDB save error:", error);
      if (error.code === 11000) {
        return res.status(400).send("Duplicate guest pass number");
      }
      throw new Error("Failed to save guest pass to database");
    }

    // Add to Excel
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

    // Send email if provided
    if (email) {
      console.log(`Attempting to send email to: ${email}`); // Log email sending attempt
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Guest Pass Receipt",
        text: `Sponsor Name: ${sponsorName}\nGuest Name: ${guestName}\nDate Sold: ${dateSold}\nSold By: ${staffInitials}\nGuest Pass Number: ${guestPassNumber}\nProduct: ${product}\nAmount: $${amount}`,
      };
      
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${email}`, info.response);
      } catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).send("Guest pass submitted but failed to send email notification");
      }
    }

    res.status(200).send("Guest pass submitted successfully!");

  } catch (error) {
    console.error("Error submitting guest pass:", error);
    res.status(500).send("Failed to submit guest pass");
  }
});

// Get all available dates with receipts
app.get("/api/receipt-dates", async (req, res) => {
  try {
    if (!fs.existsSync(excelFilePath)) {
      return res.json([]);
    }
    
    const workbook = xlsx.readFile(excelFilePath);
    const sheetNames = workbook.SheetNames.filter(name => name !== "Sheet1");
    
    // Verify each sheet has data
    const validDates = [];
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      if (jsonData.length > 0) {
        validDates.push(sheetName);
      }
    }
    
    res.json(validDates);
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
    
    if (!fs.existsSync(excelFilePath)) {
      return res.status(404).send("No receipts file found");
    }

    const workbook = xlsx.readFile(excelFilePath);
    if (!workbook.SheetNames.includes(date)) {
      return res.status(404).send("No receipts found for this date");
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

// Serve Excel file
app.get("/api/receipts", (req, res) => {
  try {
    if (!fs.existsSync(excelFilePath)) {
      initializeExcelFile();
    }
    res.download(excelFilePath, "receipts.xlsx");
  } catch (error) {
    console.error("Error serving Excel file:", error);
    res.status(500).send("Failed to serve Excel file");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});