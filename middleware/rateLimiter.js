const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 25,
  message: "Too many request from this IP",
});

module.exports = { limiter };
