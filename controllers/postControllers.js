import { HttpError } from "../config/error.js";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";

import { v4 as uuid } from "uuid";
import cloudinary from "../utils/cloudinary.js";

// =================== Create Post ===================
// @desc    Create a Post
// @route   POST /api/posts
// @access  PRIVATE
const createPost = async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body) {
      return next(new HttpError("Fill in required fields", 422));
    }
    let newPost;
    // if there is an image
    if (req.files && req.files.image) {
      const { image } = req.files;

      if (image.size > 5000000) {
        return next(
          new HttpError("Image is too big, it should be less than 5mb", 422)
        );
      }

      try {
        // Upload directly to Cloudinary using buffer data
        const result = await cloudinary.uploader.upload(
          `data:${image.mimetype};base64,${image.data.toString("base64")}`,
          {
            resource_type: "image",
            public_id: `posts/${uuid()}`, // Optional: organize uploads in folders
            quality: "auto",
            fetch_format: "auto",
          }
        );

        if (!result.secure_url) {
          return next(
            new HttpError("Couldn't upload image to cloudinary", 400)
          );
        }

        newPost = await PostModel.create({
          creator: req.user.id,
          body,
          image: result.secure_url,
        });

        await UserModel.findByIdAndUpdate(newPost.creator, {
          $push: { posts: newPost._id },
        });
      } catch (uploadError) {
        return next(
          new HttpError("Error uploading image: " + uploadError.message, 500)
        );
      }
      // If there is no image present in a post
    } else {
      newPost = await PostModel.create({ creator: req.user.id, body });
      await UserModel.findByIdAndUpdate(newPost.creator, {
        $push: { posts: newPost._id },
      });
    }
    res.status(200).json(newPost);
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
