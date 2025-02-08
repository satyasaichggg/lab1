const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve Static Files (index.html)
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html"); // ✅ Serves HTML
});

app.post("/send-otp", (req, res) => {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        res.json({ message: "OTP sent successfully!" });
    });
});

// ✅ Use PORT 3000 for Codespaces
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
