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
  } catch (err) {
    next(err);
  }
};
export default followUser;
