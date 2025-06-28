import { HttpError } from "../config/error.js";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";

import { v4 as uuid } from "uuid";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

// =================== Create Post ===================
// @desc    Create a Post
// @route   POST /api/posts
// @access  PRIVATE
const createPost = async (req, res, next) => {
  try {
    res.json("Create Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get Post ===================
// @desc    Return a singe Post
// @route   GET /api/posts/:id
// @access  PRIVATE
const getPost = async (req, res, next) => {
  try {
    res.json("Get a Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get all Posts ===================
// @desc    Return all posts
// @route   GET /api/posts
// @access  PRIVATE
const getPosts = async (req, res, next) => {
  try {
    res.json("Get all Posts");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Update Post ===================
// @desc    Update a Post
// @route   PATCH /api/posts/:id
// @access  PRIVATE
const updatePost = async (req, res, next) => {
  try {
    res.json("Update a Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Delete Post ===================
// @desc    Delete a Post
// @route   DELETE /api/posts/:id
// @access  PRIVATE
const deletePost = async (req, res, next) => {
  try {
    res.json("Delete Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get Followings Post ===================
// @desc    Get the Post of users you followed
// @route   GET /api/posts/following
// @access  PRIVATE
const getFollowingPost = async (req, res, next) => {
  try {
    res.json("Get Following Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Like/Dislike Post ===================
// @desc    Toggle like/dislike react to a post
// @route   GET /api/posts/:id/like
// @access  PRIVATE
const likeDislikePost = async (req, res, next) => {
  try {
    res.json("Like or Dislike Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get User's Post ===================
// @desc    Return all post created by a user
// @route   GET /api/users/:id/posts
// @access  PRIVATE
const getUserPosts = async (req, res, next) => {
  try {
    res.json("Get User Post");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Create Bookmark ===================
// @desc    Add post to bookmarks
// @route   POST /api/posts/:id/bookmark
// @access  PRIVATE
const createBookmark = async (req, res, next) => {
  try {
    res.json("Create Bookmarks");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get Bookmarks ===================
// @desc    Return all post created by a user
// @route   GET /api/users/bookmarks
// @access  PRIVATE
const getUserBookmarks = async (req, res, next) => {
  try {
    res.json("Get Bookmarks");
  } catch (error) {
    return next(new HttpError(error));
  }
};

export {
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
};
