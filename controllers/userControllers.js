import { HttpError } from "../config/error.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
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
      profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName
      )}&background=random`,
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
    res
      .status(200)
      .json({
        token,
        id: user?._id,
        name: user?.fullName,
        profilePhoto: user?.profilePhoto,
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
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("No file uploaded.", 422));
    }
    const { avatar } = req.files;
    if (avatar.size > 1000000) {
      return next(
        new HttpError("Profile photo is too big. Should be less than 1mb", 422)
      );
    }

    try {
      // Get current user to check existing avatar
      const currentUser = await UserModel.findById(req.user.id);
      if (!currentUser) {
        return next(new HttpError("User not found.", 404));
      }

      // Upload new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${avatar.mimetype};base64,${avatar.data.toString("base64")}`,
        {
          resource_type: "image",
          public_id: `avatars/${uuid()}`,
          quality: "auto",
          fetch_format: "auto",
        }
      );

      if (!result || !result.secure_url) {
        return next(new HttpError("Can't upload image to Cloudinary.", 422));
      }

      if (
        currentUser.profilePhoto &&
        currentUser.profilePhoto.includes("cloudinary.com") &&
        !currentUser.profilePhoto.includes("ui-avatars.com")
      ) {
        try {
          // Extract public_id from the Cloudinary URL
          const urlParts = currentUser.profilePhoto.split("/");
          const fileNameWithExt = urlParts[urlParts.length - 1];
          const fileName = fileNameWithExt.split(".")[0];
          const publicId = `avatars/${fileName}`;

          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.error("Error deleting old avatar:", deleteError);
          // Don't fail the request if deletion fails
        }
      }

      // Update user avatar URL in the database
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user.id,
        {
          profilePhoto: result.secure_url,
        },
        { new: true }
      ).select("-password -__v");

      res.status(200).json(updatedUser);
    } catch (uploadError) {
      return next(
        new HttpError("Error uploading avatar: " + uploadError.message, 500)
      );
    }
  } catch (error) {
    return next(new HttpError(error.message || "An error occurred", 500));
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
