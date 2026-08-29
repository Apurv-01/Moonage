import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 12,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    profile_picture_url: {
      type: String,
      default: "",
    },
    profile_picture_id: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },
  },
  { timestamps: true },
);
export default mongoose.model("User", userSchema);
