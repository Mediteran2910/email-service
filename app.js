require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const port = 3000;

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many request from this IP",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

var corsOptions = {
  origin: "https://mediteran2910.github.io/exercise/contact.html",
  optionsSuccessStatus: 200,
};

app.get("/", (req, res) => {
  res.send("Hello World, again");
});

app.post("/contact", cors(corsOptions), limiter, (req, res) => {
  const { subject, text, html, senderName } = req.body;
  console.log("THIS IS REQ BODY", req.body);

  const mailOptions = {
    from: senderName,
    to: "marindonadini00@gmail.com",
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while sending message",
      });
    }
    console.log(`Message sent: ${info.response}, ${mailOptions.text}`);
    res.status(200).json({
      success: true,
      message: "Message sent succesfully",
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
