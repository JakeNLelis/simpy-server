import {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
} from "../controllers/userControllers.js";

import {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getFollowingPost,
  likeDislikePost,
  getUserPosts,
  createBookmark,
  getUserBookmarks,
} from "../controllers/postControllers.js";

import {
  createComment,
  getPostComments,
  deleteComment,
} from "../controllers/commentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

// User Routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/bookmarks", authMiddleware, getUserBookmarks);
router.get("/users/:id", authMiddleware, getUser);
router.get("/users", authMiddleware, getUsers);
router.patch("/users/:id", authMiddleware, editUser);
router.get("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser);
router.post("/users/avatar", authMiddleware, changeUserAvatar);
router.get("/users/:id/posts", authMiddleware, getUserPosts);

// Post Routes
router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getPosts);
router.get("/posts/following", authMiddleware, getFollowingPost);
router.get("/posts/:id", authMiddleware, getPost);
router.patch("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);
router.get("/posts/:id/like", authMiddleware, likeDislikePost);
router.post("/posts/:id/bookmark", authMiddleware, createBookmark);

// Comment Routes
router.post("/comments/:postId", authMiddleware, createComment);
router.get("/comments/:postId", authMiddleware, getPostComments);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

export default router;
