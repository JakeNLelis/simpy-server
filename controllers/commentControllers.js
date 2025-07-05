import { HttpError } from "../config/error";
import CommentModel from "../models/commentModel";
import UserModel from "../models/userModel";
import PostModel from "../models/postModel";

// =================== Create Comment ===================
// @desc    Create a Comment
// @route   POST /api/comments/:postId
// @access  PRIVATE
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    if (!comment) {
      return next(new HttpError("Comment cannot be empty", 400));
    }
    const post = await PostModel.findById(postId).populate({
      path: "comments",
      populate: { path: "creator", select: "fullName email profilePhoto" },
      options: { sort: { createdAt: -1 } },
    });
    const newComment = await CommentModel.create({
      creator: req.user.id,
      postId,
      comment,
    });
    post.comments.push(newComment._id);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get Post Comment ===================
// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
// @access  PRIVATE
const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId)
      .populate({
        path: "creator",
        select: "fullName email profilePhoto",
      })
      .populate({
        path: "comments",
        populate: { path: "creator", select: "fullName email profilePhoto" },
        options: { sort: { createdAt: -1 } },
      });
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Delete Comment ===================
// @desc    Delete a Comment
// @route   DELETE /api/comments/:commentId
// @access  PRIVATE
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await CommentModel.findByIdAndDelete(commentId);
    res.status(200).json(comment);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export { createComment, getPostComments, deleteComment };
