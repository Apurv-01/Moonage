import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
configDotenv();

const registerController = async (req, res) => {
  try {
    const userCount = await userModel.countDocuments();
    if (userCount >= process.env.MAX_USERS) {
      return res.status(403).json({
        message: "Not accepting new signups right now.",
      });
    }
    const { username, email, password } = req.body;

    const imgURL = req.file ? req.file.path : null;
    const imgPublicId = req.file ? req.file.filename : null;
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "user already exists" });
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
  } catch (error) {
    next(err);
  }
};
export default registerController;
