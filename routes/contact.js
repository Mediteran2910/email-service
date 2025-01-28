const express = require("express");
const router = express.Router();
const { sendMail } = require("../utils/mailer");
const { limiter } = require("../middleware/rateLimiter");
const dataObjects = require("../config/dataObjects");

router.post("/contact", limiter, async (req, res) => {
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

module.exports = router;
