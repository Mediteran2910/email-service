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

app.get("/", (req, res) => {
  res.send("Hello World, again");
});

app.post("/contact", limiter, (req, res) => {
  const { mailOptions } = req.body;
  console.log("THIS IS REQ BODY", req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

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
