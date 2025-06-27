const HttpError = require("../models/errorModel");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

// =================== Register User ===================
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || !confirmPassword) {
      return next(new HttpError("All fields are required.", 422));
    }
    const lowerEmail = email.toLowerCase();
    const emailExist = await UserModel.findOne({ email: lowerEmail });
    if (emailExist) {
      return next(new HttpError("Email already exists.", 422));
    }

    if (password !== confirmPassword) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    if (password.length < 8) {
      return next(
        new HttpError("Password must be at least 8 characters long.", 422)
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      fullName,
      email: lowerEmail,
      password: hashedPassword,
    });
    res.json(newUser).status(201);
  } catch (error) {
    return next(new HttpError(error));
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
    return next(new HttpError(error));
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
    return next(new HttpError(error));
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
    return next(new HttpError(error));
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
    return next(new HttpError(error));
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
    return next(new HttpError(error));
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
    return next(new HttpError(error));
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
