import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username }).select("+password");
    if (!user) return res.status(400).json({ error: "User Not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong Password" });
    req.session.userId = user._id;
    req.session.pp = user.profile_picture_url;
    req.session.username = user.username;
    res.status(200).json({
      msg: "Login Sucessful",
    });
  } catch (error) {
    res.status(500).json({
      error: "server Error",
      message: error.message,
    });
  }
};
export default loginController;
