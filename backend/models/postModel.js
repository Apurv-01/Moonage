import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postTitle: {
      type: String,
      maxlength: 100,
    },
    postContent: {
      type: String,
      maxlength: 1000,
      required: true,
    },
    postMedia: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
