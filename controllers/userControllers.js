import { HttpError } from "../config/error";
import UserModel from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import cloudinary from "../utils/cloudinary.js";

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
    res.status(201).json(newUser);
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
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Email and password are required.", 422));
    }
    const lowerEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: lowerEmail });
    if (!user) {
      return next(new HttpError("Invalid email.", 404));
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      return next(new HttpError("Invalid password.", 401));
    }

    const token = jwt.sign(
      { id: user?._id, email: user?.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({ token, id: user?._id, name: user?.fullName });
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
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password -__v");
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }
    res.status(200).json(user);
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
    const users = await UserModel.find().select("-password -__v");
    res.status(200).json(users);
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
    const { fullName, bio } = req.body;
    const editUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { fullName, bio },
      { new: true }
    ).select("-password -__v");
    res.status(200).json(editUser);
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
    const userToFollowId = req.params.id;
    if (req.user.id === userToFollowId) {
      return next(new HttpError("You cannot follow/unfollow yourself.", 422));
    }
    const currentUser = await UserModel.findById(req.user.id);
    const isFollowing = currentUser.following.includes(userToFollowId);
    if (!isFollowing) {
      const updateUser = await UserModel.findByIdAndUpdate(
        userToFollowId,
        { $push: { followers: req.user.id } },
        { new: true }
      );
      await UserModel.findByIdAndUpdate(
        req.user.id,
        { $push: { following: userToFollowId } },
        { new: true }
      );
      res.status(200).json({
        message: `You are now following ${updateUser.fullName}.`,
      });
    } else {
      const updateUser = await UserModel.findByIdAndUpdate(
        userToFollowId,
        { $pull: { followers: req.user.id } },
        { new: true }
      );
      await UserModel.findByIdAndUpdate(
        req.user.id,
        { $pull: { following: userToFollowId } },
        { new: true }
      );
      res.status(200).json({
        message: `You have unfollowed ${updateUser.fullName}.`,
      });
    }
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
    if (!req.files.avatar) {
      return next(new HttpError("No file uploaded.", 422));
    }
    const { avatar } = req.files;
    if (avatar.size > 1000000) {
      return next(
        new HttpError("Profile photo is too big. Should be less than 1mb", 422)
      );
    }

    let fileName = avatar.name;
    let splitedFileName = fileName.split(".");
    let newFileName =
      splitedFileName[0] +
      uuid() +
      "." +
      splitedFileName[splitedFileName.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err, 500));
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(
          path.join(__dirname, "..", "uploads", newFileName),
          {
            resource_type: "image",
          }
        );
        if (!result || !result.secure_url) {
          return next(new HttpError("Can't upload image to Cloudinary.", 422));
        }

        // Update user avatar URL in the database
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.user.id,
          {
            profilePhoto: result.secure_url,
          },
          { new: true }
        ).select("-password -__v");

        // Remove the file from local storage
        fs.unlinkSync(path.join(__dirname, "..", "uploads", newFileName));
        res.status(200).json(updatedUser);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

export {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
};
