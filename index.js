const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const cors = require("cors");
const upload = require("express-fileupload");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cors({ credentials: true, origin: [process.env.CLIENT_URL] }));
app.use(upload());

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
