import userModel from "../models/userModel.js";
import followModel from "../models/followModel.js"; // ✅ Import Follow model

const unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const currentUserId = req.session.userId;

    if (!followingId) {
      return res.status(400).json({ error: "followingId is required" });
    }

    if (currentUserId.toString() === followingId) {
      return res.status(400).json({ error: "Cannot unfollow yourself" });
    }

    const result = await followModel.findOneAndDelete({
      followerId: currentUserId,
      followingId: followingId,
    });

    if (!result) {
      return res.status(404).json({ error: "Not following this user" });
    }

    res.status(200).json({ message: "Unfollowed successfully!" });
  } catch (error) {
    res.status(500).json({
      error: "Cannot unfollow user",
      message: error.message,
    });
  }
};

export { unfollowUser };
