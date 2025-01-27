require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const port = 3000;

app.use(express.json());

const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 25,
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
  origin: [
    "https://mediteran2910.github.io",
    "https://zepralak.io",
    "https://example27765.io",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World, again");
});

app.post("/contact", limiter, (req, res) => {
  const origin = req.get("origin");
  console.log("Request Origin: ", origin);
  console.log("Request body:", req.body);
  const { infoObj } = req.body;
  if (!infoObj || !infoObj.email) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }

  if (!dataObjects[origin]) {
    return res.status(400).json({
      success: false,
      message: "Invalid origin or configuration not found.",
    });
  }

  const { from, subject, to, generateContent } = dataObjects[origin];
  const { replyTo, text, html } = generateContent(infoObj);

  const mailTemplate = {
    from,
    to,
    subject,
    replyTo,
    text,
    html,
  };

  transporter.sendMail(mailTemplate, (error, info) => {
    if (error) {
      console.log("Error sending email", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while sending the message",
        error: error.message,
      });
    }
    console.log(`Message sent: ${info.response}`);
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  });
});

const dataObjects = {
  "https://mediteran2910.github.io": {
    from: process.env.EMAIL_USER,
    subject: "Villa Jure reservation",
    to: process.env.EMAIL_USER,
    generateContent: (infoObj) => ({
      replyTo: infoObj.email,
      text: `Hi, my name is ${infoObj.name}, 
      I'm contacting you about Villa Jure, 
      I would like to make an reservation, 
      You can contact me on ${infoObj.email}`,
      html: `<p>Hi my name is: ${infoObj.name}</p>
      <p>My email is: ${infoObj.email}</p>
      <p> Message: ${infoObj.message}<p>`,
    }),
  },
  "https://zepralak.io": {
    from: process.env.EMAIL_USER,
    subject: "Zepralak Development",
    to: process.env.EMAIL_USER,
    generateContent: (infoObj) => ({
      replyTo: infoObj.email,
      text: `Hi, my name is ${infoObj.name}, 
      I'm contacting you about Zepralak, 
      I would like to have an meeting with you, 
      You can contact me on ${infoObj.email} or mobile number ${infoObj.phone}`,
      html: `<p>Hi my name is: ${infoObj.name}</p>
      <p>My email is: ${infoObj.email}, or mobile number ${infoObj.phone}</p>
      <p> Message: ${infoObj.message}<p>`,
    }),
  },
};

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
