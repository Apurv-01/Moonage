import followModel from "../models/followModel.js";

const followUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    const personToFollow = req.body.followingId;
    const follow = await followModel.create({
      followerId: userId,
      followingId: personToFollow,
    });
    res.status(200).json({ message: "Person Followed" });
  } catch (error) {
    res.status(500).json({
      error: "Cannot Follow Server Error",
      message: error.message,
    });
  }
};
export default followUser;
