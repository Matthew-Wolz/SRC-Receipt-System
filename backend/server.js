const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const xlsx = require("xlsx");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// Load environment variables
dotenv.config();

// Import Mongoose models
const GuestPass = require("./models/GuestPass");
const TenVisitPunchCard = require("./models/TenVisitPunchCard");
const AthleticTape = require("./models/AthleticTape");
const HairTie = require("./models/HairTie");
const ChildrenGuestPass = require("./models/ChildrenGuestPass");
const YouthGuestPass = require("./models/YouthGuestPass");
const GuestMembership = require("./models/GuestMembership");
const LockerRental = require("./models/LockerRental");

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
const headers = ["Sponsor Name", "Guest Name", "Date", "Timestamp", "Initials", "Receipt Number", "Email", "Item", "Price"];

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
    const lastGuestMembership = await GuestMembership.findOne().sort({ guestPassNumber: -1 });
    const lastLockerRental = await LockerRental.findOne().sort({ guestPassNumber: -1 });

    const highestGuestPassNumber = lastGuestPass ? lastGuestPass.guestPassNumber : 0;
    const highestTenVisitPunchCardNumber = lastTenVisitPunchCard ? lastTenVisitPunchCard.guestPassNumber : 0;
    const highestChildrenGuestPassNumber = lastChildrenGuestPass ? lastChildrenGuestPass.guestPassNumber : 0;
    const highestYouthGuestPassNumber = lastYouthGuestPass ? lastYouthGuestPass.guestPassNumber : 0;
    const highestGuestMembershipNumber = lastGuestMembership ? lastGuestMembership.guestPassNumber : 0;
    const highestLockerRentalNumber = lastLockerRental ? lastLockerRental.guestPassNumber : 0;

    return Math.max(
      highestGuestPassNumber,
      highestTenVisitPunchCardNumber,
      highestChildrenGuestPassNumber,
      highestYouthGuestPassNumber,
      highestGuestMembershipNumber,
      highestLockerRentalNumber
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

// Generate PDF receipt
const generatePDFReceipt = (receiptData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    
    doc.fontSize(20).text('Student Recreation Center', { align: 'center' });
    doc.fontSize(16).text('Receipt', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`Receipt #: ${receiptData["Receipt Number"]}`);
    if (receiptData["Sponsor Name"] && receiptData["Sponsor Name"] !== "N/A") {
      doc.text(`Sponsor Name: ${receiptData["Sponsor Name"]}`);
    }
    doc.text(`Guest Name: ${receiptData["Guest Name"]}`);
    doc.text(`Date: ${receiptData["Date"]}`);
    doc.text(`Timestamp: ${receiptData["Timestamp"]}`);
    doc.text(`Staff Initials: ${receiptData["Initials"]}`);
    doc.text(`Product: ${receiptData["Item"]}`);
    doc.text(`Amount: $${receiptData["Price"]}`);
    if (receiptData["Email"] && receiptData["Email"] !== "N/A") {
      doc.text(`Email: ${receiptData["Email"]}`);
    }
    
    doc.end();
  });
};

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).send("Server is running");
});

// Submit Guest Pass Endpoint
app.post("/api/submit-guest-pass", async (req, res) => {
  const { sponsorName, guestName, staffInitials, email, product, dateOfBirth, photoId, membershipType, duration } = req.body;
  const today = new Date();
  const dateSold = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const timestamp = today.toLocaleTimeString();

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
    let productName = product;

    // Create new pass based on product type
    switch (product) {
      case "Daily Guest Pass":
        amount = 3;
        newPass = new GuestPass({ sponsorName, guestName, dateSold, timestamp, staffInitials, guestPassNumber, email, product, amount });
        break;
      case "Alumni, Spouse, Child 18+ Punch Card ($25)":
        amount = 25;
        newPass = new TenVisitPunchCard({ sponsorName, guestName, dateSold, timestamp, staffInitials, guestPassNumber, email, product, amount });
        break;
      case "Child 14-17 Years Old Punch Card ($25)":
        amount = 25;
        newPass = new ChildrenGuestPass({ guestName, photoId, dateSold, timestamp, staffInitials, guestPassNumber, email, product, amount });
        break;
      case "Youth Guest Pass":
        const birthDate = new Date(dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age > 14) {
          return res.status(400).send("Youth Guest Pass is only available for guests under 14 years old");
        }
        amount = 3;
        newPass = new YouthGuestPass({ sponsorName, guestName, dateOfBirth, dateSold, timestamp, staffInitials, guestPassNumber, email, product, amount });
        break;
      case "Guest Membership":
        if (!membershipType || !duration) {
          return res.status(400).send("Membership type and duration are required");
        }
        switch (membershipType) {
          case "Spouse or 18+ Child":
            amount = duration === "Spring/Fall Semester" ? 125 : duration === "Summer Session" ? 50 : 300;
            break;
          case "Alumni":
            amount = duration === "Spring/Fall Semester" ? 175 : duration === "Summer Session" ? 75 : 425;
            break;
          case "Alumni Couple":
            amount = duration === "Spring/Fall Semester" ? 300 : duration === "Summer Session" ? 140 : 740;
            break;
          default:
            return res.status(400).send("Invalid membership type");
        }
        productName = `Guest Membership - ${membershipType} (${duration})`;
        newPass = new GuestMembership({ guestName, dateSold, timestamp, staffInitials, guestPassNumber, email, product: productName, amount });
        break;
      case "Locker Rental":
        if (!duration) {
          return res.status(400).send("Duration is required");
        }
        switch (duration) {
          case "1 Semester":
            amount = 15;
            break;
          case "2 Semesters":
            amount = 25;
            break;
          case "1 Year":
            amount = 40;
            break;
          default:
            return res.status(400).send("Invalid duration");
        }
        productName = `Locker Rental - ${duration}`;
        newPass = new LockerRental({ guestName, dateSold, timestamp, staffInitials, guestPassNumber, email, product: productName, amount });
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
      timestamp,
      staffInitials,
      guestPassNumber,
      email || "N/A",
      productName,
      amount
    ];
    await addToExcel(excelData);

    // Send email if provided
    if (email) {
      console.log(`Attempting to send email to: ${email}`);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Guest Pass Receipt",
        text: `Sponsor Name: ${sponsorName || "N/A"}\nGuest Name: ${guestName}\nDate Sold: ${dateSold}\nTimestamp: ${timestamp}\nSold By: ${staffInitials}\nGuest Pass Number: ${guestPassNumber}\nProduct: ${productName}\nAmount: $${amount}`,
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

// Send Excel file via email
app.post("/api/send-excel-email", async (req, res) => {
  try {
    if (!fs.existsSync(excelFilePath)) {
      return res.status(404).send("Excel file not found");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "wolzie99@gmail.com",
      subject: "Receipts Excel File",
      text: "Please find attached the receipts Excel file.",
      attachments: [
        {
          filename: "receipts.xlsx",
          path: excelFilePath
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Excel file email sent:", info.response);
    res.status(200).send("Excel file sent successfully");
  } catch (error) {
    console.error("Error sending Excel file email:", error);
    res.status(500).send("Failed to send Excel file email");
  }
});

// Generate and download PDF receipt
app.get("/api/receipt-pdf/:date/:receiptNumber", async (req, res) => {
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
    
    const pdfBuffer = await generatePDFReceipt(receipt);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=receipt-${receiptNumber}.pdf`,
      'Content-Length': pdfBuffer.length
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF receipt:", error);
    res.status(500).send("Error generating PDF receipt");
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