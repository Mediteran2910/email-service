require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const contactRoutes = require("./routes/contact");
const corsOptions = require("./config/corsOptions");

app.use(express.json({ limit: "5mb" }));

const port = 3000;
app.use(express.json());
app.use(cors(corsOptions));

app.use(contactRoutes);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
