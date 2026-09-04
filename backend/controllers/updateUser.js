import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
const updateUsername = async (req, res) => {
  try {
    const userId = req.session.userId;
    const username = req.body.username;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { username } },
      { new: true, upsert: false },
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "username updated" });
  } catch (err) {
    next(err);
  }
};
const updatePP = async (req, res) => {
  try {
    const userId = req.session.userId;
    const imgURL = req.file ? req.file.path : null;
    const imgPublicId = req.file ? req.file.filename : null;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          profile_picture_url: imgURL,
          profile_picture_id: imgPublicId,
        },
      },
      { new: true, upsert: false },
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      message: "profile picture updated",
      profile_picture_url: updatedUser.profile_picture_url,
    });
  } catch (err) {
    next(err);
  }
};
const updatePassword = async (req, res) => {
  try {
    const userId = req.session.userId;
    const oldPass = req.body.currentPassword;
    const newPass = req.body.newPassword;
    const user = await userModel.findOne({ _id: userId }).select("+password");
    if (!user) return res.status(400).json({ error: "User Not found" });
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong Password" });
    const hashedNewPassword = await bcrypt.hash(newPass, 10);
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          password: hashedNewPassword,
        },
      },
      { new: true, upsert: false },
    );

    res.status(200).json({ message: "password updated" });
  } catch (err) {
    next(err);
  }
};
export { updateUsername, updatePP, updatePassword };
