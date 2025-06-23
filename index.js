const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const cors = require("cors");
const upload = require("express-fileupload");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const routes = require("./routes/routes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cors({ credentials: true, origin: [process.env.CLIENT_URL] }));
app.use(upload());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
