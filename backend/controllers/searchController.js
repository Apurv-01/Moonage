import mongoose from "mongoose";
import userModel from "../models/userModel.js";
const findUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || !query.trim()) return res.status(200).json({ users: [] });
    const users = await userModel
      .find({
        username: { $regex: query, $options: "i" },
      })
      .select("_id username profile_picture_url")
      .limit(10);
    return res.status(200).json({ users: users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { findUsers };
