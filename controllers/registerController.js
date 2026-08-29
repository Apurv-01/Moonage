import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const imgURL = req.file.path;
    const imgPublicId = req.file.filename;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) res.status(400).json({ error: "user already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      username,
      email,
      password: hashPass,
      profile_picture_url: imgURL,
      profile_picture_id: imgPublicId,
    });
    res.status(200).json({ msg: "user registered" });
    res.redirect("/login");
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};
export default registerController;
