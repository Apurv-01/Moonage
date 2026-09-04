import followModel from "../models/followModel.js";
import userModel from "../models/userModel.js";
const fetchFollowersList = async (req, res) => {
  try {
    const userId = req.session.userId;
    const followers = await followModel.find({
      followingId: userId,
    });
    const followersIds = followers.map((f) => f.followerId);
    const followerList = await userModel
      .find({
        _id: { $in: followersIds },
      })
      .select("username email");
    console.log(followerList);
    res.status(200).json({
      followerList,
    });
  } catch (err) {
    next(err);
  }
};
const fetchFollowingList = async (req, res) => {
  try {
    const userId = req.session.userId;
    const following = await followModel.find({
      followerId: userId,
    });
    const followingIds = following.map((f) => f.followingId);
    const followingList = await userModel
      .find({
        _id: { $in: followingIds },
      })
      .select("username email");

    res.status(200).json({
      followingList,
    });
  } catch (err) {
    next(err);
  }
};
export { fetchFollowersList, fetchFollowingList };
