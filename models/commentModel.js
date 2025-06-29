import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentModel = model("Comment", commentSchema);
export default CommentModel;
