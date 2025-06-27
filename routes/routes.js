import {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
} from "../controllers/userControllers";

import { authMiddleware } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

// User Routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:id", authMiddleware, getUser);
router.get("/users", authMiddleware, getUsers);
router.patch("/users/:id", authMiddleware, editUser);
router.get("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser);
router.post("/users/avatar", authMiddleware, changeUserAvatar);

export default router;
