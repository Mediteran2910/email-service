const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function sendMail(mailTemplate) {
  return transporter.sendMail(mailTemplate);
}

module.exports = { sendMail };
