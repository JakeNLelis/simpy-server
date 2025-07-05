import { HttpError } from "../config/error.js";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import CommentModel from "../models/commentModel.js";

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
    const { id } = req.params;
    const post = await PostModel.findById(id)
      .populate("creator", "fullName email profilePhoto")
      .populate({
        path: "comments",
        populate: { path: "creator", select: "fullName email profilePhoto" },
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });
    if (!post) {
      return next(new HttpError("Post doesn't exist", 404));
    }
    res.status(200).json(post);
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
    const posts = await PostModel.find()
      .populate("creator", "fullName email profilePhoto")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
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
    const { id } = req.params;
    const { body } = req.body;
    const post = await PostModel.findById(id);
    if (post.creator.toString() !== req.user.id) {
      return next(
        new HttpError("You are not authorized to update this post", 403)
      );
    }
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { body },
      { new: true }
    );
    res.status(200).json(updatedPost);
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
    const { id } = req.params;
    const post = await PostModel.findById(id);

    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    if (post.creator.toString() !== req.user.id) {
      return next(
        new HttpError("You are not authorized to delete this post", 403)
      );
    }

    // Delete image from Cloudinary if post has an image
    if (post.image && post.image.includes("cloudinary.com")) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = post.image.split("/");
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExt.split(".")[0];
        const publicId = `posts/${fileName}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
        // Don't fail the request if image deletion fails
      }
    }

    try {
      const deletedComments = await CommentModel.deleteMany({ postId: id });
      console.log(
        `Deleted ${deletedComments.deletedCount} comments for post ${id}`
      );
    } catch (commentDeleteError) {
      console.error("Error deleting comments:", commentDeleteError);
      // Don't fail the request if comment deletion fails
    }

    await UserModel.findByIdAndUpdate(post.creator, {
      $pull: { posts: post._id },
    });

    const deletedPost = await PostModel.findByIdAndDelete(id);
    res.status(200).json(deletedPost);
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
    const user = await UserModel.findById(req.user.id).select("following");

    const posts = await PostModel.find({ creator: { $in: user.following } })
      .populate("creator", "fullName email profilePhoto")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
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
    const { id } = req.params;
    const post = await PostModel.findById(id);
    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.status(200).json(post);
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
    const user = await UserModel.findById(req.params.id)
      .select("-password -__v")
      .populate({ path: "posts", options: { sort: { createdAt: -1 } } });

    res.status(200).json(user);
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
    const { id } = req.params;
    const user = await UserModel.findById(req.user.id).select("-password -__v");
    const isBookmarked = user.bookmarks.includes(id);
    if (isBookmarked) {
      user.bookmarks.pull(id);
    } else {
      user.bookmarks.push(id);
    }
    await user.save();
    res.status(200).json(user);
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
    const user = await UserModel.findById(req.user.id)
      .select("-password -__v")
      .populate({
        path: "bookmarks",
        populate: { path: "creator", select: "fullName email profilePhoto" },
      });
    res.status(200).json(user);
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
