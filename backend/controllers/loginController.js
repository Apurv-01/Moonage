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

    res.status(200).json({
      msg: "Login Sucessful",
    });
  } catch (error) {
    next(err);
  }
};
export default loginController;
