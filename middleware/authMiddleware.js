import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import { HttpError } from "../config/error.js";

export async function authMiddleware(req, res, next) {
  try {
    let token = req.headers.authorization || req.headers.Authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded.id).select("-password -__v");
      next();
    } else {
      return next(new HttpError("Unauthorized", 403));
    }
  } catch (error) {
    return next(new HttpError(error.message, 403));
  }
}
