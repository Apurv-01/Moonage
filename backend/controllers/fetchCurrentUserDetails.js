import mongoose from "mongoose";
import userModel from "../models/userModel.js";
const getLoggedInUserDetails = async (req, res) => {
  try {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
    const userId = req.session.userId;
    const currentUser = await userModel.findById(userId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      userId: currentUser._id,
      username: currentUser.username,
      pp: currentUser.profile_picture_url,
    });
  } catch (err) {
    next(err);
  }
};

export { getLoggedInUserDetails };
