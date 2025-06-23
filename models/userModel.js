const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/dh8qtzbu9/image/upload/v1750691347/emptyProfile_lbc9lp.png",
    },
    bio: { type: String, default: "No bio yet." },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
