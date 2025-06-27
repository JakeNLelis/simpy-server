import express from "express";
import { configureExpress } from "./config/express";
import connectToDb from "./config/database";

const app = express();

configureExpress(app);
connectToDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
