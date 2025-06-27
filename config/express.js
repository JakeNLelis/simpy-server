import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import upload from "express-fileupload";
import { notFound, errorHandler } from "../middleware/errorMiddleware.js";
import router from "../routes/routes.js";

dotenv.config();

export const configureExpress = (app) => {
  app.use(express.json({ extended: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ credentials: true, origin: [process.env.CLIENT_URL] }));
  app.use(upload());

  app.use("/api", router);

  app.use(notFound);
  app.use(errorHandler);
};
