const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNEW,
    pass: process.env.GMAIL_PASSNEW,
  },
});

function sendMail(mailTemplate) {
  return transporter.sendMail(mailTemplate);
}

module.exports = { sendMail };
