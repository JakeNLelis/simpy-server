import { Schema, model } from "mongoose";

const postSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  image: { type: String, default: "" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const PostModel = model("Post", postSchema);
export default PostModel;
