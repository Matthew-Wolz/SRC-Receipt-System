const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let guestPassNumber = 1;

app.post('/api/send-receipt', (req, res) => {
  const { sponsorName, guestName, staffInitials, email } = req.body;
  const dateSold = new Date().toLocaleDateString();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Guest Pass Receipt',
    text: `Sponsor Name: ${sponsorName}\nGuest Name: ${guestName}\nDate Sold: ${dateSold}\nSold By: ${staffInitials}\nGuest Pass Number: ${guestPassNumber}\nAmount: $3`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Receipt sent: ' + info.response);
  });

  const newRow = [sponsorName, guestName, dateSold, staffInitials, guestPassNumber];
  const workbook = xlsx.readFile('receipts.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  xlsx.utils.sheet_add_aoa(sheet, [newRow], { origin: -1 });
  xlsx.writeFile(workbook, 'receipts.xlsx');

  guestPassNumber++;
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});