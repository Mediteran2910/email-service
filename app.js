require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./backend/config/corsOptions");
const { sendMail } = require("./backend/utils/mailer");
const { limiter } = require("./backend/middleware/rateLimiter");
const dataObjects = require("./backend/config/dataObjects");

app.use(express.json({ limit: "5mb" }));

const port = 3000;
app.use(express.json());
app.use(cors(corsOptions));

app.get("/wake-me-up", (req, res) => {
  console.log("Morning sir, what do you need");
  res.status(200).send("Good morning");
});

app.post("/contact", limiter, async (req, res) => {
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

  const { schema } = dataObjects[origin] || {};
  if (!schema) {
    return res.status(400).json({
      success: false,
      message: "Invalid origin or configuration not found.",
    });
  }

  const { error } = schema.validate(infoObj, { abortEarly: false });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: `Invalid input data: ${errorMessage}`,
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

  try {
    await sendMail(mailTemplate);
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the message",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
