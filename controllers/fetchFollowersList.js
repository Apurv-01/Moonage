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
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
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
    console.log(followingList);

    res.status(200).json({
      followingList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
export { fetchFollowersList, fetchFollowingList };
