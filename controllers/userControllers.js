const HttpError = require("../models/errorModel");

// =================== Register User ===================
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    res.json({
      message: "User registration endpoint is not implemented yet.",
    });
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

// =================== Login User ===================
// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    res.json({
      message: "User login endpoint is not implemented yet.",
    });
  } catch (error) {
    return next(new HttpError(error, 401));
  }
};

// =================== Get User Profile ===================
// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res, next) => {
  try {
    res.json({
      message: "User profile endpoint is not implemented yet.",
    });
  } catch (error) {
    return next(new HttpError(error, 404));
  }
};

// =================== Get all Users ===================
// @desc    Get user all profile
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    res.json({
      message: "Users endpoint is not implemented yet.",
    });
  } catch (error) {
    return next(new HttpError(error, 403));
  }
};

// =================== Update User's Profile ===================
// @desc    Update owner's profile
// @route   PUT /api/users/:id
// @access  Private
const editUser = async (req, res, next) => {
  try {
    res.json({
      message: "User update endpoint is not implemented yet.",
    });
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

// =================== Follow/Unfollow User ===================
// @desc    Follow or unfollow a user
// @route   GET /api/users/:id/follow-unfollow
// @access  Private
const followUnfollowUser = async (req, res, next) => {
  try {
    res.json({
      message: "Follow/Unfollow user endpoint is not implemented yet.",
    });
  } catch (error) {
    return next(new HttpError(error, 404));
  }
};

// =================== Change Profile Photo ===================
// @desc    Change user's profile photo
// @route   POST /api/users/avatar
// @access  Private
const changeUserAvatar = async (req, res, next) => {
  try {
    res.json({
      message: "Change profile photo endpoint is not implemented yet.",
    });
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
};
